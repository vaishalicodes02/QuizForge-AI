from pathlib import Path
from uuid import uuid4

from fastapi import (
    APIRouter,
    Depends,
    File,
    HTTPException,
    UploadFile,
    status,
)
from pypdf import PdfReader
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.routes.auth import get_current_user
from app.database.dependencies import get_db
from app.models.material import Material
from app.models.subject import Subject
from app.models.topic import Topic
from app.schemas.material import MaterialResponse


router = APIRouter(
    prefix="/materials",
    tags=["Materials"],
)


UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)


@router.post(
    "/upload",
    response_model=MaterialResponse,
    status_code=status.HTTP_201_CREATED,
)
async def upload_material(
    subject_id: int,
    topic_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    if file.content_type != "application/pdf":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF files are allowed",
        )

    subject = db.scalar(
        select(Subject).where(Subject.id == subject_id)
    )

    if subject is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Subject not found",
        )

    topic = db.scalar(
        select(Topic).where(
            Topic.id == topic_id,
            Topic.subject_id == subject_id,
        )
    )

    if topic is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Topic not found for this subject",
        )

    unique_filename = f"{uuid4()}_{file.filename}"
    file_path = UPLOAD_DIR / unique_filename

    contents = await file.read()
    file_path.write_bytes(contents)

    try:
        reader = PdfReader(str(file_path))

        extracted_text = ""

        for page in reader.pages:
            text = page.extract_text()

            if text:
                extracted_text += text + "\n"

    except Exception:
        file_path.unlink(missing_ok=True)

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Could not read PDF file",
        )

    material = Material(
        filename=file.filename,
        file_path=str(file_path),
        extracted_text=extracted_text,
        subject_id=subject_id,
        topic_id=topic_id,
    )

    db.add(material)
    db.commit()
    db.refresh(material)

    return material

@router.get("/")
def get_materials(
    db: Session = Depends(get_db),
):
    materials = db.scalars(
        select(Material)
    ).all()

    return materials