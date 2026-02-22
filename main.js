"use strict";

// 홈 화면 -> 탭 화면 전환
function showTabs() {
    const homeScreen = document.getElementById("home-screen");
    const tabsScreen = document.getElementById("tabs-screen");
    const searchInput = document.getElementById("search").value.trim();
    const errorLabel = document.getElementById("error-label"); // 오류 레이블 가져오기

    if (!searchInput) {
        errorLabel.textContent = "약물 이름을 입력해주세요.";
        errorLabel.style.display = "block";
        return;
    }

    fetch(`http://127.0.0.1:8000/autocomplete?query=${searchInput}`)
        .then((response) => response.json())
        .then((data) => {
            if (data.success && data.data.length > 0) {
                localStorage.setItem("searchInput", searchInput); // 검색어 저장
                errorLabel.style.display = "none"; // 오류 메시지 숨기기
                homeScreen.style.animation = "fadeOut 0.5s forwards";
                setTimeout(() => {
                    homeScreen.style.display = "none";
                    tabsScreen.style.display = "block";
                    tabsScreen.style.animation = "fadeInUp 0.5s forwards";
                }, 500);
            } else {
                errorLabel.textContent = "정확한 약물 이름을 입력해주세요.";
                errorLabel.style.display = "block"; // 오류 메시지 표시
            }
        })
        .catch((error) => {
            errorLabel.textContent = "서버 오류가 발생했습니다. 다시 시도해주세요.";
            errorLabel.style.display = "block"; // 오류 메시지 표시
        });
}

// 자동완성 검색 기능
async function autocompleteSearch() {
    const searchInput = document.getElementById("search");
    const resultsContainer = document.getElementById("autocomplete-results");

    // 입력 이벤트 처리
    searchInput.addEventListener("input", async () => {
        const query = searchInput.value.trim();

        if (query.length === 0) {
            resultsContainer.innerHTML = ''; // 기존 결과 초기화
            resultsContainer.style.display = 'none'; // 결과 숨김
            return;
        }

        try {
            // API 호출
            const response = await fetch(`http://127.0.0.1:8000/autocomplete?query=${encodeURIComponent(query)}`);
            const data = await response.json();

            if (data.success && data.data.length > 0) {
                resultsContainer.innerHTML = ''; // 기존 결과 초기화
                resultsContainer.style.display = 'block'; // 결과 표시

                // 결과 추가
                data.data.forEach(item => {
                    const li = document.createElement("li");
                    li.textContent = item;
                    li.onclick = () => selectMedicine(item);
                    resultsContainer.appendChild(li);
                });
            } else {
                resultsContainer.innerHTML = ''; // 검색 결과 없을 때 초기화
                resultsContainer.style.display = 'none'; // 창 숨기기
            }
        } catch (error) {
            console.error("API 호출 중 오류:", error);
            resultsContainer.innerHTML = '<li>오류가 발생했습니다. 다시 시도해주세요.</li>';
            resultsContainer.style.display = 'block';
        }
    });
}

// 약물 선택 시 동작
function selectMedicine(medicineName) {
    const searchInput = document.getElementById("search");
    const resultsContainer = document.getElementById("autocomplete-results");

    searchInput.value = medicineName; // 선택한 값 설정
    resultsContainer.innerHTML = ''; // 결과 숨기기
    resultsContainer.style.display = 'none';
}

