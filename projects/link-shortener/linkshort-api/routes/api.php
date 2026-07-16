<?php

use App\Http\Controllers\LinkController;
use Illuminate\Support\Facades\Route;

Route::get('/links', [LinkController::class, 'index']);
Route::post('/links', [LinkController::class, 'store'])->middleware('throttle:30,1');
Route::get('/links/{slug}', [LinkController::class, 'show']);
Route::delete('/links/{slug}', [LinkController::class, 'destroy']);
