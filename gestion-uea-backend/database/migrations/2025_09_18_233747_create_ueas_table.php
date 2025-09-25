<?php
// database/migrations/2025_01_01_000002_create_ueas_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('ueas', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('nom');
            $table->text('description')->nullable();
            $table->integer('volume_horaire_total');
            $table->unsignedBigInteger('filiere_id');
            $table->enum('semestre', ['S1', 'S2', 'S3', 'S4']);
            $table->enum('niveau', ['1re_annee', '2e_annee']);
            $table->timestamps();

            $table->foreign('filiere_id')->references('id')->on('filieres')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('ueas');
    }
};