
class JWTConfig:
    SECRET = 'secret'
    ALGORITHM = "HS256"

    JWT_EXP = {'minutes': 30}
    REFRESH_TOKEN_EXP = {'weeks': 52}