// 새로운 탭 열기
function openNewTab(apiEndpoint, tabName) {
    const searchInput = localStorage.getItem("searchInput");
    if (!searchInput) {
        alert("검색어를 입력하세요.");
        return;
    }

    const newWindow = window.open("", "_blank");
    newWindow.document.write(`
        <!DOCTYPE HTML>
        <html>
        <head>
            <title>${tabName}</title>
            <meta charset="utf-8" />
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #2c3e50;
                    color: white;
                    margin: 0;
                    padding: 20px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 100vh;
                    text-align: center;
                }
                h1 {
                    margin-bottom: 20px;
                }
                #content {
                    margin: 20px 0;
                }
                button {
                    margin-top: 20px;
                    padding: 10px 20px;
                    background-color: #1abc9c;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                }
                button:hover {
                    background-color: #16a085;
                }
            </style>
        </head>
        <body>
            <h1>${tabName}</h1>
            <div id="content">
                <p>데이터를 불러오는 중...</p>
            </div>
            <button onclick="window.close()">닫기</button>
            <script>
                fetch("http://127.0.0.1:8000/${apiEndpoint}?inputitemName=${searchInput}")
                    .then(response => response.json())
                    .then(data => {
                        const contentDiv = document.getElementById("content");
                        if (data.success) {
                            contentDiv.innerHTML = Object.entries(data.data)
                                .map(([key, value]) => \`<p><strong>\${key}:</strong> \${value || "정보 없음"}</p>\`)
                                .join("");
                        } else {
                            contentDiv.innerHTML = \`<p>오류: \${data.message}</p>\`;
                        }
                    })
                    .catch(error => {
                        document.getElementById("content").innerHTML = \`<p>오류 발생: \${error.message}</p>\`;
                    });
            </script>
        </body>
        </html>
    `);
}
function openEfficiencyTab() {
    const searchInput = localStorage.getItem("searchInput");
    if (!searchInput) {
        alert("먼저 약물 이름을 입력해주세요.");
        return;
    }

    const efficiencyUrl = `http://127.0.0.1:8000/search_all?inputitemName=${encodeURIComponent(searchInput)}`;
    const bracketsUrl = `http://127.0.0.1:8000/extract_brackets?inputitemName=${encodeURIComponent(searchInput)}`;

    const newWindow = window.open("", "_blank");
    newWindow.document.write(`
        <!DOCTYPE HTML>
        <html>
        <head>
            <title>효능 및 성분 조회</title>
            <meta charset="utf-8" />
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #2c3e50;
                    color: white;
                    margin: 0;
                    padding: 20px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: flex-start;
                    height: 100vh;
                    text-align: center;
                }
                h1 {
                    margin-bottom: 20px;
                }
                #content {
                    margin: 20px 0;
                    background-color: #34495e;
                    padding: 20px;
                    border-radius: 10px;
                    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);
                    width: 80%;
                    max-width: 600px;
                    text-align: left;
                }
                img {
                    max-width: 100%;
                    height: auto;
                    margin-top: 10px;
                    border-radius: 10px;
                }
                button {
                    margin-top: 20px;
                    padding: 10px 20px;
                    background-color: #1abc9c;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    transition: background-color 0.3s;
                }
                button:hover {
                    background-color: #16a085;
                }
            </style>
        </head>
        <body>
            <h1>효능 및 성분 조회</h1>
            <div id="content">데이터를 불러오는 중...</div>
            <button onclick="window.close()">닫기</button>
            <script>
                async function fetchData() {
                    const contentDiv = document.getElementById("content");
                    let contentHTML = "";

                    try {
                        // 효능 및 사용법 API 호출
                        const efficiencyResponse = await fetch("${efficiencyUrl}");
                        const efficiencyData = await efficiencyResponse.json();

                        if (efficiencyData.success) {
                            const efficiency = efficiencyData.data.efficiency || "정보 없음";
                            const useMethod = efficiencyData.data.useMethod || "정보 없음";
                            const image = efficiencyData.data.Image || "";

                            contentHTML += "<h2>효능:</h2>";
                            contentHTML += \`<p>\${efficiency}</p>\`;

                            contentHTML += "<h2>사용법:</h2>";
                            contentHTML += \`<p>\${useMethod}</p>\`;

                            if (image) {
                                contentHTML += "<h2>약 이미지:</h2>";
                                contentHTML += \`<img src="\${image}" alt="약 이미지" />\`;
                            } else {
                                contentHTML += "<p> </p>";
                            }
                        } else {
                            contentHTML += "<p>오류: 데이터를 가져오는 데 실패했습니다.</p>";
                        }

                        contentDiv.innerHTML = contentHTML;
                    } catch (error) {
                        contentDiv.innerHTML = "<p>데이터를 가져오는 중 오류가 발생했습니다.</p>";
                        console.error("API 호출 중 오류:", error);
                    }
                }

                fetchData();
            </script>
        </body>
        </html>
    `);
}


