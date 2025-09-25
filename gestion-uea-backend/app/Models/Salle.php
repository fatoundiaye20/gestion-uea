<?php
// app/Models/Salle.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Salle extends Model
{
    protected $fillable = [
        'nom',
        'capacite',
        'description',
    ];

    public function seances()
    {
        return $this->hasMany(Seance::class);
    }
}