<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class AuthController extends Controller
{

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email',
            'password' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Récupérer l'utilisateur
        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Identifiants incorrects'
            ], 401);
        }

        // Créer un token API (si tu utilises Sanctum ou Passport)
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Connexion réussie',
            'user' => $user,
            'token' => $token
        ], 200);
    }

    public function me(Request $request)
    {
        return response()->json([
            'user' => $request->user()
        ]);
    }



    public function createUser(Request $request)
    {
        // Seul le chef de département peut créer des utilisateurs
        if (!$request->user() || $request->user()->role !== 'chef_dep') {
            return response()->json(['message' => 'Seul le chef de département peut créer des utilisateurs'], 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users|regex:/@isep-thies\.edu\.sn$/',
            'role' => 'required|in:chef_dep,enseignant,assistant,responsable_metier',
            'filiere_id' => 'required_if:role,responsable_metier|nullable|exists:filieres,id',
            'telephone' => 'nullable|string|max:20',
            'specialite' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Vérifier qu'un seul responsable par filière
        if ($request->role === 'responsable_metier' && $request->filiere_id) {
            $existingResponsable = User::where('role', 'responsable_metier')
                ->where('filiere_id', $request->filiere_id)
                ->first();
            
            if ($existingResponsable) {
                return response()->json([
                    'message' => 'Un responsable existe déjà pour cette filière'
                ], 422);
            }
        }

        // Générer un mot de passe temporaire
        $temporaryPassword = Str::random(12);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($temporaryPassword),
            'role' => $request->role,
            'filiere_id' => $request->filiere_id,
            'telephone' => $request->telephone,
            'specialite' => $request->specialite,
        ]);

        // Envoyer l'email avec les identifiants
        try {
            Mail::send('emails.new-user', [
                'user' => $user,
                'password' => $temporaryPassword
            ], function ($message) use ($user) {
                $message->to($user->email, $user->name)
                        ->subject('Vos identifiants ISEP-Thiès - Gestion UEA');
            });
        } catch (\Exception $e) {
            // Si l'envoi d'email échoue, on supprime l'utilisateur créé
            $user->delete();
            return response()->json([
                'message' => 'Erreur lors de l\'envoi de l\'email. Utilisateur non créé.',
                'error' => $e->getMessage()
            ], 500);
        }

        return response()->json([
            'message' => 'Utilisateur créé avec succès. Identifiants envoyés par email.',
            'user' => $user->load('filiere'),
            'temporary_password' => $temporaryPassword // Pour debug, à enlever en production
        ], 201);
    }

    public function createChefDepartement(Request $request)
    {
        // Seul le chef de département actuel peut créer un nouveau chef
        if (!$request->user() || $request->user()->role !== 'chef_dep') {
            return response()->json(['message' => 'Seul le chef de département peut créer un nouveau chef'], 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users|regex:/@isep-thies\.edu\.sn$/',
            'telephone' => 'nullable|string|max:20',
            'responsable_metier_to_delete' => 'required|exists:users,id'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Vérifier que l'utilisateur à supprimer est bien un responsable de métier
        $responsableToDelete = User::find($request->responsable_metier_to_delete);
        if (!$responsableToDelete || $responsableToDelete->role !== 'responsable_metier') {
            return response()->json([
                'message' => 'L\'utilisateur spécifié n\'est pas un responsable de métier'
            ], 422);
        }

        // Générer un mot de passe temporaire
        $temporaryPassword = Str::random(12);

        try {
            // Créer le nouveau chef de département
            $newChef = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($temporaryPassword),
                'role' => 'chef_dep',
                'telephone' => $request->telephone,
            ]);

            // Envoyer l'email
            Mail::send('emails.new-chef', [
                'user' => $newChef,
                'password' => $temporaryPassword
            ], function ($message) use ($newChef) {
                $message->to($newChef->email, $newChef->name)
                        ->subject('Nomination Chef de Département - ISEP-Thiès');
            });

            return response()->json([
                'message' => 'Nouveau chef de département créé avec succès. Identifiants envoyés par email.',
                'user' => $newChef,
                'deleted_user' => $responsableToDelete->name
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de la création du chef de département',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}