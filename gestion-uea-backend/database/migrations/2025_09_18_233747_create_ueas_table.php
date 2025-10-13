<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUeasTable extends Migration
{
    public function up(): void
    {
        Schema::create('ueas', function (Blueprint $table) {
            $table->id();

            // Informations de base sur l'UEA
            $table->string('nom');                     // Nom de l'UEA
            $table->string('code')->unique();          // Code unique de l'UEA
            $table->text('description')->nullable();   // Description de l'UEA
            $table->integer('volume_horaire_total')->default(0); // Volume horaire total
            $table->string('semestre');                // Semestre concerné
            $table->string('niveau')->nullable();      // Niveau de l'UEA (ex: Licence, Master)

            // Relation avec la filière
            $table->foreignId('filiere_id')
                  ->constrained('filieres')
                  ->onDelete('cascade');

            // Relation avec le créateur (utilisateur)
            $table->foreignId('created_by')
                  ->nullable()
                  ->constrained('users')
                  ->onDelete('set null');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ueas');
    }
}
