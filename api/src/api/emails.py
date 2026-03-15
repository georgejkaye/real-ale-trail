import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.utils import formataddr, make_msgid
from typing import Any

from jinja2 import Environment, PackageLoader, Template, select_autoescape

from api.users.db import FastApiUser
from api.utils import (
    get_env_variable,
    get_env_variable_force,
    get_env_variable_with_default,
    get_secret_force,
)


class EmailSender:
    def __init__(self):
        self.from_email = get_env_variable_force("FROM_EMAIL")
        self.smtp_server = get_env_variable("SMTP_SERVER")
        self.smtp_port = int(get_env_variable_force("SMTP_PORT"))
        self.smtp_user = get_env_variable_force("SMTP_USER")
        self.smtp_password = get_secret_force("SMTP_PASSWORD")

        if get_env_variable_force("API_ENV") == "prod":
            self.client_protocol = get_env_variable_force("CLIENT_PROTOCOL")
            self.client_host = get_env_variable_force("CLIENT_HOST")
        else:
            self.client_protocol = get_env_variable_with_default(
                "CLIENT_PROTOCOL", "http"
            )
            self.client_host = get_env_variable_with_default("CLIENT_HOST", "localhost")

    def render_template(self, template: Template, args: dict[str, Any]) -> str:
        return template.render(args)  # type: ignore

    def write_email_template(self, template_name: str, args: dict[str, Any]) -> str:
        env = Environment(
            loader=PackageLoader("api"),
            autoescape=select_autoescape(["html", "xml"]),
        )
        template = env.get_template(template_name)
        email = self.render_template(template, args)
        return email

    def write_email(self, subject: str, to_email: str, body: str) -> MIMEMultipart:
        message = MIMEMultipart("mixed")
        message["Subject"] = subject
        message["From"] = formataddr(("Real Ale Trail Tracker", self.from_email))
        message["To"] = to_email
        message["Message-ID"] = make_msgid()
        message.attach(MIMEText(body))
        return message

    def send_email(self, message: MIMEMultipart):
        if self.smtp_server is None:
            print(f"No SMTP server configured, would have sent:\n{message.as_string()}")
            return
        conn = smtplib.SMTP(self.smtp_server, self.smtp_port)
        conn.starttls()
        conn.set_debuglevel(False)
        conn.login(self.smtp_user, self.smtp_password)
        try:
            conn.sendmail(self.from_email, message["To"], message.as_string())
        finally:
            conn.close()

    def send_verify_email(self, user: FastApiUser, token: str) -> None:
        body = self.write_email_template(
            "verify.txt",
            {
                "verify_url": f"{self.client_protocol}://{self.client_host}/verify/{token}"
            },
        )
        message = self.write_email(
            "[realaletrail] Verify your account", user.email, body
        )
        self.send_email(message)

    def send_forgot_password_email(self, user: FastApiUser, token: str) -> None:
        body = self.write_email_template(
            "forgot-password.txt",
            {"reset_url": f"{self.client_protocol}://{self.client_host}/reset/{token}"},
        )
        message = self.write_email(
            "[realaletrail] Password reset request", user.email, body
        )
        self.send_email(message)
