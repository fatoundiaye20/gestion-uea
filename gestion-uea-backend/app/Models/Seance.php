<?php
// app/Models/Seance.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Seance extends Model
{
    protected $fillable = [
        'date',
        'heure_debut',
        'heure_fin',
        'duree',
        'salle_id',
        'enseignant_id',
        'uea_id',
        'statut',
        'chapitre',
        'objectifs_pedagogiques',
        'points_abordes',
        'objectifs_atteints',
        'satisfaction_apprenants',
        'raisons_insatisfaction',
        'commentaire_responsable',
    ];

    protected $casts = [
        'date' => 'date',
        'objectifs_atteints' => 'boolean',
        'satisfaction_apprenants' => 'boolean',
    ];

    // Relations
    public function salle()
    {
        return $this->belongsTo(Salle::class);
    }

    public function enseignant()
    {
        return $this->belongsTo(User::class, 'enseignant_id');
    }

    public function uea()
    {
        return $this->belongsTo(Uea::class);
    }

    // Scope pour les séances d'une semaine donnée
    public function scopeSemaine($query, $date)
    {
        $startOfWeek = \Carbon\Carbon::parse($date)->startOfWeek();
        $endOfWeek = \Carbon\Carbon::parse($date)->endOfWeek();
        
        return $query->whereBetween('date', [$startOfWeek, $endOfWeek]);
    }
}