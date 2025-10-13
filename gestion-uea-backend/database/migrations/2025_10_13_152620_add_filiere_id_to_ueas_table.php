<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
  public function up()
{
    Schema::table('ueas', function (Blueprint $table) {
        if (!Schema::hasColumn('ueas', 'filiere_id')) {
            $table->foreignId('filiere_id')->nullable()->constrained('filieres')->onDelete('set null');
        }

        if (!Schema::hasColumn('ueas', 'created_by')) {
            $table->foreignId('created_by')->nullable()->constrained('users')->onDelete('set null');
        }
    });
}

public function down()
{
    Schema::table('ueas', function (Blueprint $table) {
        $table->dropForeign(['filiere_id']);
        $table->dropColumn('filiere_id');

        $table->dropForeign(['created_by']);
        $table->dropColumn('created_by');
    });
}

};
