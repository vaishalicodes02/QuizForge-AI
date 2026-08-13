from pydantic import BaseModel, ConfigDict


class QuestionResponse(BaseModel):
    id: int
    question_text: str

    option_a: str
    option_b: str
    option_c: str
    option_d: str

    correct_answer: str
    explanation: str | None = None
    difficulty: str
    material_id: int

    model_config = ConfigDict(from_attributes=True)