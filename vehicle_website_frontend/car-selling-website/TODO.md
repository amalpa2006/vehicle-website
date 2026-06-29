# TODO

## Login mapping (Fix: Login submitted (demo) not wired)
- [x] Update `src/assets/pages/Login.jsx` to POST to FastAPI `/api/auth/login` using base URL `http://127.0.0.1:8000/`.
- [x] Map frontend fields: `{ email, password }` to backend request JSON.
- [x] Add UI handling: show success message / store token (if returned) / redirect; show error on failure.
- [ ] (Optional) Update `Register.jsx` to POST to `/api/auth/register` similarly.

## Auth UI
- [x] Show “Logout” in Header when `accessToken` exists; Logout clears token.


## Booking form (already demo)
- [ ] (If needed) wire booking form to backend endpoint described in `TASK_FASTAPI_BACKEND_FORM_HANDLING.md`.


