<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Invoice extends Model
{
    protected $fillable = [
        'user_id', 'client_id', 'number', 'issue_date',
        'due_date', 'status', 'tax_rate', 'notes',
    ];

    protected $casts = [
        'issue_date' => 'date',
        'due_date' => 'date',
        'tax_rate' => 'decimal:2',
    ];

    protected $appends = ['subtotal', 'tax', 'total'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(InvoiceItem::class);
    }

    public function getSubtotalAttribute(): float
    {
        return round($this->items->sum(fn ($i) => $i->quantity * $i->unit_price), 2);
    }

    public function getTaxAttribute(): float
    {
        return round($this->subtotal * ($this->tax_rate / 100), 2);
    }

    public function getTotalAttribute(): float
    {
        return round($this->subtotal + $this->tax, 2);
    }
}
