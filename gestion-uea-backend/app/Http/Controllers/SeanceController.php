<?php

namespace App\Http\Controllers;

use App\Models\Seance;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class SeanceController extends Controller
{
    // Lister toutes les séances avec filtres
    public function index(Request $request)
    {
        $query = Seance::with(['salle', 'enseignant', 'uea.filiere']);
        $user = $request->user();

        // Filtrage selon rôle
        if ($user->role === 'responsable_metier' && $user->filiere_id) {
            $query->whereHas('uea', function($q) use ($user) {
                $q->where('filiere_id', $user->filiere_id);
            });
        }

        // Filtres supplémentaires
        if ($request->has('enseignant_id')) $query->where('enseignant_id', $request->enseignant_id);
        if ($request->has('uea_id')) $query->where('uea_id', $request->uea_id);
        if ($request->has('salle_id')) $query->where('salle_id', $request->salle_id);
        if ($request->has('statut')) $query->where('statut', $request->statut);
        if ($request->has('date_debut') && $request->has('date_fin')) {
            $query->whereBetween('date', [$request->date_debut, $request->date_fin]);
        }

        $seances = $query->orderBy('date')->orderBy('heure_debut')->get();
        return response()->json($seances);
    }

    // Créer une séance
    public function store(Request $request)
    {
        $user = $request->user();

        if (!in_array($user->role, ['chef_dep', 'responsable_metier'])) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $validator = Validator::make($request->all(), [
            'date' => 'required|date|after_or_equal:today',
            'heure_debut' => 'required|date_format:H:i',
            'heure_fin' => 'required|date_format:H:i|after:heure_debut',
            'duree' => 'required|in:4h,8h',
            'salle_id' => 'required|exists:salles,id',
            'enseignant_id' => 'required|exists:users,id',
            'uea_id' => 'required|exists:ueas,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Vérifications pour responsable_metier
        if ($user->role === 'responsable_metier') {
            $uea = \App\Models\Uea::find($request->uea_id);
            if ($uea->filiere_id !== $user->filiere_id) {
                return response()->json(['message' => 'Vous ne pouvez créer des séances que pour votre filière'], 403);
            }
        }

        $enseignant = User::find($request->enseignant_id);
        if (!$enseignant || $enseignant->role !== 'enseignant') {
            return response()->json(['message' => 'Enseignant invalide'], 422);
        }

        // Vérifier disponibilité de la salle
        $conflitSalle = Seance::where('salle_id', $request->salle_id)
            ->where('date', $request->date)
            ->where(function($q) use ($request) {
                $q->whereBetween('heure_debut', [$request->heure_debut, $request->heure_fin])
                  ->orWhereBetween('heure_fin', [$request->heure_debut, $request->heure_fin])
                  ->orWhere(function($q2) use ($request) {
                      $q2->where('heure_debut', '<=', $request->heure_debut)
                         ->where('heure_fin', '>=', $request->heure_fin);
                  });
            })->exists();

        if ($conflitSalle) {
            return response()->json(['message' => 'La salle n\'est pas disponible à cette date et heure'], 422);
        }

        $seance = Seance::create(array_merge($request->all(), ['statut' => 'validee']));

        return response()->json([
            'message' => 'Séance créée avec succès',
            'seance' => $seance->load(['salle', 'enseignant', 'uea'])
        ], 201);
    }

    // Supprimer une séance
    public function destroy($id)
    {
        $user = request()->user();

        if (!in_array($user->role, ['chef_dep', 'responsable_metier'])) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $seance = Seance::find($id);
        if (!$seance) {
            return response()->json(['message' => 'Séance non trouvée'], 404);
        }

        $seance->delete();

        return response()->json(['message' => 'Séance supprimée avec succès']);
    }

    // Planning hebdomadaire
    public function planningHebdomadaire(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'date' => 'nullable|date',
            'filiere_id' => 'nullable|exists:filieres,id',
            'enseignant_id' => 'nullable|exists:users,id',
            'salle_id' => 'nullable|exists:salles,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $date = $request->get('date', now()->toDateString());
        $startOfWeek = Carbon::parse($date)->startOfWeek();
        $endOfWeek = Carbon::parse($date)->endOfWeek();

        $query = Seance::with(['salle', 'enseignant', 'uea.filiere'])
            ->whereBetween('date', [$startOfWeek, $endOfWeek]);

        if ($request->has('filiere_id')) {
            $query->whereHas('uea', function($q) use ($request) {
                $q->where('filiere_id', $request->filiere_id);
            });
        }

        if ($request->has('enseignant_id')) {
            $query->where('enseignant_id', $request->enseignant_id);
        }

        if ($request->has('salle_id')) {
            $query->where('salle_id', $request->salle_id);
        }

        $user = $request->user();
        if ($user && $user->role === 'responsable_metier' && $user->filiere_id) {
            $query->whereHas('uea', function($q) use ($user) {
                $q->where('filiere_id', $user->filiere_id);
            });
        }

        $seances = $query->orderBy('date')->orderBy('heure_debut')->get();

        $planning = [];
        for ($i = 0; $i < 7; $i++) {
            $jour = $startOfWeek->copy()->addDays($i);
            $planning[$jour->format('Y-m-d')] = [
                'date' => $jour->format('Y-m-d'),
                'jour' => $jour->format('l'),
                'seances' => $seances->where('date', $jour->format('Y-m-d'))->values()
            ];
        }

        return response()->json([
            'semaine' => [
                'debut' => $startOfWeek->format('Y-m-d'),
                'fin' => $endOfWeek->format('Y-m-d'),
            ],
            'planning' => array_values($planning)
        ]);
    }
}
