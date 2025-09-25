<?php
// database/migrations/2025_01_01_000004_create_seances_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('seances', function (Blueprint $table) {
            $table->id();
            $table->date('date');
            $table->time('heure_debut');
            $table->time('heure_fin');
            $table->enum('duree', ['4h', '8h']);
            $table->unsignedBigInteger('salle_id');
            $table->unsignedBigInteger('enseignant_id');
            $table->unsignedBigInteger('uea_id');
            $table->enum('statut', ['prevue', 'validee', 'realisee'])->default('prevue');
            
            // Champs pour le suivi pédagogique
            $table->string('chapitre')->nullable();
            $table->text('objectifs_pedagogiques')->nullable();
            $table->text('points_abordes')->nullable();
            $table->boolean('objectifs_atteints')->nullable();
            $table->boolean('satisfaction_apprenants')->nullable();
            $table->text('raisons_insatisfaction')->nullable();
            
            // Commentaires du responsable
            $table->text('commentaire_responsable')->nullable();
            
            $table->timestamps();

            $table->foreign('salle_id')->references('id')->on('salles')->onDelete('cascade');
            $table->foreign('enseignant_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('uea_id')->references('id')->on('ueas')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('seances');
    }
};