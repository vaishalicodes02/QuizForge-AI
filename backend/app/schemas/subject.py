from pydantic import BaseModel, ConfigDict


class SubjectCreate(BaseModel):
    name: str
    description: str | None = None


class SubjectResponse(BaseModel):
    id: int
    name: str
    description: str | None = None

    model_config = ConfigDict(from_attributes=True)