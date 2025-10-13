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
            $table->string('nom');                     // Nom de l'UEA
            $table->string('code')->unique();          // Code unique de l'UEA
            $table->string('niveau')->nullable();      // Niveau de l'UEA (ex: Licence, Master)
            $table->text('description')->nullable();  // Description de l'UEA
            $table->unsignedBigInteger('created_by')->nullable(); // Créé par (FK vers users)
            $table->timestamps();

            // Clé étrangère vers users.id
            $table->foreign('created_by')->references('id')->on('users')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ueas');
    }
}
