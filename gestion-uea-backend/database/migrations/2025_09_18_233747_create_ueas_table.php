<?php

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
            $table->integer('volume_horaire_total')->default(0);
            $table->string('semestre');
            $table->string('niveau'); // Ajout du champ niveau
            
            // Relation avec filiere (doit être créée AVANT users car users dépend de filieres)
            $table->foreignId('filiere_id')->constrained('filieres')->onDelete('cascade');
            
            // Relation avec le créateur
            $table->foreignId('created_by')->nullable()->constrained('users')->onDelete('set null');
            
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('ueas');
    }
};