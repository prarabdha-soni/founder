import openai
from app.core.config import settings

openai.api_key = settings.OPENAI_API_KEY

def analyze_conversation(content: str) -> str:
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "Analyze this sales conversation and extract key insights, objections, and sentiment."},
            {"role": "user", "content": content}
        ],
        max_tokens=300
    )
    return response.choices[0].message.content 