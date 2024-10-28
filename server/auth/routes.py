from fastapi import APIRouter, Depends, HTTPException, status

router = APIRouter(
    prefix="/auth",
    tags=["auth"]
)


@router.post("/register")
def register_user():
    pass