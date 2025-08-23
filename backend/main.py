from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from rag import get_agent
import re


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str

def clean_output(output):
    cleaned_output = re.sub(r'\s+', ' ', output)  
    cleaned_output = re.sub(r'[^\x00-\x7F]+', '', cleaned_output) 
    return cleaned_output.strip()

def extract_output_from_string(data):
    match = re.search(r"'output':\s*\"(.*?)\"", data, re.DOTALL)
    if match:
        return match.group(1)
    return ''

agent = get_agent()
@app.post("/chat", response_model=ChatResponse)
def chat_endpoint(req: ChatRequest):
    try:
        answer = agent.invoke(req.message)
        answer = str(answer)
        return {"response": answer } # must return a string 

    except Exception as e:
        return {"response": f"Error: {str(e)}"}
