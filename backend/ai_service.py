import os
from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()

# We expect the user to provide this key in the .env file later if they haven't
API_KEY = os.getenv("GEMINI_API_KEY", "dummy_key")

def analyze_documents(file_paths: list[str]) -> dict:
    """
    Simulates sending files to Gemini and extracting data.
    In a real scenario with a valid key, this will use the SDK.
    """
    if API_KEY == "dummy_key":
        print("WARNING: Using dummy API key. Simulating real AI processing.")
        return simulate_ai_response(file_paths)

    try:
        client = genai.Client(api_key=API_KEY)
        
        uploaded_files = []
        for path in file_paths:
            print(f"Uploading {path} to Gemini...")
            uploaded_file = client.files.upload(file=path)
            uploaded_files.append(uploaded_file)
            
        prompt = """
        You are a strict bank compliance officer. Review these uploaded documents for a business account / loan application.
        1. Extract the primary applicant's Name, any Expiry Dates (like on IDs or Licenses), and Income/Revenue figures.
        2. Cross-reference the documents. Does the name on the ID match the Trade License? Are any IDs expired?
        3. Provide a final recommendation: 'approve', 'review', or 'reject'.
        4. Provide a 2-3 sentence executive summary explaining your decision.
        
        Respond ONLY in JSON format like this:
        {
          "summary": "Your executive summary",
          "recommendation": "approve/review/reject",
          "documents": [
            {
              "filename": "name of file",
              "type": "passport/emirates_id/trade_license/etc",
              "is_valid": true/false,
              "extracted_data": {"name": "...", "expiry": "..."},
              "notes": "Any validation issues"
            }
          ]
        }
        """
        
        print("Analyzing documents with Gemini...")
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=uploaded_files + [prompt],
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
            )
        )
        
        import json
        return json.loads(response.text)
        
    except Exception as e:
        print(f"Gemini API Error: {e}")
        return simulate_ai_response(file_paths, error=str(e))

def simulate_ai_response(file_paths: list[str], error: str = None) -> dict:
    # A fallback simulated response that looks like it processed the specific files uploaded
    docs = []
    for path in file_paths:
        filename = os.path.basename(path)
        doctype = "unknown"
        if "id" in filename.lower(): doctype = "emirates_id"
        elif "trade" in filename.lower() or "license" in filename.lower(): doctype = "trade_license"
        elif "pass" in filename.lower(): doctype = "passport"
        elif "bank" in filename.lower() or "statement" in filename.lower(): doctype = "bank_statement"
        
        docs.append({
            "filename": filename,
            "type": doctype,
            "is_valid": True,
            "extracted_data": {"extracted_from": filename, "status": "simulated"},
            "notes": ""
        })
        
    return {
        "summary": f"Fallback simulated analysis of {len(file_paths)} documents due to missing API key or error. Error: {error}" if error else f"Simulated analysis of {len(file_paths)} documents.",
        "recommendation": "review",
        "documents": docs
    }

def upload_kb_document(file_path: str) -> dict:
    if API_KEY == "dummy_key":
        return {"gemini_file_uri": "dummy_uri", "gemini_file_name": "dummy_name"}
    try:
        client = genai.Client(api_key=API_KEY) 
        print(f"Uploading KB doc {file_path} to Gemini...")
        uploaded_file = client.files.upload(file=file_path)
        return {"gemini_file_uri": uploaded_file.uri, "gemini_file_name": uploaded_file.name}
    except Exception as e:
        print(f"Gemini API Error in KB Upload: {e}")
        return None

def chat_with_kb(message: str, file_uris: list[str]) -> str:
    if API_KEY == "dummy_key":
        return "This is a simulated response because the API key is invalid. You asked: " + message
    try:
        client = genai.Client(api_key=API_KEY) 
        uploaded_files = []
        for uri in file_uris:
            uploaded_files.append(types.Part.from_uri(file_uri=uri, mime_type="application/pdf"))
        
        prompt = (
            "You are Z-Grow AI, an intelligent internal assistant for banking staff.\n"
            "You have been provided with internal standard operating procedure (SOP) manuals and guidelines.\n"
            "Answer the staff member's question based strictly on these documents.\n"
            "Formatting guidelines:\n"
            "- Organize your answer clearly with short paragraphs, bold headers, and clean bullet points (* item).\n"
            "- Put every citation in parentheses specifying document name, page, and section, e.g. (Document Name, Page X, Section Y).\n"
            "- If the answer is not in the documents, state that clearly based on the provided manuals.\n\n"
            f"Staff Question: {message}\n"
        )
        
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=uploaded_files + [prompt]
        )
        return response.text
    except Exception as e:
        print(f"Gemini API Error in KB Chat: {e}")
        return f"Error analyzing documents: {e}"
