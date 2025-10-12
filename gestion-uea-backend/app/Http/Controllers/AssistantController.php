<?php
// app/Http/Controllers/AssistantController.php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Seance;
use App\Models\Uea;
use Carbon\Carbon;

class AssistantController extends Controller
{
    /**
     * Retourne des statistiques simplifiées pour l'interface assistant
     */
    public function stats(Request $request)
    {
        $user = $request->user();

        // Les assistants voient toutes les séances mais nous fournissons un résumé
        $totalSeances = Seance::count();
        $seancesRealisees = Seance::where('statut', 'realisee')->count();
        $seancesValidees = Seance::where('statut', 'validee')->count();
        $seancesEnAttente = Seance::where('statut', 'en_attente')->count();

        $ueas = Uea::with('filiere')->get();
        $totalUeas = $ueas->count();

        return response()->json([
            'total_seances' => $totalSeances,
            'seances_realisees' => $seancesRealisees,
            'seances_validees' => $seancesValidees,
            'seances_en_attente' => $seancesEnAttente,
            'total_ueas' => $totalUeas,
        ]);
    }

    /**
     * Liste des séances (filtrable par date ou statut)
     */
    public function seances(Request $request)
    {
        $query = Seance::with(['salle', 'enseignant', 'uea']);

        if ($request->has('date')) {
            try {
                $date = Carbon::parse($request->input('date'));
                $query->whereDate('date', $date->toDateString());
            } catch (\Exception $e) {
                // ignore invalid date
            }
        }

        if ($request->has('statut')) {
            $query->where('statut', $request->input('statut'));
        }

        $seances = $query->orderBy('date', 'desc')->limit(200)->get();

        return response()->json($seances);
    }
}
