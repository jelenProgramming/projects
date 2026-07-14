<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;

class InvoiceController extends Controller
{
    public function index(Request $request)
    {
        $invoices = $request->user()->invoices()
            ->with(['client', 'items'])
            ->latest()
            ->get();

        return response()->json($invoices);
    }

    public function store(Request $request)
    {
        $data = $this->validateInvoice($request);
        $this->assertClientOwned($request, $data['client_id']);

        $invoice = $request->user()->invoices()->create([
            'client_id' => $data['client_id'],
            'number' => $this->nextNumber($request),
            'issue_date' => $data['issue_date'],
            'due_date' => $data['due_date'] ?? null,
            'status' => $data['status'] ?? 'draft',
            'tax_rate' => $data['tax_rate'] ?? 0,
            'notes' => $data['notes'] ?? null,
        ]);

        $invoice->items()->createMany($data['items']);

        return response()->json($invoice->load(['client', 'items']), 201);
    }

    public function show(Request $request, Invoice $invoice)
    {
        $this->assertOwned($request, $invoice);

        return response()->json($invoice->load(['client', 'items']));
    }

    public function update(Request $request, Invoice $invoice)
    {
        $this->assertOwned($request, $invoice);
        $data = $this->validateInvoice($request);
        $this->assertClientOwned($request, $data['client_id']);

        $invoice->update([
            'client_id' => $data['client_id'],
            'issue_date' => $data['issue_date'],
            'due_date' => $data['due_date'] ?? null,
            'status' => $data['status'] ?? $invoice->status,
            'tax_rate' => $data['tax_rate'] ?? 0,
            'notes' => $data['notes'] ?? null,
        ]);

        $invoice->items()->delete();
        $invoice->items()->createMany($data['items']);

        return response()->json($invoice->fresh()->load(['client', 'items']));
    }

    public function destroy(Request $request, Invoice $invoice)
    {
        $this->assertOwned($request, $invoice);
        $invoice->delete();

        return response()->json(['deleted' => true]);
    }

    public function pdf(Request $request, Invoice $invoice)
    {
        $this->assertOwned($request, $invoice);
        $invoice->load(['client', 'items']);

        $pdf = Pdf::loadView('invoice', [
            'invoice' => $invoice,
            'user' => $request->user(),
        ]);

        return $pdf->download("invoice-{$invoice->number}.pdf");
    }

    public function stats(Request $request)
    {
        $invoices = $request->user()->invoices()->with('items')->get();

        $sum = fn ($status) => round(
            $invoices->where('status', $status)->sum(fn ($i) => $i->total), 2
        );

        return response()->json([
            'count' => $invoices->count(),
            'total_invoiced' => round($invoices->sum(fn ($i) => $i->total), 2),
            'paid' => $sum('paid'),
            'outstanding' => round(
                $invoices->whereIn('status', ['draft', 'sent'])->sum(fn ($i) => $i->total), 2
            ),
        ]);
    }

    private function validateInvoice(Request $request): array
    {
        return $request->validate([
            'client_id' => ['required', 'integer', 'exists:clients,id'],
            'issue_date' => ['required', 'date'],
            'due_date' => ['nullable', 'date'],
            'status' => ['nullable', 'in:draft,sent,paid'],
            'tax_rate' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'notes' => ['nullable', 'string'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.description' => ['required', 'string', 'max:255'],
            'items.*.quantity' => ['required', 'numeric', 'min:0'],
            'items.*.unit_price' => ['required', 'numeric', 'min:0'],
        ]);
    }

    private function nextNumber(Request $request): string
    {
        $count = $request->user()->invoices()->count() + 1;

        return 'INV-'.str_pad((string) $count, 4, '0', STR_PAD_LEFT);
    }

    private function assertOwned(Request $request, Invoice $invoice): void
    {
        abort_unless($invoice->user_id === $request->user()->id, 403);
    }

    private function assertClientOwned(Request $request, int $clientId): void
    {
        abort_unless(
            $request->user()->clients()->whereKey($clientId)->exists(),
            403,
            'That client is not yours.'
        );
    }
}
