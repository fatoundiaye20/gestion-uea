<?php
// app/Http/Controllers/FiliereController.php

namespace App\Http\Controllers;

use App\Models\Filiere;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class FiliereController extends Controller
{
    public function index()
    {
        return response()->json(Filiere::with(['users', 'ueas'])->get());
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nom' => 'required|string|max:255|unique:filieres',
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $filiere = Filiere::create($request->all());

        return response()->json([
            'message' => 'Filière créée avec succès',
            'filiere' => $filiere
        ], 201);
    }

    public function show($id)
    {
        return response()->json(Filiere::with(['users', 'ueas'])->findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $filiere = Filiere::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'nom' => 'sometimes|string|max:255|unique:filieres,nom,' . $id,
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $filiere->update($request->all());

        return response()->json([
            'message' => 'Filière mise à jour avec succès',
            'filiere' => $filiere
        ]);
    }

    public function destroy($id)
    {
        Filiere::findOrFail($id)->delete();
        return response()->json(['message' => 'Filière supprimée avec succès']);
    }
}