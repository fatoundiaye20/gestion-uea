<?php
// app/Models/Filiere.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Filiere extends Model
{
    protected $fillable = [
        'nom',
        'description',
    ];

    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function ueas()
    {
        return $this->hasMany(Uea::class);
    }
}