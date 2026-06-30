from rest_framework import serializers


class QuizSubmitSerializer(serializers.Serializer):
    category = serializers.CharField()

    answers = serializers.ListField(
        child=serializers.DictField()
    )