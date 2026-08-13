import json

from google import genai
from google.genai import types

from app.core.config import settings


client = genai.Client(
    api_key=settings.ai_api_key
)


def generate_questions(
    text: str,
    number_of_questions: int = 10,
    difficulty: str = "medium",
):
    if not text.strip():
        raise ValueError("No text was extracted from the PDF.")

    if number_of_questions < 1:
        raise ValueError("Number of questions must be at least 1.")

    allowed_difficulties = {"easy", "medium", "hard"}

    if difficulty not in allowed_difficulties:
        raise ValueError(
            "Difficulty must be easy, medium, or hard."
        )

    prompt = f"""
You are an expert educational quiz generator.

Generate exactly {number_of_questions} multiple-choice questions
from the study material provided below.

Difficulty: {difficulty}

IMPORTANT RULES:

1. Questions must be based ONLY on the provided study material.
2. Generate exactly {number_of_questions} questions.
3. Every question MUST have exactly four options.
4. Every question MUST contain:
   - question_text
   - option_a
   - option_b
   - option_c
   - option_d
   - correct_answer
   - explanation
   - difficulty
5. correct_answer MUST be exactly one of:
   A, B, C, D
6. Only one option can be correct.
7. Do not create duplicate questions.
8. Explanations should be short and based on the study material.

Study material:

{text}
"""

    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema={
                "type": "object",
                "properties": {
                    "questions": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "question_text": {
                                    "type": "string"
                                },
                                "option_a": {
                                    "type": "string"
                                },
                                "option_b": {
                                    "type": "string"
                                },
                                "option_c": {
                                    "type": "string"
                                },
                                "option_d": {
                                    "type": "string"
                                },
                                "correct_answer": {
                                    "type": "string",
                                    "enum": ["A", "B", "C", "D"]
                                },
                                "explanation": {
                                    "type": "string"
                                },
                                "difficulty": {
                                    "type": "string",
                                    "enum": ["easy", "medium", "hard"]
                                },
                            },
                            "required": [
                                "question_text",
                                "option_a",
                                "option_b",
                                "option_c",
                                "option_d",
                                "correct_answer",
                                "explanation",
                                "difficulty",
                            ],
                        },
                    }
                },
                "required": ["questions"],
            },
        ),
    )

    response_text = response.text.strip()

    try:
        data = json.loads(response_text)
    except json.JSONDecodeError as exc:
        raise ValueError(
            "AI returned invalid JSON."
        ) from exc

    questions = data.get("questions")

    if not isinstance(questions, list):
        raise ValueError(
            "AI response does not contain a questions list."
        )

    if len(questions) != number_of_questions:
        raise ValueError(
            f"AI returned {len(questions)} questions "
            f"instead of {number_of_questions}."
        )

    required_fields = {
        "question_text",
        "option_a",
        "option_b",
        "option_c",
        "option_d",
        "correct_answer",
        "explanation",
        "difficulty",
    }

    for index, question in enumerate(questions, start=1):

        missing_fields = required_fields - question.keys()

        if missing_fields:
            raise ValueError(
                f"Question {index} is missing fields: "
                f"{', '.join(sorted(missing_fields))}"
            )

        if question["correct_answer"] not in {
            "A",
            "B",
            "C",
            "D",
        }:
            raise ValueError(
                f"Question {index} has an invalid correct_answer."
            )

    return questions