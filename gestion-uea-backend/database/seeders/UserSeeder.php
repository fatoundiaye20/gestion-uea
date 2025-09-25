<?php
// database/seeders/UserSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Filiere;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run()
    {
        // Chef de département
        User::create([
            'name' => 'Chef Département',
            'email' => 'chef@isep.edu.sn',
            'password' => Hash::make('password123'),
            'role' => 'chef_dep',
            'telephone' => '+221 77 123 4567',
        ]);

        // Responsables de métier
        $filieres = Filiere::all();
        foreach ($filieres as $filiere) {
            User::create([
                'name' => 'Responsable ' . $filiere->nom,
                'email' => 'responsable.' . strtolower($filiere->nom) . '@isep.edu.sn',
                'password' => Hash::make('password123'),
                'role' => 'responsable_metier',
                'filiere_id' => $filiere->id,
                'telephone' => '+221 77 ' . rand(100, 999) . ' ' . rand(1000, 9999),
            ]);
        }

        // Enseignants
        $enseignants = [
            ['name' => 'Prof. Diallo', 'specialite' => 'Développement Web'],
            ['name' => 'Prof. Ndiaye', 'specialite' => 'Réseaux'],
            ['name' => 'Prof. Fall', 'specialite' => 'Base de données'],
            ['name' => 'Prof. Sarr', 'specialite' => 'Système'],
        ];

        foreach ($enseignants as $index => $enseignant) {
            User::create([
                'name' => $enseignant['name'],
                'email' => 'enseignant' . ($index + 1) . '@isep.edu.sn',
                'password' => Hash::make('password123'),
                'role' => 'enseignant',
                'specialite' => $enseignant['specialite'],
                'telephone' => '+221 76 ' . rand(100, 999) . ' ' . rand(1000, 9999),
            ]);
        }

        // Assistant technique
        User::create([
            'name' => 'Assistant Technique',
            'email' => 'assistant@isep.edu.sn',
            'password' => Hash::make('password123'),
            'role' => 'assistant',
            'telephone' => '+221 78 123 4567',
        ]);
    }
}