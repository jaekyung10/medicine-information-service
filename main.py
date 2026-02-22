import sys
import os
import re
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from database import engineconn
from models import Medicine


# Initialize FastAPI
app = FastAPI(debug=True)

# Add CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Database
engine = engineconn()
session = engine.sessionmaker()

def create_response(success: bool, data=None, message=""):
    """Create a consistent JSON response format."""
    return {"success": success, "data": data, "message": message}

def extract_parentheses(text):
    """Extract content inside parentheses from a string."""
    matches = re.findall(r'\((.*?)\)', text)
    return matches


@app.get("/search_all")
async def get_medicine(inputitemName: str = Query(..., description="Name of the medicine to search for")):
    try:
        medicine = session.query(Medicine).filter(Medicine.itemName == inputitemName).first()
        if not medicine:
            return create_response(success=False, message="No medicine found with the given name")

        data = {
            "itemName": medicine.itemName,
            "efficiency": medicine.efficiency,
            "useMethod": medicine.useMethod,
            "Caution": medicine.Caution,
            "Warning": medicine.Warning,
            "Interaction": medicine.Interaction,
            "sideEffect": medicine.sideEffect,
            "Storage": medicine.Storage,
            "openDe": medicine.openDe,
            "updateDe": medicine.updateDe,
            "Image": medicine.Image,
        }
        return create_response(success=True, data=data)
    except Exception as e:
        return create_response(success=False, message=str(e))

# Autocomplete Endpoint
@app.get("/autocomplete")
async def autocomplete_medicine(
    query: str = Query(..., description="Partial name of the medicine"),
    limit: int = 10, offset: int = 0
):
    """Autocomplete medicine names based on partial query."""
    try:
        medicines = session.query(Medicine).filter(Medicine.itemName.ilike(f"%{query}%")) \
            .limit(limit).offset(offset).all()
        data = [m.itemName for m in medicines]
        return create_response(success=True, data=data)
    except Exception as e:
        return create_response(success=False, message=str(e))
    
@app.get("/search_{column}")
async def get_column_value(column: str, inputitemName: str = Query(..., description="Name of the medicine to search for")):
    try:
        valid_columns = [
            "bizName", "efficiency", "useMethod", "Caution", "Warning",
            "Interaction", "sideEffect", "Storage", "openDe", "updateDe", "Image"
        ]
        if column not in valid_columns:
            return create_response(success=False, message=f"Invalid column name: {column}")

        medicine = session.query(Medicine).filter(Medicine.itemName == inputitemName).first()
        if not medicine:
            return create_response(success=False, message="No medicine found with the given name")

        data = getattr(medicine, column, "No data found")
        return create_response(success=True, data={column: data})
    except Exception as e:
        return create_response(success=False, message=str(e))
    
@app.get("/extract_brackets")
async def extract_brackets(inputitemName: str = Query(..., description="Name of the medicine to extract content from")):
    try:
        # Medicine 테이블에서 itemName 검색
        medicine = session.query(Medicine).filter(Medicine.itemName == inputitemName).first()
        if not medicine:
            return {"success": False, "message": "No medicine found with the given name"}

        # 괄호 안의 내용을 추출
        extracted = extract_parentheses(medicine.itemName)
        return {"success": True, "data": extracted, "message": ""}
    except Exception as e:
        return {"success": False, "message": str(e)}
    
@app.get("/filter_allergy")
async def filter_allergy(
    inputitemName: str = Query(..., description="Name of the medicine"),
    allergen: str = Query(..., description="Allergen to check for")
):
    """Filter allergens in a specific medicine."""
    try:
        medicine = session.query(Medicine).filter(Medicine.itemName == inputitemName).first()
        if not medicine:
            return create_response(success=False, message="No medicine found with the given name")

        # Extract content inside parentheses and check exact match
        bracket_contents = extract_parentheses(medicine.itemName)
        is_exact_match = (
            allergen == (medicine.Caution or "").strip() or
            allergen == (medicine.Warning or "").strip() or
            allergen in bracket_contents
        )

        if is_exact_match:
            return create_response(
                success=True,
                data={"contains_allergen": True},
                message=f"'{allergen}'가 포함되어 있으니 주의하세요!"
            )
        return create_response(
            success=True,  # success=True로 설정
            data={"contains_allergen": False},
            message=f"안전합니다! 입력한 성분 '{allergen}'가 포함되지 않았습니다."
        )
    except Exception as e:
        return create_response(success=False, message=str(e))
