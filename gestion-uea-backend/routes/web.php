<?php
// routes/web.php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\FiliereController;
use App\Http\Controllers\UeaController;
use App\Http\Controllers\SalleController;
use App\Http\Controllers\SeanceController;
use App\Http\Controllers\DashboardController;

Route::prefix('api')->group(function () {
    // Routes publiques
    Route::post('/login', [AuthController::class, 'login']);

    // Routes protégées par Sanctum
    Route::middleware(['auth:sanctum'])->group(function () {
        // Auth
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/create-user', [AuthController::class, 'createUser']); // ✅ ajout ici

        // Users
        Route::apiResource('users', UserController::class);
        Route::get('/enseignants', [UserController::class, 'enseignants']);

        // Filières
        Route::apiResource('filieres', FiliereController::class);

        // UEAs
        Route::apiResource('ueas', UeaController::class);
        Route::get('/ueas/{id}/statistiques', [UeaController::class, 'statistiques']);

        // Salles
        Route::apiResource('salles', SalleController::class);
        Route::get('/salles/{id}/disponibilite', [SalleController::class, 'verifierDisponibilite']);

        // Séances
        Route::apiResource('seances', SeanceController::class);
        Route::put('/seances/{id}/realiser', [SeanceController::class, 'realiser']);
        Route::get('/seances/planning/hebdomadaire', [SeanceController::class, 'planningHebdomadaire']);

        // Dashboard
        Route::get('/dashboard/statistiques', [DashboardController::class, 'statistiques']);
        Route::get('/dashboard/calendrier', [DashboardController::class, 'calendrier']);
    });
});
