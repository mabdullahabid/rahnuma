from datetime import datetime, timedelta, timezone

import jwt
from auth.schema import LoginSchema, SignupSchema, TokenSchema
from django.conf import settings
from django.contrib.auth import authenticate, get_user_model
from ninja import Router
from ninja.errors import AuthenticationError
from users.schema import UserSchema

User = get_user_model()

router = Router()


# ─────────────────────── Signup ───────────────────────
@router.post("/signup", auth=None, response={201: UserSchema})
def signup(request, data: SignupSchema):
    """
    Create a new Django user.
    """
    user = User.objects.create_user(
        username=data.username,
        email=data.email,
        first_name=data.first_name or "",
        last_name=data.last_name or "",
        password=data.password,
    )
    return 201, user


# ─────────────────────── Login ───────────────────────
@router.post("/login", auth=None, response=TokenSchema)
def login(request, data: LoginSchema):
    """
    Verify credentials (by username or email), return JWT.
    """
    # allow login via email or username
    user = None
    if data.username:
        user = authenticate(request, username=data.username, password=data.password)
    elif data.email:
        try:
            user_obj = User.objects.get(email__iexact=data.email)
        except User.DoesNotExist:
            user_obj = None
        if user_obj:
            user = authenticate(
                request, username=user_obj.username, password=data.password
            )

    if not user or not user.is_active:
        raise AuthenticationError

    exp = datetime.now(timezone.utc) + timedelta(seconds=settings.JWT_EXP_DELTA_SECONDS)
    token = jwt.encode(
        {"user_id": user.pk, "exp": exp},
        settings.JWT_SECRET,
        algorithm=settings.JWT_ALGORITHM,
    )
    return {"token": token, "expires_at": exp}
