from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.routes.auth import get_current_user
from app.database.dependencies import get_db
from app.models.subject import Subject
from app.models.topic import Topic
from app.schemas.subject import SubjectCreate, SubjectResponse
from app.schemas.topic import TopicCreate, TopicResponse

router = APIRouter(prefix="/subjects", tags=["Subjects"])


@router.post(
    "",
    response_model=SubjectResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_subject(
    subject_data: SubjectCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    subject = Subject(
        name=subject_data.name,
        description=subject_data.description,
    )

    db.add(subject)
    db.commit()
    db.refresh(subject)

    return subject


@router.get(
    "",
    response_model=list[SubjectResponse],
)
def get_subjects(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return db.scalars(
        select(Subject).order_by(Subject.id)
    ).all()


@router.get(
    "/{subject_id}",
    response_model=SubjectResponse,
)
def get_subject(
    subject_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    subject = db.scalar(
        select(Subject).where(Subject.id == subject_id)
    )

    if subject is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Subject not found",
        )

    return subject


@router.post(
    "/{subject_id}/topics",
    response_model=TopicResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_topic(
    subject_id: int,
    topic_data: TopicCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    subject = db.scalar(
        select(Subject).where(Subject.id == subject_id)
    )

    if subject is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Subject not found",
        )

    topic = Topic(
        name=topic_data.name,
        description=topic_data.description,
        subject_id=subject_id,
    )

    db.add(topic)
    db.commit()
    db.refresh(topic)

    return topic


@router.get(
    "/{subject_id}/topics",
    response_model=list[TopicResponse],
)
def get_topics(
    subject_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    subject = db.scalar(
        select(Subject).where(Subject.id == subject_id)
    )

    if subject is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Subject not found",
        )

    return db.scalars(
        select(Topic)
        .where(Topic.subject_id == subject_id)
        .order_by(Topic.id)
    ).all()