function openAllergyFilterTab() {
    const searchInput = localStorage.getItem("searchInput");
    if (!searchInput) {
        alert("먼저 약물 이름을 입력해주세요.");
        return;
    }

    const allergen = prompt("알레르기 성분을 입력하세요:");
    if (!allergen) {
        alert("알레르기 성분을 입력해주세요.");
        return;
    }

    const url = `http://127.0.0.1:8000/filter_allergy?inputitemName=${encodeURIComponent(searchInput)}&allergen=${encodeURIComponent(allergen)}`;

    const newWindow = window.open("", "_blank");
    newWindow.document.write(`
        <!DOCTYPE HTML>
        <html>
        <head>
            <title>알레르기 필터링</title>
            <meta charset="utf-8" />
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #2c3e50;
                    color: white;
                    margin: 0;
                    padding: 20px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: flex-start;
                    height: 100vh;
                    text-align: center;
                }
                h1 {
                    margin-bottom: 20px;
                }
                #content {
                    margin: 20px 0;
                    background-color: #34495e;
                    padding: 20px;
                    border-radius: 10px;
                    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);
                    width: 80%;
                    max-width: 600px;
                    text-align: left;
                }
                .alert {
                    font-weight: bold;
                    font-size: 1.2em;
                    margin-top: 20px;
                    text-align: center;
                }
                .danger {
                    color: #e74c3c; /* 빨간색 */
                }
                .safe {
                    color: #2ecc71; /* 초록색 */
                }
                button {
                    margin-top: 20px;
                    padding: 10px 20px;
                    background-color: #1abc9c;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    transition: background-color 0.3s;
                }
                button:hover {
                    background-color: #16a085;
                }
            </style>
        </head>
        <body>
            <h1>알레르기 필터링</h1>
            <div id="content">데이터를 불러오는 중...</div>
            <button onclick="window.close()">닫기</button>
            <script>
                async function fetchData() {
                    const contentDiv = document.getElementById("content");
                    let contentHTML = "";

                    try {
                        const response = await fetch("${url}");
                        const data = await response.json();

                        console.log("DEBUG: API Response", data); // 디버깅용 로그

                        if (data.success) {
                            const containsAllergen = data.data.contains_allergen;

                            if (containsAllergen) {
                                contentHTML += \`
                                    <h2>결과:</h2>
                                    <p class="alert danger">"${allergen}"가 포함되어 있으니 주의하세요!</p>
                                \`;
                            } else {
                                contentHTML += \`
                                    <h2>결과:</h2>
                                    <p class="alert safe">안전합니다! "${allergen}"가 포함되지 않았습니다.</p>
                                \`;
                            }
                        } else {
                            contentHTML = \`<p>오류: \${data.message}</p>\`;
                        }

                        contentDiv.innerHTML = contentHTML;
                    } catch (error) {
                        contentDiv.innerHTML = "<p>데이터를 가져오는 중 오류가 발생했습니다.</p>";
                        console.error("API 호출 중 오류:", error);
                    }
                }

                fetchData();
            </script>
        </body>
        </html>
    `);
}


function openInteractionTab() {
    const searchInput = localStorage.getItem("searchInput");
    if (!searchInput) {
        alert("먼저 약물 이름을 입력해주세요.");
        return;
    }

    const url = `http://127.0.0.1:8000/search_Interaction?inputitemName=${encodeURIComponent(searchInput)}`;

    const newWindow = window.open("", "_blank");
    newWindow.document.write(`
        <!DOCTYPE HTML>
        <html>
        <head>
            <title>의약품 상호작용 조회</title>
            <meta charset="utf-8" />
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #2c3e50;
                    color: white;
                    margin: 0;
                    padding: 20px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: flex-start;
                    height: 100vh;
                    text-align: center;
                }
                h1 {
                    margin-bottom: 20px;
                }
                #content {
                    margin: 20px 0;
                    background-color: #34495e;
                    padding: 20px;
                    border-radius: 10px;
                    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);
                    width: 80%;
                    max-width: 600px;
                    text-align: left;
                }
                button {
                    margin-top: 20px;
                    padding: 10px 20px;
                    background-color: #1abc9c;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    transition: background-color 0.3s;
                }
                button:hover {
                    background-color: #16a085;
                }
            </style>
        </head>
        <body>
            <h1>의약품 상호작용 조회</h1>
            <div id="content">데이터를 불러오는 중...</div>
            <button onclick="window.close()">닫기</button>
            <script>
                async function fetchData() {
                    const contentDiv = document.getElementById("content");
                    let contentHTML = "";

                    try {
                        const response = await fetch("${url}");
                        const data = await response.json();

                        if (data.success) {
                            const interaction = data.data.Interaction || "정보 없음";

                            contentHTML += "<h2>상호작용 정보:</h2>";
                            contentHTML += \`<p>\${interaction}</p>\`;
                        } else {
                            contentHTML = \`<p>오류: \${data.message}</p>\`;
                        }

                        contentDiv.innerHTML = contentHTML;
                    } catch (error) {
                        contentDiv.innerHTML = "<p>데이터를 가져오는 중 오류가 발생했습니다.</p>";
                        console.error("API 호출 중 오류:", error);
                    }
                }

                fetchData();
            </script>
        </body>
        </html>
    `);
}

