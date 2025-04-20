from google import genai
import json
from pydantic import BaseModel
from typing import List, get_type_hints
import re
from pydantic import BaseModel
from typing import Optional, List
from pydantic import ValidationError
import os
from datetime import datetime
from datetime import date



def extract_json(text_response):
    # This pattern matches a string that starts with '{' and ends with '}'
    pattern = r'\{[^{}]*\}'

    matches = re.finditer(pattern, text_response)
    json_objects = []

    for match in matches:
        json_str = match.group(0)
        try:
            # Validate if the extracted string is valid JSON
            json_obj = json.loads(json_str)
            json_objects.append(json_obj)
        except json.JSONDecodeError:
            # Extend the search for nested structures
            extended_json_str = extend_search(text_response, match.span())
            try:
                json_obj = json.loads(extended_json_str)
                json_objects.append(json_obj)
            except json.JSONDecodeError:
                # Handle cases where the extraction is not valid JSON
                continue

    if json_objects:
        return json_objects
    else:
        return None  # Or handle this case as you prefer

def extend_search(text, span):
    # Extend the search to try to capture nested structures
    start, end = span
    nest_count = 0
    for i in range(start, len(text)):
        if text[i] == '{':
            nest_count += 1
        elif text[i] == '}':
            nest_count -= 1
            if nest_count == 0:
                return text[start:i+1]
    return text[start:end]


def json_to_pydantic(model_class, json_data):
    try:
        model_instance = model_class(**json_data)
        return model_instance
    except ValidationError as e:
        print("Validation error:", e)
        return None


def validate_json_with_model(model_class, json_data):
    validated_data = []
    validation_errors = []
    
    if isinstance(json_data, list):
        for item in json_data:
            try:
                model_instance = model_class(**item)
                validated_data.append(model_instance.model_dump())
            except ValidationError as e:
                validation_errors.append({"error": str(e), "data": item})
    elif isinstance(json_data, dict):
        try:
            model_instance = model_class(**json_data)
            validated_data.append(model_instance.model_dump())
        except ValidationError as e:
            validation_errors.append({"error": str(e), "data": json_data})
    
    return validated_data, validation_errors

# Example usage
# text_response = "Some text with JSON {\"key\": \"value\", \"nested\": {\"key2\": \"value2\"}} embedded in it."
# extracted_json = extract_json(text_response)
# print(extracted_json)

# Define your Pydantic model
class TitlesModel(BaseModel):
    # Define your fields here, for example:
    # name: str
    # city: str
    # Define your fields here, for example:
    placeName: str
    latitude:  Optional[float] = None
    longitude:  Optional[float] = None
    address: Optional[str] = None
    media: Optional[List[str]] = None
    openingHours: Optional[str] = None
    city:  Optional[str] = None
    country:  Optional[str] = None
    date: Optional[datetime]  = None                     #Optional[datetime]  = None
    timeOfVisit:  Optional[str] = None
    duration:  Optional[str] = None
    notes:  Optional[str] = None


def responseFormat(response):
    topic = "Trip plan to JSON file"
    user_choice = response

    base_prompt = f"{topic}: Based on the user's plan  {user_choice},"

    optimized_prompt = base_prompt + (
        '. Please provide a response in a structured JSON format that matches the following model: '
        '{ "placeName": "Some Name", ["latitude": "latitude of place", "longitude": "longitude of place", "address": "address of place", "city": "city of place","country": "country of place", "timeOfVisit": "time to visit the place","duration": "duration of visit at place","notes": "notes about place"]}')


    # Generate content using the modified prompt
    gemeni_response =  response = client.models.generate_content(
        model='gemini-2.0-flash',
        contents=optimized_prompt,
    )
    print(gemeni_response.text)

    # Extract and validate the JSON from the LLM's response
    json_objects = extract_json(gemeni_response.text)

    #validate the response
    validated, errors = validate_json_with_model(TitlesModel, json_objects)

    if errors:
        # Handle errors (e.g., log them, raise exception, etc.)
        print("Validation errors occurred:", errors)

    else:
        model_object = json_to_pydantic(TitlesModel, json_objects[0])
        #play with json
        # for location in validated:
        #     print(f"{location['name']} in {location['city']}")