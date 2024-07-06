import os

from models import User, Activity
from sqlmodel import create_engine, SQLModel

database_engine = create_engine(os.getenv("DATABASE_CONNECTION_URL"), echo=True)


def create_db_and_tables():
	SQLModel.metadata.create_all(database_engine)


if __name__ == "__main__":
	create_db_and_tables()
