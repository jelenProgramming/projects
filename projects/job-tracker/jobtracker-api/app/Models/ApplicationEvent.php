<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ApplicationEvent extends Model
{
    protected $fillable = ['application_id', 'type', 'note'];

    public function application(): BelongsTo
    {
        return $this->belongsTo(Application::class);
    }
}
