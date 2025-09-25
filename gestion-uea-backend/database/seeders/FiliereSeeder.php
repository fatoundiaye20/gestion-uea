<?php
// database/seeders/FiliereSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Filiere;

class FiliereSeeder extends Seeder
{
    public function run()
    {
        $filieres = [
            ['nom' => 'DWM', 'description' => 'Développement Web et Mobile'],
            ['nom' => 'RT', 'description' => 'Réseaux et Télécommunications'],
            ['nom' => 'ASRI', 'description' => 'Administration Systèmes et Réseaux Informatiques']
        ];

        foreach ($filieres as $filiere) {
            Filiere::create($filiere);
        }
    }
}