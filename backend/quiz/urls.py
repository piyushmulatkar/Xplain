from django.urls import path

from .views import QuizView, SubmitQuizView

urlpatterns = [
    path("submit/", SubmitQuizView.as_view(), name="submit-quiz"),
    path("<str:category>/", QuizView.as_view(), name="quiz"),
]