import json
import random
from pathlib import Path

from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import QuizSubmitSerializer


QUIZ_DIR = Path(__file__).resolve().parent / "quiz_data"


class QuizView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, category):
        file_path = QUIZ_DIR / f"{category}_quiz.json"

        if not file_path.exists():
            return Response(
                {"detail": "Quiz not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        with open(file_path, "r", encoding="utf-8") as f:
            questions = json.load(f)

        random.shuffle(questions)

        questions = questions[:10]

        response_questions = []

        for question in questions:
            response_questions.append(
                {
                    "id": question["id"],
                    "question": question["question"],
                    "options": question["options"],
                }
            )

        return Response(
            {
                "title": f"{category.title()} Quiz",
                "total_questions": len(response_questions),
                "questions": response_questions,
            }
        )


class SubmitQuizView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = QuizSubmitSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        category = serializer.validated_data["category"]
        submitted_answers = serializer.validated_data["answers"]

        file_path = QUIZ_DIR / f"{category}_quiz.json"

        if not file_path.exists():
            return Response(
                {"detail": "Quiz not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        with open(file_path, "r", encoding="utf-8") as f:
            questions = json.load(f)

        question_map = {
            q["id"]: q
            for q in questions
        }

        score = 0

        review = []

        for answer in submitted_answers:
            question = question_map.get(answer["question_id"])

            if question is None:
                continue

            correct = question["answer"]
            selected = answer["selected"]

            if selected == correct:
                score += 1

            review.append(
                {
                    "question_id": question["id"],
                    "question": question["question"],
                    "selected": selected,
                    "correct": correct,
                    "is_correct": selected == correct,
                }
            )

        total = len(submitted_answers)

        percentage = 0

        if total > 0:
            percentage = round((score / total) * 100, 2)

        return Response(
            {
                "score": score,
                "total": total,
                "percentage": percentage,
                "correct_answers": review,
            }
        )