# StreamCast Proxy Worker

Cloudflare Worker that proxies:
- Ontario MNRF fish stocking data (ArcGIS)
- Environment Canada hydrometric flow data

## Setup

```bash
npm install
npx wrangler login        # opens browser to authenticate
npx wrangler deploy       # deploys to workers.dev subdomain
```

## Endpoints

### GET /health
Returns `{ status: "ok" }`

### GET /stocking
Returns fish stocking records for all StreamCast rivers.

Optional: `?rivers=Credit River,Humber River` to filter.

Response:
```json
{
  "updated": "2026-05-30T...",
  "rivers": {
    "Credit River": {
      "stockedSpecies": [
        { "year": 2024, "species": "Brown Trout", "size": "Yearling", "quantity": 2500 }
      ],
      "lastStocked": "2024-04-15",
      "totalRecords": 12
    }
  }
}
```

### GET /flow?station=02HB001
Returns current flow reading for a single gauge station.

Response:
```json
{ "flow": 5.4, "trend": "stable", "at": "2026-05-30T14:00:00Z", "station": "02HB001" }
```

## Caching
- Stocking data: 24h cache (data only updated a few times per year)
- Flow data: 5 min cache (near-real-time)

## Free tier limits
100,000 requests/day — well within range for StreamCast usage.
