<?php

namespace App\Http\Controllers;

use App\Models\Application;
use Illuminate\Http\Request;

class ApplicationController extends Controller
{
    public function index(Request $request)
    {
        $status = $request->query('status');
        $companyId = $request->query('company_id');
        $search = $request->query('search');

        $apps = $request->user()->applications()
            ->with('company')
            ->withCount('events')
            ->when($status, fn ($q) => $q->where('status', $status))
            ->when($companyId, fn ($q) => $q->where('company_id', $companyId))
            ->when($search, fn ($q) => $q->where(function ($qq) use ($search) {
                $qq->where('position', 'like', "%{$search}%")
                    ->orWhereHas('company', fn ($c) => $c->where('name', 'like', "%{$search}%"));
            }))
            ->latest()
            ->get();

        return response()->json($apps);
    }

    public function store(Request $request)
    {
        $data = $this->validateApp($request);
        $this->assertCompanyOwned($request, $data['company_id']);

        $app = $request->user()->applications()->create($data);
        $app->events()->create([
            'type' => 'status',
            'note' => 'Added to tracker as “'.$app->status.'”',
        ]);

        return response()->json($app->load('company', 'events'), 201);
    }

    public function show(Request $request, Application $application)
    {
        $this->assertOwned($request, $application);

        return response()->json($application->load('company', 'events'));
    }

    public function update(Request $request, Application $application)
    {
        $this->assertOwned($request, $application);
        $data = $this->validateApp($request);
        $this->assertCompanyOwned($request, $data['company_id']);

        $oldStatus = $application->status;
        $application->update($data);

        if ($oldStatus !== $application->status) {
            $application->events()->create([
                'type' => 'status',
                'note' => "Status: {$oldStatus} → {$application->status}",
            ]);
        }

        return response()->json($application->fresh()->load('company', 'events'));
    }

    public function updateStatus(Request $request, Application $application)
    {
        $this->assertOwned($request, $application);

        $data = $request->validate([
            'status' => ['required', 'in:wishlist,applied,interview,offer,rejected,accepted'],
        ]);

        $old = $application->status;
        if ($old !== $data['status']) {
            $application->update(['status' => $data['status']]);
            $application->events()->create([
                'type' => 'status',
                'note' => "Status: {$old} → {$data['status']}",
            ]);
        }

        return response()->json($application->fresh()->load('company', 'events'));
    }

    public function addEvent(Request $request, Application $application)
    {
        $this->assertOwned($request, $application);

        $data = $request->validate(['note' => ['required', 'string', 'max:500']]);
        $application->events()->create(['type' => 'note', 'note' => $data['note']]);

        return response()->json($application->fresh()->load('company', 'events'));
    }

    public function destroy(Request $request, Application $application)
    {
        $this->assertOwned($request, $application);
        $application->delete();

        return response()->json(['deleted' => true]);
    }

    public function stats(Request $request)
    {
        $counts = $request->user()->applications()
            ->selectRaw('status, count(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status');

        $statuses = ['wishlist', 'applied', 'interview', 'offer', 'rejected', 'accepted'];
        $byStatus = [];
        foreach ($statuses as $s) {
            $byStatus[$s] = (int) ($counts[$s] ?? 0);
        }

        return response()->json([
            'total' => array_sum($byStatus),
            'by_status' => $byStatus,
        ]);
    }

    private function validateApp(Request $request): array
    {
        return $request->validate([
            'company_id' => ['required', 'integer', 'exists:companies,id'],
            'position' => ['required', 'string', 'max:255'],
            'status' => ['required', 'in:wishlist,applied,interview,offer,rejected,accepted'],
            'location' => ['nullable', 'string', 'max:255'],
            'salary' => ['nullable', 'string', 'max:255'],
            'link' => ['nullable', 'string', 'max:255'],
            'applied_date' => ['nullable', 'date'],
            'notes' => ['nullable', 'string'],
        ]);
    }

    private function assertOwned(Request $request, Application $application): void
    {
        abort_unless($application->user_id === $request->user()->id, 403);
    }

    private function assertCompanyOwned(Request $request, int $companyId): void
    {
        abort_unless(
            $request->user()->companies()->whereKey($companyId)->exists(),
            403,
            'That company is not yours.'
        );
    }
}
