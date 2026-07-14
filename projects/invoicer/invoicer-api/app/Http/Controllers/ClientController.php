<?php

namespace App\Http\Controllers;

use App\Models\Client;
use Illuminate\Http\Request;

class ClientController extends Controller
{
    public function index(Request $request)
    {
        return response()->json(
            $request->user()->clients()->withCount('invoices')->latest()->get()
        );
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['nullable', 'email'],
            'address' => ['nullable', 'string'],
        ]);

        $client = $request->user()->clients()->create($data);

        return response()->json($client, 201);
    }

    public function update(Request $request, Client $client)
    {
        $this->authorizeOwner($request, $client);

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['nullable', 'email'],
            'address' => ['nullable', 'string'],
        ]);

        $client->update($data);

        return response()->json($client);
    }

    public function destroy(Request $request, Client $client)
    {
        $this->authorizeOwner($request, $client);
        $client->delete();

        return response()->json(['deleted' => true]);
    }

    private function authorizeOwner(Request $request, Client $client): void
    {
        abort_unless($client->user_id === $request->user()->id, 403);
    }
}
