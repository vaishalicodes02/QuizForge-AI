from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.routes.auth import get_current_user
from app.database.dependencies import get_db
from app.models.question import Question
from app.schemas.quiz import QuizResult, QuizSubmit

router = APIRouter(
    prefix="/quiz",
    tags=["Quiz"],
)


@router.post(
    "/submit",
    response_model=QuizResult,
)
def submit_quiz(
    quiz: QuizSubmit,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    score = 0
    total_questions = len(quiz.answers)

    results = []

    for answer in quiz.answers:
        question = db.scalar(
            select(Question).where(
                Question.id == answer.question_id,
                Question.material_id == quiz.material_id,
            )
        )

        if question is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Question {answer.question_id} not found for this material",
            )
        is_correct = (
            answer.selected_answer.upper()
            == question.correct_answer.upper()
        )

        if is_correct:
            score += 1

        results.append(
            {
                "question_id": question.id,
                "selected_answer": answer.selected_answer,
                "correct_answer": question.correct_answer,
                "is_correct": is_correct,
                "explanation": question.explanation,
            }
        )

    percentage = (
        (score / total_questions) * 100
        if total_questions > 0
        else 0
    )

    return {
        "material_id": quiz.material_id,
        "total_questions": total_questions,
        "correct_answers": score,
        "wrong_answers": total_questions - score,
        "score_percentage": percentage,
        "results": results,
    }