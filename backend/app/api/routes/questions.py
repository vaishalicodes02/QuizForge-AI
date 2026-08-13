from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.routes.auth import get_current_user
from app.database.dependencies import get_db
from app.models.material import Material
from app.models.question import Question
from app.schemas.question import QuestionResponse
from app.services.ai_service import generate_questions


router = APIRouter(
    prefix="/questions",
    tags=["Questions"],
)


@router.post(
    "/generate/{material_id}",
    response_model=list[QuestionResponse],
)
def generate_material_questions(
    material_id: int,
    number_of_questions: int = 10,
    difficulty: str = "medium",
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    material = db.scalar(
        select(Material).where(Material.id == material_id)
    )

    if material is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Material not found",
        )

    if not material.extracted_text:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No extracted text available for this PDF",
        )

    if number_of_questions < 1 or number_of_questions > 50:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Number of questions must be between 1 and 50",
        )

    questions_data = generate_questions(
        text=material.extracted_text,
        number_of_questions=number_of_questions,
        difficulty=difficulty,
    )

    questions = []

    for item in questions_data:
        question = Question(
            question_text=item["question_text"],
            option_a=item["option_a"],
            option_b=item["option_b"],
            option_c=item["option_c"],
            option_d=item["option_d"],
            correct_answer=item["correct_answer"],
            explanation=item.get("explanation"),
            difficulty=item.get("difficulty", difficulty),
            material_id=material.id,
        )

        db.add(question)
        questions.append(question)

    db.commit()

    for question in questions:
        db.refresh(question)

    return questions

@router.get(
    "/{material_id}",
    response_model=list[QuestionResponse],
)
def get_material_questions(
    material_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    material = db.scalar(
        select(Material).where(Material.id == material_id)
    )

    if material is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Material not found",
        )

    questions = db.scalars(
        select(Question).where(Question.material_id == material_id)
    ).all()

    return questions