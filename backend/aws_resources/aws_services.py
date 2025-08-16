import os
import traceback

import pdfplumber
import requests

from ..llm import client, generate_response
from ..prompts import (
    PROMPT_GET_AWS_CERTIFICATION_EXAM_GUIDE,
    PROMPT_GET_AWS_SERVICE_WEBPAGE_LINKS,
    PROMPT_GET_CERTIFICATE_DETIALS,
    PROMPT_GET_INSCOPE_SERVICES,
)
from ..text_processing import create_jina_link, open_json, save_json


def validate_url(url):
    try:
        r = requests.head(url, allow_redirects=True, timeout=10)
        return (
            r.status_code == 200 and "pdf" in r.headers.get("Content-Type", "").lower()
        )
    except Exception:
        return False


def get_aws_pdf_url(certificate):
    while True:
        response = generate_response(
            client,
            PROMPT_GET_AWS_CERTIFICATION_EXAM_GUIDE.format(certificate=certificate),
        )

        try:
            url = response.get("website", "").strip()
        except Exception as e:
            print("Error parsing JSON:", e)
            continue

        # Validate URL
        if validate_url(url):
            print(f"✅ Found valid link: {url}")
            return url
        else:
            print(f"❌ Invalid link from LLM: {url}")
            print("🔄 Re-prompting LLM...")
            continue


def download_pdf(url, filename):
    headers = {"User-Agent": "Mozilla/5.0"}  # helps avoid some 403 errors
    response = requests.get(url, stream=True, headers=headers)
    response.raise_for_status()  # raise error if download fails

    with open(filename, "wb") as f:
        for chunk in response.iter_content(chunk_size=8192):
            if chunk:
                f.write(chunk)
    print(f"✅ PDF downloaded successfully: {filename}")


def pdf_to_markdown(pdf_path, md_path):
    with pdfplumber.open(pdf_path) as pdf:
        text = "\n".join(page.extract_text() or "" for page in pdf.pages)
    with open(md_path, "w", encoding="utf-8") as f:
        f.write(text)
    print(f"✅ Markdown file saved: {md_path}")


def get_aws_service_urls(services_list, prompt, save_url_data):
    response = generate_response(client, prompt.format(services=services_list))
    if response is not None:
        url_dicts = {}
        for k, v in response.items():
            url_dicts[k] = {"original_link": v, "jina_link": create_jina_link(v)}

        save_json(url_dicts, save_url_data)
    return None


if __name__ == "__main__":
    certificate = "AWS Certified Cloud Practitioner"
    pdf_path = f"backend/data/llm_extracted_resources/{certificate}_exam_guide.pdf"
    md_path = f"backend/data/llm_extracted_resources/{certificate}_exam_guide.md"
    website_map_path = f"backend/data/llm_extracted_resources/{certificate}_aws_service_website_map.json"
    aws_services = []
    ## Get exam guid URL
    if os.path.exists(pdf_path):
        pass
    else:
        url = get_aws_pdf_url(certificate)

        pdf_url = url
        response = requests.get(pdf_url)

        ## Save URL content as markdown
        pdf_to_markdown(pdf_path, md_path)

    with open(md_path, "r", encoding="utf-8") as f:
        markdown_text = f.read()

    ## LLM retrieve In scope aws services for given certificate
    get_inscope_services = True
    if os.path.exists(website_map_path):
        aws_service_website_map = open_json(website_map_path)
    else:
        aws_service_website_map = {}

    if get_inscope_services:
        in_scope_services = generate_response(
            client,
            PROMPT_GET_INSCOPE_SERVICES.format(
                markdown_text=markdown_text,
                certification="AWS Certified Cloud Practitioner",
            ),
        )

        # Ensure in_scope_services is not None and has 'services' key
        services_list = []
        if (
            in_scope_services
            and isinstance(in_scope_services, dict)
            and "services" in in_scope_services
        ):
            services_list = in_scope_services["services"] or []
        else:
            print(
                "⚠️ Warning: No 'services' key found in in_scope_services response or response is None."
            )

        aws_services = [
            service
            for service in services_list
            if isinstance(service, str)
            and (service.startswith("AWS") or service.startswith("Amazon"))
        ]
    service_urls = get_aws_service_urls(
        aws_services, PROMPT_GET_AWS_SERVICE_WEBPAGE_LINKS, website_map_path
    )

    # certification_details = generate_response(
    #     client,
    #     PROMPT_GET_CERTIFICATE_DETIALS.format(
    #         certificate="AWS Certified Cloud Practitioner"
    #     )
    # )
