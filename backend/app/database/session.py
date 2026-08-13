from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.core.config import settings
from app.database.base import Base


engine = create_engine(
    settings.database_url,
    pool_pre_ping=True,
)

SessionLocal = sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False,
)

def create_tables():
    # Import all models so SQLAlchemy registers them with Base.metadata
    from app.models import User
    from app.models import Subject
    from app.models import Topic
    from app.models import Material
    from app.models import Question

    Base.metadata.create_all(bind=engine)