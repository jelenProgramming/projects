<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { font-family: DejaVu Sans, sans-serif; }
  body { color: #1a1a1a; font-size: 13px; margin: 0; }
  .wrap { padding: 40px 44px; }
  .top { width: 100%; border-collapse: collapse; margin-bottom: 38px; }
  .top td { vertical-align: top; }
  .brand { font-size: 26px; font-weight: bold; color: #4536e0; }
  .muted { color: #777; }
  h1.invtitle { font-size: 30px; margin: 0 0 4px; letter-spacing: 1px; }
  .meta { text-align: right; font-size: 12px; }
  .meta strong { color: #4536e0; }
  .parties { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
  .parties td { width: 50%; vertical-align: top; padding-right: 20px; }
  .label { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #999; margin-bottom: 6px; }
  .pname { font-weight: bold; font-size: 14px; }
  table.items { width: 100%; border-collapse: collapse; margin-bottom: 6px; }
  table.items th { text-align: left; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #999; border-bottom: 2px solid #eee; padding: 8px 6px; }
  table.items th.r, table.items td.r { text-align: right; }
  table.items td { padding: 11px 6px; border-bottom: 1px solid #f0f0f0; }
  .totals { width: 260px; margin-left: auto; margin-top: 14px; }
  .totals td { padding: 7px 6px; }
  .totals .tlabel { color: #777; }
  .totals .r { text-align: right; }
  .totals .grand td { border-top: 2px solid #1a1a1a; font-weight: bold; font-size: 16px; padding-top: 11px; }
  .grand .amt { color: #4536e0; }
  .status { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; }
  .status.paid { background: #e3f6ec; color: #14a06b; }
  .status.sent { background: #e9e7ff; color: #4536e0; }
  .status.draft { background: #f0f0f0; color: #777; }
  .notes { margin-top: 34px; padding-top: 16px; border-top: 1px solid #eee; font-size: 12px; color: #555; }
</style>
</head>
<body>
<div class="wrap">
  <table class="top">
    <tr>
      <td>
        <div class="brand">{{ $user->name }}</div>
        <div class="muted">{{ $user->email }}</div>
      </td>
      <td class="meta">
        <h1 class="invtitle">INVOICE</h1>
        <div><strong>{{ $invoice->number }}</strong></div>
        <div>Issued: {{ $invoice->issue_date->format('d M Y') }}</div>
        @if($invoice->due_date)
          <div>Due: {{ $invoice->due_date->format('d M Y') }}</div>
        @endif
        <div style="margin-top:8px;">
          <span class="status {{ $invoice->status }}">{{ $invoice->status }}</span>
        </div>
      </td>
    </tr>
  </table>

  <table class="parties">
    <tr>
      <td>
        <div class="label">Bill to</div>
        <div class="pname">{{ $invoice->client->name }}</div>
        @if($invoice->client->email)<div class="muted">{{ $invoice->client->email }}</div>@endif
        @if($invoice->client->address)<div class="muted">{!! nl2br(e($invoice->client->address)) !!}</div>@endif
      </td>
    </tr>
  </table>

  <table class="items">
    <thead>
      <tr>
        <th>Description</th>
        <th class="r">Qty</th>
        <th class="r">Unit price</th>
        <th class="r">Amount</th>
      </tr>
    </thead>
    <tbody>
      @foreach($invoice->items as $item)
      <tr>
        <td>{{ $item->description }}</td>
        <td class="r">{{ rtrim(rtrim(number_format($item->quantity, 2), '0'), '.') }}</td>
        <td class="r">&euro;{{ number_format($item->unit_price, 2) }}</td>
        <td class="r">&euro;{{ number_format($item->quantity * $item->unit_price, 2) }}</td>
      </tr>
      @endforeach
    </tbody>
  </table>

  <table class="totals">
    <tr>
      <td class="tlabel">Subtotal</td>
      <td class="r">&euro;{{ number_format($invoice->subtotal, 2) }}</td>
    </tr>
    @if($invoice->tax_rate > 0)
    <tr>
      <td class="tlabel">Tax ({{ rtrim(rtrim(number_format($invoice->tax_rate, 2), '0'), '.') }}%)</td>
      <td class="r">&euro;{{ number_format($invoice->tax, 2) }}</td>
    </tr>
    @endif
    <tr class="grand">
      <td>Total</td>
      <td class="r amt">&euro;{{ number_format($invoice->total, 2) }}</td>
    </tr>
  </table>

  @if($invoice->notes)
  <div class="notes">
    <strong>Notes:</strong> {{ $invoice->notes }}
  </div>
  @endif
</div>
</body>
</html>
