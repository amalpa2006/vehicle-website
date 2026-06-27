import enum
import uuid
from datetime import datetime
from typing import Optional


from sqlalchemy import Date, DateTime, Enum as SAEnum, String, Text, func
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


# SQLAlchemy's automatic column inference sometimes breaks with complex typing.
# We explicitly set `__allow_unmapped__ = True` to prevent annotation parsing crashes.



class Base(DeclarativeBase):
    __allow_unmapped__ = True



class GenderEnum(str, enum.Enum):
    male = "male"
    female = "female"
    other = "other"


class CarTypeEnum(str, enum.Enum):
    suv = "suv"
    hatchback = "hatchback"
    sedan = "sedan"
    other = "other"


class Car(Base):
    __tablename__ = "cars"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))

    # "Car detailing" fields
    name: Mapped[str] = mapped_column(String(200), nullable=False, index=True)
    price: Mapped[str] = mapped_column(String(50), nullable=False)
    # Keep typing simple for SQLAlchemy to avoid union/optional parsing issues.
    image = mapped_column(String(500), nullable=True)

    description: Mapped[str] = mapped_column(Text, nullable=False)

    brand: Mapped[Optional[str]] = mapped_column(String(120), nullable=True)
    model: Mapped[Optional[str]] = mapped_column(String(120), nullable=True)
    variant: Mapped[Optional[str]] = mapped_column(String(120), nullable=True)




    car_type: Mapped[str] = mapped_column(String(50), nullable=False, default=CarTypeEnum.other.value)


    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False
    )


class User(Base):
    __tablename__ = "users"

    # SQLite doesn't have a native UUID type; store as TEXT.
    # For Postgres you can swap to UUID(as_uuid=True).
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))

    first_name: Mapped[str] = mapped_column(String(100), nullable=False)
    second_name: Mapped[str] = mapped_column(String(100), nullable=False)
    date_of_birth: Mapped[datetime.date] = mapped_column(Date, nullable=False)
    address: Mapped[str] = mapped_column(String(255), nullable=False)
    gender: Mapped[GenderEnum] = mapped_column(SAEnum(GenderEnum), nullable=False)

    email: Mapped[str] = mapped_column(String(255), nullable=False, unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    is_admin: Mapped[bool] = mapped_column(nullable=False, default=False)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False
    )

