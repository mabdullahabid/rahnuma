from ninja import Router

from .schema import UserSchema

router = Router()

@router.get("/me", response=UserSchema)
def me(request):
    """
    request.auth is the Django User from JWTAuth.
    """
    return request.auth