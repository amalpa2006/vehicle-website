from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select

from app.auth import get_current_user, get_db, hash_password, require_admin
from app.models import Car, GenderEnum, User
from app.schemas import (
    AdminActionResponse,
    AdminCreateUserRequest,
    AdminUpdateUserRequest,
    CarCreate,
    CarOut,
    CarUpdate,
    UserAdminOut,
    UserListOut,
)


router = APIRouter(prefix="/api/admin", tags=["admin"])


# ──────────────────────────────────────────────
#  Admin — Car management
# ──────────────────────────────────────────────


@router.get("/vehicles", response_model=list[CarOut])
def admin_list_vehicles(
    db=Depends(get_db),
    _=Depends(require_admin),
) -> list[CarOut]:
    cars = db.execute(select(Car).order_by(Car.created_at.desc())).scalars().all()
    return [
        CarOut(
            id=c.id,
            name=c.name,
            price=c.price,
            image=c.image,
            description=c.description,
            brand=c.brand,
            model=c.model,
            variant=c.variant,
            car_type=c.car_type,
        )
        for c in cars
    ]


@router.post("/vehicles", response_model=CarOut, status_code=status.HTTP_201_CREATED)
def admin_create_car(
    req: CarCreate,
    db=Depends(get_db),
    _=Depends(require_admin),
) -> CarOut:
    car = Car(
        name=req.name,
        price=req.price,
        image=req.image,
        description=req.description,
        brand=req.brand,
        model=req.model,
        variant=req.variant,
        car_type=req.car_type or "other",
    )
    db.add(car)
    db.commit()
    db.refresh(car)

    return CarOut(
        id=car.id,
        name=car.name,
        price=car.price,
        image=car.image,
        description=car.description,
        brand=car.brand,
        model=car.model,
        variant=car.variant,
        car_type=car.car_type,
    )


@router.put("/vehicles/{car_id}", response_model=CarOut)
def admin_update_car(
    car_id: str,
    req: CarUpdate,
    db=Depends(get_db),
    _=Depends(require_admin),
) -> CarOut:
    car = db.execute(select(Car).where(Car.id == car_id)).scalar_one_or_none()
    if car is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Car not found")

    update_data = req.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(car, field, value)

    db.commit()
    db.refresh(car)

    return CarOut(
        id=car.id,
        name=car.name,
        price=car.price,
        image=car.image,
        description=car.description,
        brand=car.brand,
        model=car.model,
        variant=car.variant,
        car_type=car.car_type,
    )


@router.delete("/vehicles/{car_id}", response_model=AdminActionResponse)
def admin_delete_car(
    car_id: str,
    db=Depends(get_db),
    _=Depends(require_admin),
) -> AdminActionResponse:
    car = db.execute(select(Car).where(Car.id == car_id)).scalar_one_or_none()
    if car is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Car not found")

    db.delete(car)
    db.commit()

    return AdminActionResponse(message="Car deleted")


# ──────────────────────────────────────────────
#  Admin — User management
# ──────────────────────────────────────────────


@router.get("/users", response_model=UserListOut)
def admin_list_users(
    db=Depends(get_db),
    _=Depends(require_admin),
) -> UserListOut:
    users = db.execute(select(User).order_by(User.created_at.desc())).scalars().all()
    return UserListOut(
        users=[
            UserAdminOut(
                id=u.id,
                firstName=u.first_name,
                secondName=u.second_name,
                dateOfBirth=u.date_of_birth,
                address=u.address,
                gender=u.gender.value if hasattr(u.gender, "value") else u.gender,
                email=u.email,
                isAdmin=u.is_admin,
                createdAt=u.created_at,
            )
            for u in users
        ]
    )


@router.get("/users/{user_id}", response_model=UserAdminOut)
def admin_get_user(
    user_id: str,
    db=Depends(get_db),
    _=Depends(require_admin),
) -> UserAdminOut:
    user = db.execute(select(User).where(User.id == user_id)).scalar_one_or_none()
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    return UserAdminOut(
        id=user.id,
        firstName=user.first_name,
        secondName=user.second_name,
        dateOfBirth=user.date_of_birth,
        address=user.address,
        gender=user.gender.value if hasattr(user.gender, "value") else user.gender,
        email=user.email,
        isAdmin=user.is_admin,
        createdAt=user.created_at,
    )


@router.post("/users", response_model=UserAdminOut, status_code=status.HTTP_201_CREATED)
def admin_create_user(
    req: AdminCreateUserRequest,
    db=Depends(get_db),
    _=Depends(require_admin),
) -> UserAdminOut:
    existing = db.execute(select(User).where(User.email == req.email)).scalar_one_or_none()
    if existing is not None:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")

    user = User(
        first_name=req.firstName,
        second_name=req.secondName,
        date_of_birth=req.dateOfBirth,
        address=req.address,
        gender=GenderEnum(req.gender),
        email=req.email,
        password_hash=hash_password(req.password),
        is_admin=req.isAdmin,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    return UserAdminOut(
        id=user.id,
        firstName=user.first_name,
        secondName=user.second_name,
        dateOfBirth=user.date_of_birth,
        address=user.address,
        gender=user.gender.value if hasattr(user.gender, "value") else user.gender,
        email=user.email,
        isAdmin=user.is_admin,
        createdAt=user.created_at,
    )


@router.put("/users/{user_id}", response_model=UserAdminOut)
def admin_update_user(
    user_id: str,
    req: AdminUpdateUserRequest,
    db=Depends(get_db),
    _=Depends(require_admin),
) -> UserAdminOut:
    user = db.execute(select(User).where(User.id == user_id)).scalar_one_or_none()
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    update_data = req.model_dump(exclude_unset=True)
    if "password" in update_data:
        update_data["password_hash"] = hash_password(update_data.pop("password"))
    if "firstName" in update_data:
        update_data["first_name"] = update_data.pop("firstName")
    if "secondName" in update_data:
        update_data["second_name"] = update_data.pop("secondName")
    if "dateOfBirth" in update_data:
        update_data["date_of_birth"] = update_data.pop("dateOfBirth")
    if "isAdmin" in update_data:
        update_data["is_admin"] = update_data.pop("isAdmin")
    if "gender" in update_data:
        update_data["gender"] = GenderEnum(update_data.pop("gender"))
    if "email" in update_data:
        # Check email uniqueness if changed
        existing = db.execute(
            select(User).where(User.email == update_data["email"], User.id != user_id)
        ).scalar_one_or_none()
        if existing is not None:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already in use")

    for field, value in update_data.items():
        setattr(user, field, value)

    db.commit()
    db.refresh(user)

    return UserAdminOut(
        id=user.id,
        firstName=user.first_name,
        secondName=user.second_name,
        dateOfBirth=user.date_of_birth,
        address=user.address,
        gender=user.gender.value if hasattr(user.gender, "value") else user.gender,
        email=user.email,
        isAdmin=user.is_admin,
        createdAt=user.created_at,
    )


@router.delete("/users/{user_id}", response_model=AdminActionResponse)
def admin_delete_user(
    user_id: str,
    db=Depends(get_db),
    current_user: User = Depends(require_admin),
) -> AdminActionResponse:
    if current_user.id == user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete your own admin account",
        )

    user = db.execute(select(User).where(User.id == user_id)).scalar_one_or_none()
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    db.delete(user)
    db.commit()

    return AdminActionResponse(message="User deleted")
