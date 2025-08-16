#python -m backend.aws_resources.aws_content
import os

from ..llm import client, generate_response
from ..prompts import (
    ALTERNATE_PROMPT_TO_GET_FEATURE_LINK,
    PROMPT_GET_RELEVANT_SERVICE_INFO_FROM_JINA_WEB,
    PROMPT_GET_SERVICE_FEATURE_INFO_FROM_JINA_WEB,
)
from ..text_processing import (
    create_jina_link,
    open_json,
    open_markdown,
    save_as_markdown,
    save_website_markdown,
)


def extract_aws_service_content(
    url_json_data,
    service,
    notes_markdown_file_path,
    main_page_md_content_path,
    feature_page_md_content_path,
):
    if url_json_data:
        jina_link = url_json_data[service]["jina_link"]
        print(f"{jina_link =  }")

        if os.path.exists(main_page_md_content_path):
            print("Content already saved")
        else:
            save_website_markdown(jina_link, main_page_md_content_path)

        markdown_text = open_markdown(main_page_md_content_path)

        web_content = generate_response(
            client,
            PROMPT_GET_RELEVANT_SERVICE_INFO_FROM_JINA_WEB.format(
                service=service, markdown_text=markdown_text
            ),
        )
        main_page_content, feature_page_content = "", ""
        if web_content is not None and "features link" in web_content:
            print(">>>", [web_content["features link"]])

            main_page_content = f"""
## {service}

## Introduction
{web_content["introduction"]}

## Benefits
{web_content["benefits"]}

## Use Cases
{web_content["use cases"]}
                """
        else:
            print("Error: web_content is None or missing 'features link'")
            return

        if web_content:
            features_link = web_content.get("features link")
            if os.path.exists(feature_page_md_content_path):
                print("Features content already present")
                feature_content_present = True
                
            else:
                if features_link is None or "Null" in features_link :
                    print("Trying alternate prompt for feature link")
                    response = generate_response(
                        client,
                        ALTERNATE_PROMPT_TO_GET_FEATURE_LINK.format(service=service),
                    )
                    print(f"Feature link {response}")
                    features_link = response["features link"]
                    
                if features_link is not None and "feature" in features_link:
                    save_website_markdown(create_jina_link(features_link), feature_page_md_content_path)
                    feature_content_present = True
                else:
                    print("Features content is absent on web")
                    feature_content_present = False
        else:
            print("Error getting web content")

        if feature_content_present:
            with open(feature_page_md_content_path, "r", encoding="utf-8") as f:
                markdown_text = f.read()

            feature_content = generate_response(
                client,
                PROMPT_GET_SERVICE_FEATURE_INFO_FROM_JINA_WEB.format(
                    service=service, markdown_text=markdown_text
                ),
            )
            if feature_content:
                feature_page_content = f"""
## Overview
{feature_content.get("Overview", "")}
## Features
{feature_content.get("features", "")}
        """
        concat_content = main_page_content + feature_page_content

        save_as_markdown(concat_content, notes_markdown_file_path)


if __name__ == "__main__":
    content_dir_path = "backend/data/content"
    os.makedirs(content_dir_path, exist_ok=True)

    notes_dir_path = "backend/data/Notes_content/"
    os.makedirs(notes_dir_path, exist_ok=True)

    json_path = "backend/data/llm_extracted_resources/AWS Certified Cloud Practitioner_aws_service_website_map.json"

    ## run aws_service.py file to get the json content
    url_json_data = open_json(json_path)

    for service in list(url_json_data.keys())[14:25]:
        # if service =="Amazon EMR":
            print("SERVICE: ", service)
            notes_markdown_file_path = os.path.join(
                notes_dir_path, service + "_processed_content.md"
            )

            main_page_md_content_path = os.path.join(content_dir_path, service + ".md")
            feature_page_md_content_path = os.path.join(
                content_dir_path, service + "_feature.md"
            )

            if os.path.exists(notes_markdown_file_path):
                continue
            else:
                extract_aws_service_content(
                    url_json_data,
                    service,
                    notes_markdown_file_path,
                    main_page_md_content_path,
                    feature_page_md_content_path,
                )
