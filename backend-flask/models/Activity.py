from datetime import datetime

from sqlmodel import SQLModel, Field


class Activity(SQLModel, table=True):
	id: int | None = Field(default=None, primary_key=True)
	user_id: int = Field(foreign_key="user.id")
	message: str
	replies_count: int | None = Field(default=0)
	reposts_count: int | None = Field(default=0)
	likes_count: int | None = Field(default=0)
	reply_to_activity_uuid: int | None = Field(default=None)
	expires_at: datetime
	created_at: datetime | None = Field(default_factory=datetime.utcnow)
