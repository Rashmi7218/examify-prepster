import json
import os
import traceback
from dotenv import load_dotenv
from google import genai

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def process_json_text_response(response: str) -> dict | None:
    try:
        if "json" in response:
            response = response.replace("```json", "").replace("```", "").strip()
            return json.loads(response)
        else:
            return json.loads(response)
    except json.JSONDecodeError:
        print(f"Warning: Could not decode JSON response: {response}")
        return None


def generate_response(client, prompt: str) -> dict | None:
    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
        )
        # print(f"INFO LLM response {response.text = }")

        processed_response = process_json_text_response(response.text)
    except Exception:
        traceback.print_exc()
        processed_response = None

    return processed_response
