from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Use sqlite:///./sparkle.db for local dev without MySQL
    database_url: str = "sqlite:///./sparkle.db"
    secret_key: str = "sparkle-secret-key-change-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 1440
    otp_expire_minutes: int = 5
    otp_dev_mode: bool = True
    otp_rate_limit_per_minute: int = 3
    sms_provider: str = "none"  # none | fast2sms | twilio
    fast2sms_api_key: str = ""
    twilio_account_sid: str = ""
    twilio_auth_token: str = ""
    twilio_from_number: str = ""
    cors_origins: str = "http://localhost:5173,http://localhost:3000"

    class Config:
        env_file = ".env"

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",")]


settings = Settings()
