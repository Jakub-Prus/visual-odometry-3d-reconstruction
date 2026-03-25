# UI Run Flow

## User flow
1. choose a dataset or future upload input on `/new-run`
2. select the key run controls only
3. start the run
4. monitor progress through staged updates
5. open the result page when processing completes

## Demo mode
- run launch is simulated through a mock adapter
- progress is time-based and persisted in local storage
- completed runs appear in the results gallery and can be reopened

## API integration path
- `POST /api/runs` creates a run
- `GET /api/runs/:id/progress` polls run state
- `GET /api/results` returns result summaries
- `GET /api/results/:id` returns full result details
