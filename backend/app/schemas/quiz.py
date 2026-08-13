from pydantic import BaseModel
from pydantic import BaseModel, field_validator
from pydantic import BaseModel, Field, field_validator

class AnswerSubmit(BaseModel):
    question_id: int
    selected_answer: str

    @field_validator("selected_answer")
    @classmethod
    def validate_selected_answer(cls, value: str):
        value = value.upper().strip()

        if value not in {"A", "B", "C", "D"}:
            raise ValueError("Selected answer must be A, B, C, or D")

        return value


class QuizSubmit(BaseModel):
    material_id: int
    answers: list[AnswerSubmit] = Field(min_length=1)


class QuestionResult(BaseModel):
    question_id: int
    selected_answer: str
    correct_answer: str
    is_correct: bool
    explanation: str | None


class QuizResult(BaseModel):
    material_id: int
    total_questions: int
    correct_answers: int
    wrong_answers: int
    score_percentage: float
    results: list[QuestionResult]