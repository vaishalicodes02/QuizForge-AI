from contextlib import asynccontextmanager
from app.api.routes.subjects import router as subjects_router
from fastapi import FastAPI
from app.api.routes.materials import router as materials_router
from app.api.routes.auth import router as auth_router
from app.database.session import create_tables
from app.api.routes.questions import router as questions_router
from app.api.routes import quiz

@asynccontextmanager
async def lifespan(app: FastAPI):
    create_tables()
    yield


app = FastAPI(
    title="QuizForge AI API",
    version="0.1.0",
    lifespan=lifespan,
)

app.include_router(auth_router)
app.include_router(subjects_router)
app.include_router(materials_router)
app.include_router(questions_router)
app.include_router(quiz.router)

@app.get("/")
def root():
    return {
        "message": "QuizForge AI API is running",
        "version": "0.1.0",
    }