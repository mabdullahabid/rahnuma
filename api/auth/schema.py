from datetime import datetime

from ninja import Schema

class SignupSchema(Schema):
    username: str
    email: str
    first_name: str = None
    last_name: str = None
    password: str


class LoginSchema(Schema):
    username: str = None
    email: str = None
    password: str


class TokenSchema(Schema):
    token: str
    expires_at: datetime