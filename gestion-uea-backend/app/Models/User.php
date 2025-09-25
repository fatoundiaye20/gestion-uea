<?php
// app/Models/User.php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'telephone',
        'specialite',
        'role',
        'filiere_id',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    // Relations
    public function filiere()
    {
        return $this->belongsTo(Filiere::class);
    }

    public function seances()
    {
        return $this->hasMany(Seance::class, 'enseignant_id');
    }

    // Scopes
    public function scopeEnseignants($query)
    {
        return $query->where('role', 'enseignant');
    }

    public function scopeResponsablesMetier($query)
    {
        return $query->where('role', 'responsable_metier');
    }
}