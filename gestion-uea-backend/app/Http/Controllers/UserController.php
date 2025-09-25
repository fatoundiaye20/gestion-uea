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
            // Le responsable ne voit que les utilisateurs de sa filière
            $query->where(function($q) use ($user) {
                $q->where('filiere_id', $user->filiere_id)
                ->orWhereNull('filiere_id'); // Inclure les assistants
            });
        }

        if ($request->has('role')) {
            $query->where('role', $request->role);
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

        // Vérifications de permissions
        if ($currentUser->role === 'responsable_metier') {
            // Le responsable ne peut modifier que les utilisateurs de sa filière
            if ($user->filiere_id !== $currentUser->filiere_id && $user->filiere_id !== null) {
                return response()->json(['message' => 'Non autorisé'], 403);
            }
            
            // Le responsable ne peut pas modifier un chef de département ou un autre responsable
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

        $data = $request->except(['role', 'filiere_id']); // Empêcher la modification du rôle et filière

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

        // Seul le chef de département peut supprimer
        if ($currentUser->role !== 'chef_dep') {
            return response()->json(['message' => 'Seul le chef de département peut supprimer des utilisateurs'], 403);
        }

        // Ne peut pas se supprimer lui-même
        if ($user->id === $currentUser->id) {
            return response()->json(['message' => 'Vous ne pouvez pas vous supprimer vous-même'], 422);
        }

        $user->delete();

        return response()->json(['message' => 'Utilisateur supprimé avec succès']);
    }
}