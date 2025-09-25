<?php
// app/Models/Uea.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Uea extends Model
{
    protected $fillable = [
        'code',
        'nom',
        'description',
        'volume_horaire_total',
        'filiere_id',
        'semestre',
        'niveau',
    ];

    public function filiere()
    {
        return $this->belongsTo(Filiere::class);
    }

    public function seances()
    {
        return $this->hasMany(Seance::class);
    }

    // Calcul du volume horaire effectué
    public function getVolumeHoraireEffectueAttribute()
    {
        return $this->seances()->where('statut', 'realisee')
            ->sum(DB::raw("CASE WHEN duree = '4h' THEN 4 ELSE 8 END"));
    }

    // Calcul du volume horaire restant
    public function getVolumeHoraireRestantAttribute()
    {
        return max(0, $this->volume_horaire_total - $this->volume_horaire_effectue);
    }

    // Calcul du taux d'exécution
    public function getTauxExecutionAttribute()
    {
        if ($this->volume_horaire_total == 0) return 0;
        return round(($this->volume_horaire_effectue / $this->volume_horaire_total) * 100, 2);
    }

    // Vérifier si l'UEA est terminée
    public function getEstTermineeAttribute()
    {
        return $this->volume_horaire_effectue >= $this->volume_horaire_total;
    }
}