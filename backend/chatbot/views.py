from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .serializers import ChatRequestSerializer
from .chatbot import search, CONFIDENCE_THRESHOLD


class ChatbotView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChatRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        message = serializer.validated_data["message"]

        result = search(message)

        if result["confidence"] < CONFIDENCE_THRESHOLD:
            answer = "Sorry, I couldn't find a confident answer."
        else:
            answer = result["answer"]

        return Response(
            {
                "answer": answer,
                "confidence": result["confidence"],
                "matched_question": result["question"],
            }
        )