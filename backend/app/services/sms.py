import httpx

from app.config import settings


def _phone_digits(phone: str) -> str:
    return phone.lstrip("+").removeprefix("91") if phone.startswith("+91") else phone.lstrip("+")


def send_otp_sms(phone: str, otp_code: str) -> None:
    provider = (settings.sms_provider or "none").lower()

    if provider == "fast2sms":
        _send_fast2sms(phone, otp_code)
    elif provider == "twilio":
        _send_twilio(phone, otp_code)
    elif provider == "none":
        raise RuntimeError("SMS provider not configured")
    else:
        raise RuntimeError(f"Unknown SMS provider: {provider}")


def _send_fast2sms(phone: str, otp_code: str) -> None:
    if not settings.fast2sms_api_key:
        raise RuntimeError("FAST2SMS_API_KEY is missing")

    numbers = _phone_digits(phone)
    response = httpx.post(
        "https://www.fast2sms.com/dev/bulkV2",
        headers={"authorization": settings.fast2sms_api_key},
        json={
            "route": "otp",
            "variables_values": otp_code,
            "numbers": numbers,
        },
        timeout=15,
    )
    if response.status_code != 200:
        raise RuntimeError(f"Fast2SMS error: {response.text}")
    data = response.json()
    if not data.get("return"):
        raise RuntimeError(f"Fast2SMS rejected request: {data}")


def _send_twilio(phone: str, otp_code: str) -> None:
    if not all([settings.twilio_account_sid, settings.twilio_auth_token, settings.twilio_from_number]):
        raise RuntimeError("Twilio credentials are incomplete")

    message = f"Your Sparkle by Saranya OTP is {otp_code}. Valid for {settings.otp_expire_minutes} minutes."
    response = httpx.post(
        f"https://api.twilio.com/2010-04-01/Accounts/{settings.twilio_account_sid}/Messages.json",
        auth=(settings.twilio_account_sid, settings.twilio_auth_token),
        data={
            "To": phone,
            "From": settings.twilio_from_number,
            "Body": message,
        },
        timeout=15,
    )
    if response.status_code not in (200, 201):
        raise RuntimeError(f"Twilio error: {response.text}")
