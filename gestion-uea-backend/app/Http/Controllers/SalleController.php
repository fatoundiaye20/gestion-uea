<?php
// app/Http/Controllers/SalleController.php

namespace App\Http\Controllers;

use App\Models\Salle;
use App\Models\Seance;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SalleController extends Controller
{
    public function index()
    {
        $salles = Salle::with(['seances' => function($query) {
            $query->where('date', '>=', now()->toDateString());
        }])->get();
        
        return response()->json($salles);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nom' => 'required|string|max:255|unique:salles',
            'capacite' => 'nullable|integer|min:1',
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $salle = Salle::create($request->all());

        return response()->json([
            'message' => 'Salle créée avec succès',
            'salle' => $salle
        ], 201);
    }

    public function show($id)
    {
        return response()->json(Salle::with(['seances.uea', 'seances.enseignant'])->findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $salle = Salle::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'nom' => 'sometimes|string|max:255|unique:salles,nom,' . $id,
            'capacite' => 'nullable|integer|min:1',
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $salle->update($request->all());

        return response()->json([
            'message' => 'Salle mise à jour avec succès',
            'salle' => $salle
        ]);
    }

    public function destroy($id)
    {
        Salle::findOrFail($id)->delete();
        return response()->json(['message' => 'Salle supprimée avec succès']);
    }

    public function verifierDisponibilite(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'date' => 'required|date',
            'heure_debut' => 'required|date_format:H:i',
            'heure_fin' => 'required|date_format:H:i|after:heure_debut',
            'seance_id' => 'nullable|exists:seances,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $salle = Salle::findOrFail($id);
        
        $query = Seance::where('salle_id', $id)
            ->where('date', $request->date)
            ->where(function($q) use ($request) {
                $q->whereBetween('heure_debut', [$request->heure_debut, $request->heure_fin])
                  ->orWhereBetween('heure_fin', [$request->heure_debut, $request->heure_fin])
                  ->orWhere(function($q2) use ($request) {
                      $q2->where('heure_debut', '<=', $request->heure_debut)
                         ->where('heure_fin', '>=', $request->heure_fin);
                  });
            });

        if ($request->has('seance_id')) {
            $query->where('id', '!=', $request->seance_id);
        }

        $conflits = $query->with(['uea', 'enseignant'])->get();

        return response()->json([
            'disponible' => $conflits->isEmpty(),
            'conflits' => $conflits,
            'salle' => $salle->only(['id', 'nom'])
        ]);
    }
}