# UI Plan

## Goals
- make the app feel like a polished product demo instead of an internal debugger
- let visitors launch a run, watch progress, and open final results quickly
- keep technical detail available without putting it above the fold
- stay deployable on Cloudflare or a VPS

## Main pages
- home
- new run
- results gallery
- result overview
- result map, visuals, metrics, and details
- datasets
- about

## Implementation order
1. results-first routing and navigation
2. run launch and progress simulation
3. result summary pages with trajectory and point cloud focus
4. deeper visuals, metrics, and technical detail pages
5. API adapter handoff and deployment polish

## Demo mode vs API mode
- demo mode uses bundled result assets and local progress simulation
- API mode swaps adapters to real run creation, polling, and result endpoints
