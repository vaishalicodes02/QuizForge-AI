from pydantic import BaseModel, ConfigDict


class MaterialResponse(BaseModel):
    id: int
    filename: str
    subject_id: int
    topic_id: int

    model_config = ConfigDict(from_attributes=True)