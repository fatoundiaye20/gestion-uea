use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\AssistantController;

Route::get('/messages', [MessageController::class, 'index']);
Route::post('/messages', [MessageController::class, 'store']);
Route::get('/messages/{id}', [MessageController::class, 'show']);
Route::put('/messages/{id}', [MessageController::class, 'update']);
Route::delete('/messages/{id}', [MessageController::class, 'destroy']);

// Routes pour l'assistant
Route::middleware('auth:sanctum')->group(function () {
	Route::get('/assistant/stats', [AssistantController::class, 'stats']);
	Route::get('/assistant/seances', [AssistantController::class, 'seances']);
});
