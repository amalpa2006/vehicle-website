from pydantic import BaseModel, Field


class CarOut(BaseModel):
    id: str
    name: str
    price: str
    image: str | None
    description: str
    brand: str | None = None
    model: str | None = None
    variant: str | None = None
    car_type: str | None = None


class CarListOut(BaseModel):
    vehicles: list[CarOut]
