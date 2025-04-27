from ninja import NinjaAPI

from auth.auth import JWTAuth

auth = JWTAuth()
api_v1 = NinjaAPI(auth=auth)

api_v1.add_router("/auth/", "auth.api.router")
api_v1.add_router("/users/", "users.api.router")
