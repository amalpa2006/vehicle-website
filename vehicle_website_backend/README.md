# vehicle-backend

FastAPI backend.

## Setup

### 1) Create venv

```bash
python -m venv .venv
```

### 2) Install dependencies (pip)

```bash
.venv\Scripts\activate
pip install -r requirements.txt
```

### 3) Run

```bash
uvicorn app.main:app --reload --port 8000
```

## API

- `GET /health` -> health check

