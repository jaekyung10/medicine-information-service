# 💊 Medicine Information Service
FastAPI와 MySQL을 활용한 의약품 정보 검색 웹 서비스

사용자가 약물명을 검색하면 성분, 효능, 사용법, 부작용, 상호작용 및 알레르기 정보를 조회할 수 있는 웹 기반 서비스.

---

## 📌 프로젝트 개요

- 의약품 데이터베이스를 기반으로 정보 검색 시스템 구현
- FastAPI를 활용한 RESTful API 설계
- MySQL + SQLAlchemy를 통한 데이터 관리
- 프론트엔드와 백엔드 연동을 통한 웹 서비스 완성

---

## 🛠 Tech Stack

### Backend
- Python
- FastAPI
- SQLAlchemy
- MySQL

### Frontend
- HTML
- JavaScript
- CSS

---

# 👩‍💻 담당 역할

### ✅ 프론트엔드 설계 및 구현 (HTML, JavaScript)

본 프로젝트에서 프론트엔드 동작 구현을 담당.

---

## 💻 프론트엔드 구현 내용

### 1️⃣ index.html – UI 설계

- 검색 바 및 결과 출력 화면 설계
- 사용자 입력 기반 검색 화면 구현
- 기능별 탭(성분 조회, 알레르기 필터링, 상호작용, 부작용) UI 구성
- 직관적인 사용자 경험을 고려한 화면 전환 구조 설계

---

### 2️⃣ main.js – API 연동 및 동작 구현

#### 🔹 API 데이터 렌더링 구현
- index.html과 연결된 main.js를 통해 FastAPI 엔드포인트 호출
- fetch API를 활용하여 JSON 응답 데이터를 동적으로 화면에 렌더링

#### 🔹 자동완성 검색 기능 구현
- 사용자가 약품 이름을 입력하면 `/autocomplete` API 호출
- 실시간 자동완성 목록 표시
- 정확한 약물 선택 시 다음 화면으로 전환

#### 🔹 상세 조회 화면 구현
- 선택한 약품에 대해:
  - 성분 및 효능 정보 조회
  - 사용법 및 보관 방법 조회
  - 상호작용 정보 조회
  - 부작용 및 경고 정보 조회
- 새로운 창을 열어 API 결과를 동적으로 표시

#### 🔹 알레르기 필터링 기능 구현
- 사용자가 입력한 알레르기 유발 성분 기반으로 `/filter_allergy` API 호출
- 포함 여부에 따라 경고 메시지 또는 안전 메시지 출력

#### 🔹 기능 최적화
- localStorage를 활용해 검색어 유지
- 화면 전환 애니메이션 적용
- API 호출 결과를 실시간으로 반영하여 사용자 경험 개선

---

## ⚙️ 주요 API 기능

- `/search_all` : 의약품 전체 정보 조회
- `/autocomplete` : 자동완성 검색
- `/search_{column}` : 특정 항목 조회
- `/extract_brackets` : 괄호 내 성분 추출
- `/filter_allergy` : 알레르기 성분 필터링

---

## 🗂 프로젝트 구조

```
medicine-information-service/
│
├── main.py
├── database.py
├── models.py
├── requirements.txt
│
├── frontend/
│   ├── index.html
│   ├── main.js
│   └── main.css
│
└── README.md
```

---

## 🚀 실행 방법

1️⃣ 패키지 설치
```
pip install -r requirements.txt
```

2️⃣ 서버 실행
```
uvicorn main:app --reload
```

3️⃣ Swagger UI 접속
```
http://127.0.0.1:8000/docs
```


4️⃣ 프론트엔드 실행  
```
frontend/index.html 파일을 브라우저에서 실행
```

## ⚠ 주의사항

본 프로젝트는 Azure MySQL 데이터베이스를 사용합니다.

Azure 방화벽 설정으로 인해 외부 환경에서는 DB 연결이 제한될 수 있습니다.  
로컬 환경에서 DB 접근 권한이 허용된 경우 정상적으로 실행됩니다.

DB 연결이 제한된 경우 API 호출 시 데이터 조회가 되지 않을 수 있습니다.

---

## 📷 실행 화면

### Swagger UI
<img width="1899" height="656" alt="image" src="https://github.com/user-attachments/assets/cb157215-c20a-41ce-b2d8-9b04b0945f5a" />

### API 테스트 (Autocomplete)
<img width="1785" height="830" alt="image" src="https://github.com/user-attachments/assets/c5f61e0b-8780-4eed-a2df-f3b6223a20b4" />
<img width="1766" height="741" alt="image" src="https://github.com/user-attachments/assets/5f474612-c017-4111-9f61-78d255384085" />

Swagger UI에서 `/autocomplete` 엔드포인트를 실행한 결과 화면입니다.

### Frontend 화면
<img width="1919" height="961" alt="image" src="https://github.com/user-attachments/assets/042354f3-e5e7-4c9f-b04d-6eb75b043c67" />
<img width="1919" height="879" alt="image" src="https://github.com/user-attachments/assets/3720f642-6f82-4deb-b3d0-42253f706317" />


### ⚠ 데모 모드 안내

Azure MySQL 외부 접근 제한으로 인해 일부 환경에서는 DB 연결이 제한될 수 있습니다.  
시연을 위해 자동완성 기능은 DB 연결 실패 시 데모 데이터로 동작하도록 예외 처리를 추가했습니다.




