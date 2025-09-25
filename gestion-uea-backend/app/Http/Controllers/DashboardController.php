<?php
// app/Http/Controllers/DashboardController.php

namespace App\Http\Controllers;

use App\Models\Uea;
use App\Models\Seance;
use App\Models\Filiere;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\Validator;

class DashboardController extends Controller
{
    public function statistiques(Request $request)
    {
        $user = $request->user();
        $query = Uea::with(['seances', 'filiere']);

        // Filtrer selon le rôle
        if ($user->role === 'responsable_metier' && $user->filiere_id) {
            $query->where('filiere_id', $user->filiere_id);
        }

        $ueas = $query->get();

        $statistiques = [
            'resume_global' => [
                'total_ueas' => $ueas->count(),
                'ueas_terminees' => $ueas->where('est_terminee', true)->count(),
                'ueas_en_cours' => $ueas->where('est_terminee', false)->where('volume_horaire_effectue', '>', 0)->count(),
                'ueas_non_commencees' => $ueas->where('volume_horaire_effectue', 0)->count(),
                'taux_completion_global' => $ueas->count() > 0 ? round($ueas->sum('taux_execution') / $ueas->count(), 2) : 0,
            ],
            'par_filiere' => [],
            'ueas_details' => []
        ];

        // Statistiques par filière (seulement pour chef_dep)
        if ($user->role === 'chef_dep') {
            $filieres = \App\Models\Filiere::with(['ueas.seances'])->get();
            
            foreach ($filieres as $filiere) {
                $ueaFiliere = $filiere->ueas;
                $statistiques['par_filiere'][] = [
                    'filiere' => $filiere->only(['id', 'nom']),
                    'total_ueas' => $ueaFiliere->count(),
                    'ueas_terminees' => $ueaFiliere->where('est_terminee', true)->count(),
                    'taux_completion' => $ueaFiliere->count() > 0 ? round($ueaFiliere->sum('taux_execution') / $ueaFiliere->count(), 2) : 0,
                ];
            }
        } else {
            // Pour responsable_metier, juste sa filière
            $filiere = $user->filiere;
            if ($filiere) {
                $statistiques['par_filiere'][] = [
                    'filiere' => $filiere->only(['id', 'nom']),
                    'total_ueas' => $ueas->count(),
                    'ueas_terminees' => $ueas->where('est_terminee', true)->count(),
                    'taux_completion' => $ueas->count() > 0 ? round($ueas->sum('taux_execution') / $ueas->count(), 2) : 0,
                ];
            }
        }

        // Détails des UEAs
        foreach ($ueas as $uea) {
            $statistiques['ueas_details'][] = [
                'id' => $uea->id,
                'code' => $uea->code,
                'nom' => $uea->nom,
                'filiere' => $uea->filiere->nom,
                'volume_horaire_total' => $uea->volume_horaire_total,
                'volume_horaire_effectue' => $uea->volume_horaire_effectue,
                'volume_horaire_restant' => $uea->volume_horaire_restant,
                'taux_execution' => $uea->taux_execution,
                'est_terminee' => $uea->est_terminee,
                'seances_realisees' => $uea->seances->where('statut', 'realisee')->count(),
                'seances_prevues' => $uea->seances->count(),
            ];
        }

        return response()->json($statistiques);
    }
}