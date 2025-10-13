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
            $table->string('semestre')->nullable();
        });
    }

    public function down()
    {
        Schema::table('ueas', function (Blueprint $table) {
            $table->dropColumn('semestre');
        });
    }

};
