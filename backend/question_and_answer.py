import os
from pathlib import Path
from backend.llm import generate_response, client
from backend.text_processing import open_json, open_markdown, save_json
from backend.prompts import PROMPT_QUESTION_ANSWER_GENERATION
import glob

ques_ans_save_path = 'backend/data/Ques_&_Answer/generated_ques_answer.json'
notes_dir = Path('backend/data/Notes_content')
print(notes_dir.exists()) 
notes_content_files = list(notes_dir.rglob("*.md"))

    
def generate_question_ans(markdown_file, prompt):
    print(f"{markdown_file = }")
    text = open_markdown(markdown_file)
    
    prompt = prompt.format(content = text)
    response = generate_response(client, prompt)
    
    print("Question Answer generated for ", markdown_file.stem)
    return response
    
    
    
if __name__ == "__main__":
    que_n_ans_json_path = 'backend/data/Ques_&_Answer/generated_ques_answer.json'
    if os.path.exists(que_n_ans_json_path):
        que_ans_list = open_json(que_n_ans_json_path)
    else: 
        que_ans_list = []
    for file in notes_content_files:
        que_ans_list = open_json(que_n_ans_json_path)
        response = generate_question_ans(file, PROMPT_QUESTION_ANSWER_GENERATION)
        if response:
            for item in response:
                que_ans_list.append(item)
            save_json(que_ans_list, ques_ans_save_path)
        else:
            print("Error generating response for ", file)
        
    
    