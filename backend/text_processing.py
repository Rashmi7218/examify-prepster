import requests
import json

def create_jina_link(original_link:str):
    return original_link.replace("https://", "https://r.jina.ai/https://")


def save_website_markdown(jina_url: str, save_path:str):
    response = requests.get(jina_url)
    response.raise_for_status()
    print(f"Saving website content to {save_path}")
    with open(save_path, "w", encoding="utf-8") as f:
        f.write(response.text)
        

def save_json(data, json_path):
    with open(json_path, "w") as f:
        json.dump(data, f, indent=4)
        
def open_json(json_path):
    return json.load(open(json_path))

def open_markdown(markdown_file_path:str):
    with open(markdown_file_path, "r", encoding="utf-8") as f:
                markdown_text = f.read()
    return markdown_text

def save_as_markdown(text, md_filename):
    with open(md_filename, "w", encoding="utf-8") as f:
        f.write(text)
    print(f"✅ Saved as Markdown: {md_filename}")