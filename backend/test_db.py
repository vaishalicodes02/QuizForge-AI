from sqlalchemy import text

from app.database.session import engine


try:
    with engine.connect() as connection:
        result = connection.execute(text("SELECT 1"))
        print("MySQL connection successful!")
        print("Result:", result.scalar())

except Exception as e:
    print("MySQL connection failed!")
    print(e)