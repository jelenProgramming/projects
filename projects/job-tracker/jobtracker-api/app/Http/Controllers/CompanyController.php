<?php

namespace App\Http\Controllers;

use App\Models\Company;
use Illuminate\Http\Request;

class CompanyController extends Controller
{
    public function index(Request $request)
    {
        return response()->json(
            $request->user()->companies()->withCount('applications')->orderBy('name')->get()
        );
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'website' => ['nullable', 'string', 'max:255'],
        ]);

        return response()->json($request->user()->companies()->create($data), 201);
    }

    public function update(Request $request, Company $company)
    {
        abort_unless($company->user_id === $request->user()->id, 403);

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'website' => ['nullable', 'string', 'max:255'],
        ]);

        $company->update($data);

        return response()->json($company);
    }

    public function destroy(Request $request, Company $company)
    {
        abort_unless($company->user_id === $request->user()->id, 403);
        $company->delete();

        return response()->json(['deleted' => true]);
    }
}
