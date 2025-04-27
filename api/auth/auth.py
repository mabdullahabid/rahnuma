import jwt
from django.conf import settings
from django.contrib.auth import get_user_model
from ninja.errors import AuthenticationError
from ninja.security import HttpBearer

User = get_user_model()


class JWTAuth(HttpBearer):
    def authenticate(self, request, token):
        try:
            payload = jwt.decode(
                token,
                settings.JWT_SECRET,
                algorithms=[settings.JWT_ALGORITHM],
                # this is the default; decode() will raise if exp < now
            )
        except jwt.ExpiredSignatureError as e:
            raise AuthenticationError(401, "Token has expired")
        user = User.objects.get(pk=payload["user_id"], is_active=True)
        return user
