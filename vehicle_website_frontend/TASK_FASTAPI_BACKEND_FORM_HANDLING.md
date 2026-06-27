# FastAPI Backend – Form Handling (Car Booking)

## Goal
Implement a FastAPI backend that handles the **car booking form** submission from the React UI.

The frontend form (from `car-selling-website/src/assets/pages/FeaturedCarDetails.jsx`) sends these fields:

- `fullName` (required)
- `phone` (required)
- `email` (optional)
- `city` (optional)
- `preferredDate` (required)
- `preferredTime` (required)

## API Endpoint
### `POST /api/bookings`
Validates input and returns a booking identifier.

**Request body (JSON)**
```json
{
  "fullName": "string",
  "phone": "string",
  "email": "string|null",
  "city": "string|null",
  "preferredDate": "YYYY-MM-DD",
  "preferredTime": "HH:MM"
}
```

**Response**
- `201 Created`
```json
{
  "message": "Booking request received",
  "bookingId": "uuid-string"
}
```

## Validation Rules (to implement with Pydantic)
- `fullName`: non-empty string
- `phone`: non-empty string
- `email`: optional; if present, must be a valid email format
- `city`: optional; if present, non-empty string
- `preferredDate`: required; must parse as a date
- `preferredTime`: required; must parse as a time

## Project Structure (to be created)
- `backend/main.py`
- `backend/schemas.py`
- `backend/requirements.txt`
- `backend/README.md`

## CORS
Enable CORS so the Vite React frontend can call the backend (typically `http://localhost:5173`).

## Implementation Steps
1. Create `backend/` folder and FastAPI app scaffolding.
2. Add Pydantic request/response schemas.
3. Implement `POST /api/bookings`.
4. Add CORS configuration.
5. Run the backend with `uvicorn`.
6. Test the endpoint with a sample JSON payload.
7. Wire the React form submission to call the backend endpoint.
   - Replace the current “demo form stores nothing” behavior.

## Local Run (after setup)
```bash
uvicorn backend.main:app --reload --port 8000
```
Then call:
`POST http://localhost:8000/api/bookings`
