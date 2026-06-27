from datetime import date
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy import select

from app.admin import router as admin_router
from app.auth import hash_password, router as auth_router
from app.db import engine, SessionLocal
from app.models import Base, Car, User
from app.vehicle_schemas import CarListOut



app = FastAPI(title="vehicle-backend")


# Allow local Vite dev server to call the API
# Adjust origins in production.
origins = ["http://localhost:5173"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(admin_router)


# Serve the admin dashboard as static files
static_admin = Path(__file__).resolve().parent.parent / "static" / "admin"
if static_admin.exists():
    app.mount("/admin", StaticFiles(directory=str(static_admin), html=True), name="admin")


# Create tables + seed a single car entry (dev convenience).
@app.on_event("startup")
def _create_tables_and_seed_data() -> None:
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        # Seed default admin user
        admin = db.execute(select(User).where(User.email == "admin@example.com")).scalar_one_or_none()
        if admin is None:
            db.add(
                User(
                    first_name="Admin",
                    second_name="User",
                    date_of_birth=date(1990, 1, 1),
                    address="Admin Office",
                    gender="male",
                    email="admin@example.com",
                    password_hash=hash_password("admin123"),
                    is_admin=True,
                )
            )
            db.commit()

        # Seed a sample car entry
        existing = db.execute(select(Car).where(Car.name == "Tata Nexon EV")).scalar_one_or_none()
        if existing is None:
            db.add(
                Car(
                    name="Tata Nexon EV",
                    price="₹15 Lakh",
                    image="nexonEvImg",
                    description=(
                        "The Tata Nexon EV is a smart, compact electric SUV with a smooth, responsive drive. "
                        "It offers confident performance, comfortable seating, and modern features tailored for everyday city travel. "
                        "With its efficient EV technology, the Nexon EV delivers a practical and exciting electric ownership experience."
                    ),
                    brand="Tata",
                    model="Nexon",
                    variant="EV",
                    car_type="suv",
                )
            )
            db.commit()
    finally:
        db.close()


@app.get("/api/vehicles", response_model=CarListOut)
def list_vehicles() -> CarListOut:
    db = SessionLocal()
    try:
        vehicles = db.execute(select(Car).order_by(Car.created_at.desc())).scalars().all()
        return CarListOut(
            vehicles=[
                {
                    "id": v.id,
                    "name": v.name,
                    "price": v.price,
                    "image": v.image,
                    "description": v.description,
                    "brand": v.brand,
                    "model": v.model,
                    "variant": v.variant,
                    "car_type": v.car_type,
                }
                for v in vehicles
            ]
        )
    finally:
        db.close()


@app.get("/health")
def health_check():
    return {"status": "ok"}





