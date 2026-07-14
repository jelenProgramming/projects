<?php

use Illuminate\Support\Facades\Route;

Route::get('/', fn () => response()->json([
    'name' => 'Invoicer API',
    'status' => 'ok',
]));
