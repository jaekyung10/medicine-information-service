# Medicine Information Service 
FastAPI와 MySQL을 활용한 의약품 정보 검색 서비스입니다.

## Tech Stack
- Python
- FastAPI
- SQLAlchemy
- MySQL
- JavaScript

## 주요 기능
- 의약품 전체 정보 조회 (/search_all)
- 약품 자동완성 (/autocomplete)
- 특정 컬럼 조회 (/search_{column})
- 알레르기 성분 필터링 (/filter_allergy)

## 실행 방법
uvicorn main:app --reload

## API 문서
http://127.0.0.1:8000/docs
