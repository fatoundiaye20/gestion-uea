<?php
// app/Http/Controllers/UserController.php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    public function store(Request $request)
    {
        // Rediriger vers AuthController::createUser
        return app(AuthController::class)->createUser($request);
    }

    public function index(Request $request)
    {
        $query = User::with('filiere');
        $user = $request->user();

        // Filtrer selon le rôle
        if ($user->role === 'responsable_metier' && $user->filiere_id) {
            $query->where(function($q) use ($user) {
                $q->where('filiere_id', $user->filiere_id)
                ->orWhereNull('filiere_id');
            });
        }

        if ($request->has('role')) {
            $role = $request->role;
            $query->where('role', $role);
            
            // ✅ AJOUT - Charger les relations selon le rôle
            if ($role === 'enseignant') {
                $query->with('seances.uea');
            } elseif ($role === 'responsable_metier') {
                $query->with(['ueas', 'seances']);
            }
        }

        if ($request->has('filiere_id')) {
            $query->where('filiere_id', $request->filiere_id);
        }

        return response()->json($query->get());
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);
        $currentUser = $request->user();

        if ($currentUser->role === 'responsable_metier') {
            if ($user->filiere_id !== $currentUser->filiere_id && $user->filiere_id !== null) {
                return response()->json(['message' => 'Non autorisé'], 403);
            }
            
            if (in_array($user->role, ['chef_dep', 'responsable_metier'])) {
                return response()->json(['message' => 'Non autorisé à modifier ce type d\'utilisateur'], 403);
            }
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|string|email|max:255|unique:users,email,' . $id . '|regex:/@isep-thies\.edu\.sn$/',
            'password' => 'sometimes|string|min:8',
            'telephone' => 'nullable|string|max:20',
            'specialite' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $request->except(['role', 'filiere_id']);

        if ($request->has('password')) {
            $data['password'] = Hash::make($request->password);
        }

        $user->update($data);

        return response()->json([
            'message' => 'Utilisateur mis à jour avec succès',
            'user' => $user->load('filiere')
        ]);
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $currentUser = request()->user();

        if ($currentUser->role !== 'chef_dep') {
            return response()->json(['message' => 'Seul le chef de département peut supprimer des utilisateurs'], 403);
        }

        if ($user->id === $currentUser->id) {
            return response()->json(['message' => 'Vous ne pouvez pas vous supprimer vous-même'], 422);
        }

        $user->delete();

        return response()->json(['message' => 'Utilisateur supprimé avec succès']);
    }

    public function getChef(Request $request)
    {
        $chef = $request->user();

        if ($chef->role !== 'chef_dep') {
            return response()->json(['message' => 'Accès refusé'], 403);
        }

        return response()->json([
            'id' => $chef->id,
            'name' => $chef->name,
            'email' => $chef->email,
            'telephone' => $chef->telephone
        ]);
    }
}