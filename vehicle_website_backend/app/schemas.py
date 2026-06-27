from datetime import date, datetime
from typing import Literal

from pydantic import BaseModel, EmailStr, Field


Gender = Literal["male", "female", "other"]


class RegisterRequest(BaseModel):
    firstName: str = Field(min_length=1)
    secondName: str = Field(min_length=1)
    dateOfBirth: date
    address: str = Field(min_length=1)
    gender: Gender
    email: EmailStr
    password: str = Field(min_length=1)


class RegisterResponse(BaseModel):
    message: str
    userId: str


class LoginRequest(BaseModel):
    email: str
    password: str = Field(min_length=1)


class UserPublic(BaseModel):
    id: str
    email: EmailStr
    firstName: str
    secondName: str


class LoginResponse(BaseModel):
    accessToken: str
    tokenType: str = "bearer"
    user: UserPublic


# ---- Vehicle (car catalog) schemas ----

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


# ---- Admin schemas ----

class CarCreate(BaseModel):
    name: str = Field(min_length=1)
    price: str = Field(min_length=1)
    image: str | None = None
    description: str = Field(min_length=1)
    brand: str | None = None
    model: str | None = None
    variant: str | None = None
    car_type: str = "other"


class CarUpdate(BaseModel):
    name: str | None = None
    price: str | None = None
    image: str | None = None
    description: str | None = None
    brand: str | None = None
    model: str | None = None
    variant: str | None = None
    car_type: str | None = None


class UserAdminOut(BaseModel):
    id: str
    firstName: str
    secondName: str
    dateOfBirth: date
    address: str
    gender: str
    email: str
    isAdmin: bool
    createdAt: datetime

    class Config:
        from_attributes = True


class UserListOut(BaseModel):
    users: list[UserAdminOut]


class AdminCreateUserRequest(BaseModel):
    firstName: str = Field(min_length=1)
    secondName: str = Field(min_length=1)
    dateOfBirth: date
    address: str = Field(min_length=1)
    gender: Gender
    email: EmailStr
    password: str = Field(min_length=4)
    isAdmin: bool = False


class AdminUpdateUserRequest(BaseModel):
    firstName: str | None = None
    secondName: str | None = None
    dateOfBirth: date | None = None
    address: str | None = None
    gender: Gender | None = None
    email: EmailStr | None = None
    password: str | None = None
    isAdmin: bool | None = None


class AdminActionResponse(BaseModel):
    message: str

