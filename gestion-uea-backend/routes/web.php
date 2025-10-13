<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\FiliereController;
use App\Http\Controllers\UeaController;
use App\Http\Controllers\SalleController;
use App\Http\Controllers\SeanceController;
use App\Http\Controllers\DashboardController;

Route::get('/', function () {
    return view('welcome');
});

Route::prefix('api')->group(function () {

    // Routes publiques
    Route::post('/login', [AuthController::class, 'login']);

    // Routes protégées par Sanctum
    Route::middleware(['web', 'auth:sanctum'])->group(function () {

        Route::get('/notifications/alerts', [NotificationController::class, 'getAlerts']);

        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/create-user', [AuthController::class, 'createUser']);
        // Statistiques
        Route::get('/statistiques', [DashboardController::class, 'statistiques']);
        Route::get('/dashboard/statistiques', [DashboardController::class, 'statistiques']);

        // Calendrier des séances
        Route::get('/seances/calendrier', [SeanceController::class, 'calendrier']);

        // Liste des enseignants
        Route::get('/enseignants', [UserController::class, 'enseignants']);

        // UEAs
        Route::apiResource('ueas', UeaController::class);

        // Salles
        Route::apiResource('salles', SalleController::class);
        Route::get('/salles/{id}/disponibilite', [SalleController::class, 'verifierDisponibilite']);

        // Route GET chef-departement
        Route::get('/chef-departement', function (Request $request) {
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
        });

        // Route PUT chef-departement
        Route::put('/chef-departement', function (Request $request) {
            $chef = $request->user();

            if ($chef->role !== 'chef_dep') {
                return response()->json(['message' => 'Accès refusé'], 403);
            }

            $validated = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:users,email,' . $chef->id,
                'telephone' => 'nullable|string|max:20',
                'password' => 'nullable|string|min:8'
            ]);

            if ($validated->fails()) {
                return response()->json(['errors' => $validated->errors()], 422);
            }

            $data = $request->only(['name', 'email', 'telephone']);
            if ($request->filled('password')) {
                $data['password'] = Hash::make($request->password);
            }

            $chef->update($data);

            return response()->json(['message' => 'Chef mis à jour avec succès']);
        });

        // Autres routes...
        Route::apiResource('users', UserController::class);
        Route::get('/enseignants', [UserController::class, 'enseignants']);
        Route::apiResource('filieres', FiliereController::class);
        Route::apiResource('ueas', UeaController::class);
        Route::get('/ueas/{id}/statistiques', [UeaController::class, 'statistiques']);
        Route::apiResource('salles', SalleController::class);
        Route::get('/salles/{id}/disponibilite', [SalleController::class, 'verifierDisponibilite']);
        Route::apiResource('seances', SeanceController::class);
        Route::put('/seances/{id}/realiser', [SeanceController::class, 'realiser']);
        Route::get('/seances/planning/hebdomadaire', [SeanceController::class, 'planningHebdomadaire']);
        Route::get('/dashboard/statistiques', [DashboardController::class, 'statistiques']);
        Route::get('/dashboard/calendrier', [DashboardController::class, 'calendrier']);
    });
    Route::middleware('auth:sanctum')->group(function () {
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::get('/chef-departement', [UserController::class, 'getChef']);
    // ... autres routes
});
});
