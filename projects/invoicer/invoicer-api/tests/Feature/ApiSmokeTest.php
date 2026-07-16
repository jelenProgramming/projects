<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ApiSmokeTest extends TestCase
{
    use RefreshDatabase;

    private function registerAndToken(): string
    {
        $res = $this->postJson('/api/register', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'secret123',
        ]);

        $res->assertStatus(201)->assertJsonStructure(['user', 'token']);

        return $res->json('token');
    }

    public function test_register_then_login(): void
    {
        $this->registerAndToken();

        $res = $this->postJson('/api/login', [
            'email' => 'test@example.com',
            'password' => 'secret123',
        ]);

        $res->assertOk()->assertJsonStructure(['user', 'token']);
    }

    public function test_login_rejects_wrong_password(): void
    {
        $this->registerAndToken();

        $this->postJson('/api/login', [
            'email' => 'test@example.com',
            'password' => 'wrong-password',
        ])->assertStatus(422);
    }

    public function test_guest_cannot_list_invoices(): void
    {
        $this->getJson('/api/invoices')->assertStatus(401);
    }

    public function test_create_invoice_and_fetch_pdf(): void
    {
        $token = $this->registerAndToken();
        $auth = ['Authorization' => "Bearer {$token}"];

        $client = $this->postJson('/api/clients', [
            'name' => 'Acme GmbH',
            'email' => 'billing@acme.test',
        ], $auth);
        $client->assertStatus(201);

        $invoice = $this->postJson('/api/invoices', [
            'client_id' => $client->json('id'),
            'issue_date' => '2026-07-01',
            'due_date' => '2026-07-31',
            'status' => 'draft',
            'tax_rate' => 20,
            'items' => [
                ['description' => 'Consulting', 'quantity' => 2, 'unit_price' => 100],
            ],
        ], $auth);
        $invoice->assertStatus(201)->assertJsonPath('items.0.description', 'Consulting');

        $pdf = $this->get("/api/invoices/{$invoice->json('id')}/pdf", $auth);
        $pdf->assertOk();
        $this->assertSame('application/pdf', $pdf->headers->get('content-type'));
        $this->assertStringStartsWith('%PDF', $pdf->getContent());
    }
}
