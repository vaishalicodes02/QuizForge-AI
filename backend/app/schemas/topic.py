from pydantic import BaseModel, ConfigDict


class TopicCreate(BaseModel):
    name: str
    description: str | None = None


class TopicResponse(BaseModel):
    id: int
    name: str
    description: str | None = None
    subject_id: int

    model_config = ConfigDict(from_attributes=True)