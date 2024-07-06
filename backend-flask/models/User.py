from datetime import datetime

from sqlmodel import SQLModel, Field


class User(SQLModel, table=True):
	id: int | None = Field(default=None, primary_key=True)
	display_name: str
	handle: str
	cognito_user_id: str
	created_at: datetime | None = Field(default_factory=datetime.utcnow)
