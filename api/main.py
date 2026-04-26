from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pathlib import Path
import base64

app = FastAPI(
    title="the-app-api",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_FOLDER = Path(__file__).parent / "data"

IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png"}


def get_image_description(filename: str) -> str:
    """Make file name to description"""
    name = Path(filename).stem
    description = name.replace("_", " ").replace("-", " ")
    return description.title()


@app.get("/")
def read_root():
    return {"message": "root"}


@app.get("/health")
def health_check():
    return {"status": "up"}


@app.get("/list")
def list():
    if not DATA_FOLDER.exists():
        return {"images": [], "message": "Data folder not found"}
    
    images = []
    for file_path in sorted(DATA_FOLDER.iterdir()):
        if file_path.is_file() and file_path.suffix.lower() in IMAGE_EXTENSIONS:
            # Read image as base64
            with open(file_path, "rb") as f:
                image_data = base64.b64encode(f.read()).decode("utf-8")
            
            mime_type = f"image/{file_path.suffix[1:].lower()}"
            if file_path.suffix.lower() == ".jpg":
                mime_type = "image/jpeg"
            
            images.append({
                "filename": file_path.name,
                "description": get_image_description(file_path.name),
                "data": f"data:{mime_type};base64,{image_data}"
            })
    
    return {"images": images}