function openSideEffectTab() {
    const searchInput = localStorage.getItem("searchInput");
    if (!searchInput) {
        alert("먼저 약물 이름을 입력해주세요.");
        return;
    }

    const url = `http://127.0.0.1:8000/search_all?inputitemName=${encodeURIComponent(searchInput)}`;

    const newWindow = window.open("", "_blank");
    newWindow.document.write(`
        <!DOCTYPE HTML>
        <html>
        <head>
            <title>부작용 및 경고 조회</title>
            <meta charset="utf-8" />
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #2c3e50;
                    color: white;
                    margin: 0;
                    padding: 20px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: flex-start;
                    height: 100vh;
                    text-align: center;
                }
                h1 {
                    margin-bottom: 20px;
                }
                #content {
                    margin: 20px 0;
                    background-color: #34495e;
                    padding: 20px;
                    border-radius: 10px;
                    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);
                    width: 80%;
                    max-width: 600px;
                    text-align: left;
                }
                button {
                    margin-top: 20px;
                    padding: 10px 20px;
                    background-color: #1abc9c;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    transition: background-color 0.3s;
                }
                button:hover {
                    background-color: #16a085;
                }
            </style>
        </head>
        <body>
            <h1>부작용 및 경고 조회</h1>
            <div id="content">데이터를 불러오는 중...</div>
            <button onclick="window.close()">닫기</button>
            <script>
                async function fetchData() {
                    const contentDiv = document.getElementById("content");
                    let contentHTML = "";

                    try {
                        const response = await fetch("${url}");
                        const data = await response.json();

                        if (data.success) {
                            const sideEffect = data.data.sideEffect || "정보 없음";
                            const warning = data.data.Warning || "정보 없음";

                            contentHTML += "<h2>부작용 정보:</h2>";
                            contentHTML += \`<p>\${sideEffect}</p>\`;

                            contentHTML += "<h2>경고 정보:</h2>";
                            contentHTML += \`<p>\${warning}</p>\`;
                        } else {
                            contentHTML = \`<p>오류: \${data.message}</p>\`;
                        }

                        contentDiv.innerHTML = contentHTML;
                    } catch (error) {
                        contentDiv.innerHTML = "<p>데이터를 가져오는 중 오류가 발생했습니다.</p>";
                        console.error("API 호출 중 오류:", error);
                    }
                }

                fetchData();
            </script>
        </body>
        </html>
    `);
}


// 데이터 화면 -> 홈 화면 전환
function backToSearch() {
    const tabsScreen = document.getElementById("tabs-screen");
    tabsScreen.style.animation = "fadeOut 0.5s forwards";

    setTimeout(() => {
        tabsScreen.style.display = "none";
        const homeScreen = document.getElementById("home-screen");
        homeScreen.style.display = "block";
        homeScreen.style.animation = "fadeInUp 0.5s forwards";
    }, 500);
}

// 초기화
window.addEventListener("load", function () {
    const searchButton = document.getElementById("search-button");
    if (searchButton) {
        searchButton.addEventListener("click", showTabs);
    }

    autocompleteSearch(); // 자동완성 기능 활성화
});
