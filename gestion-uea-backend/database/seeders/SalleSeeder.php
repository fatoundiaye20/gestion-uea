<?php
// database/seeders/SalleSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Salle;

class SalleSeeder extends Seeder
{
    public function run()
    {
        $salles = [
            ['nom' => 'Salle A1', 'capacite' => 30],
            ['nom' => 'Salle A2', 'capacite' => 25],
            ['nom' => 'Salle B1', 'capacite' => 40],
            ['nom' => 'Salle B2', 'capacite' => 35],
            ['nom' => 'Lab Informatique 1', 'capacite' => 20],
            ['nom' => 'Lab Informatique 2', 'capacite' => 20],
        ];

        foreach ($salles as $salle) {
            Salle::create($salle);
        }
    }
}