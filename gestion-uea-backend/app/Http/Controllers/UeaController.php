<?php
// app/Http/Controllers/UeaController.php

namespace App\Http\Controllers;

use App\Models\Uea;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class UeaController extends Controller
{
    public function index(Request $request)
    {
        $query = Uea::with(['filiere', 'seances']);

        if ($request->has('filiere_id')) {
            $query->where('filiere_id', $request->filiere_id);
        }

        if ($request->has('semestre')) {
            $query->where('semestre', $request->semestre);
        }

        if ($request->has('niveau')) {
            $query->where('niveau', $request->niveau);
        }

        $ueas = $query->get();

        $ueas->each(function ($uea) {
            $uea->volume_horaire_effectue = $uea->volume_horaire_effectue;
            $uea->volume_horaire_restant = $uea->volume_horaire_restant;
            $uea->taux_execution = $uea->taux_execution;
            $uea->est_terminee = $uea->est_terminee;
        });

        return response()->json($ueas);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'code' => 'required|string|max:50|unique:ueas',
            'nom' => 'required|string|max:255',
            'description' => 'nullable|string',
            'volume_horaire_total' => 'required|integer|min:1',
            'filiere_id' => 'required|exists:filieres,id',
            'semestre' => 'required|in:S1,S2,S3,S4',
            'niveau' => 'required|in:1re_annee,2e_annee',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $uea = Uea::create($request->all());

        return response()->json([
            'message' => 'UEA créée avec succès',
            'uea' => $uea->load('filiere')
        ], 201);
    }

    public function show($id)
    {
        $uea = Uea::with(['filiere', 'seances.enseignant', 'seances.salle'])->findOrFail($id);
        
        $uea->volume_horaire_effectue = $uea->volume_horaire_effectue;
        $uea->volume_horaire_restant = $uea->volume_horaire_restant;
        $uea->taux_execution = $uea->taux_execution;
        $uea->est_terminee = $uea->est_terminee;

        return response()->json($uea);
    }

    public function update(Request $request, $id)
    {
        $uea = Uea::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'code' => 'sometimes|string|max:50|unique:ueas,code,' . $id,
            'nom' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'volume_horaire_total' => 'sometimes|integer|min:1',
            'filiere_id' => 'sometimes|exists:filieres,id',
            'semestre' => 'sometimes|in:S1,S2,S3,S4',
            'niveau' => 'sometimes|in:1re_annee,2e_annee',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $uea->update($request->all());

        return response()->json([
            'message' => 'UEA mise à jour avec succès',
            'uea' => $uea->load('filiere')
        ]);
    }

    public function destroy($id)
    {
        Uea::findOrFail($id)->delete();
        return response()->json(['message' => 'UEA supprimée avec succès']);
    }

    public function statistiques($id)
    {
        $uea = Uea::with(['seances' => function($query) {
            $query->where('statut', 'realisee');
        }])->findOrFail($id);

        return response()->json([
            'uea' => $uea->only(['id', 'code', 'nom', 'volume_horaire_total']),
            'seances_realisees' => $uea->seances->count(),
            'seances_prevues' => $uea->seances()->count(),
            'volume_horaire_effectue' => $uea->volume_horaire_effectue,
            'volume_horaire_restant' => $uea->volume_horaire_restant,
            'taux_execution' => $uea->taux_execution,
            'est_terminee' => $uea->est_terminee,
        ]);
    }
}