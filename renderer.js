let selectedMemoId = null; // 현재 선택된 메모의 ID를 저장

// 초기화
window.onload = function () {
  // TinyMCE 에디터 초기화
  tinymce.init({
    selector: "#memo-content",
    plugins: "link image lists code table textcolor hr fullscreen",
    toolbar:
      "undo redo | fontsizeselect fontselect | bold italic underline strikethrough | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist | styleselect | link image table | hr code fullscreen",
    menubar: true,
    branding: false,

    fontsize_formats: "8pt 10pt 12pt 14pt 18pt 24pt 36pt", // 폰트 크기 설정
  });

  FilePond.setOptions({
    credits: false, // Powered by PQINA 숨기기
  });

  // FilePond 초기화
  const pond = FilePond.create(document.querySelector(".filepond"));
  pond.on("addfile", (error, file) => {
    if (!error) {
      const reader = new FileReader();
      reader.onload = () => {
        tinymce.get("memo-content").setContent(reader.result);
      };
      reader.readAsText(file.file);
    }
  });

  loadMemos(); // 메모 로드
};

// 새 메모 생성
function createNewMemo() {
  // 제목과 TinyMCE 에디터 초기화
  document.getElementById("memo-title").value = "";
  tinymce.get("memo-content").setContent("");

  // FilePond 초기화
  const pond = FilePond.find(document.querySelector(".filepond"));
  if (pond) {
    pond.removeFiles(); // 파일 초기화
  }

  selectedMemoId = null; // 선택된 메모 ID 초기화
}

// 메모 저장
function saveMemo() {
  const title = document.getElementById("memo-title").value.trim();
  const content = tinymce.get("memo-content").getContent().trim();

  if (!title || !content) {
    showError("Title and content cannot be empty!");
    return;
  }

  let memos = JSON.parse(localStorage.getItem("memos")) || [];

  if (selectedMemoId) {
    // 기존 메모 업데이트
    const memoIndex = memos.findIndex((memo) => memo.id === selectedMemoId);
    if (memoIndex !== -1) {
      memos[memoIndex].title = title;
      memos[memoIndex].content = content;
      memos[memoIndex].date = new Date().toLocaleString();
      // 업데이트된 메모를 맨 앞으로 이동
      const updatedMemo = memos.splice(memoIndex, 1)[0];
      memos.unshift(updatedMemo);
    }
  } else {
    // 새 메모 저장
    const memo = {
      id: Date.now(),
      title,
      content,
      date: new Date().toLocaleString(),
    };
    memos.unshift(memo); // 새로운 메모를 리스트 맨 앞에 추가
    selectedMemoId = memo.id; // 새로 저장한 메모를 선택 상태로 유지
  }

  localStorage.setItem("memos", JSON.stringify(memos));
  loadMemos(); // 메모 리스트 갱신
}

// 메모 삭제
function deleteMemo(index) {
  let memos = JSON.parse(localStorage.getItem("memos")) || [];
  memos.splice(index, 1);
  localStorage.setItem("memos", JSON.stringify(memos));
  loadMemos();
  createNewMemo(); // 삭제 후 에디터 초기화
}

// 메모 로드 및 필터링
function loadMemos(filter = "") {
  const memos = JSON.parse(localStorage.getItem("memos")) || [];
  const memoList = document.getElementById("memos");
  memoList.innerHTML = "";

  const filteredMemos = memos.filter(
    (memo) =>
      memo.title.toLowerCase().includes(filter.toLowerCase()) ||
      memo.content.toLowerCase().includes(filter.toLowerCase())
  );

  filteredMemos.forEach((memo, index) => {
    const li = document.createElement("li");
    li.classList.add("memo-item");
    li.innerHTML = `
            <div class="memo-content">
                <strong>${memo.title}</strong><br>
                <small>${memo.date}</small>
            </div>
            <button class="delete-button" onclick="deleteMemo(${index})">Delete</button>
        `;
    li.querySelector(".memo-content").onclick = () => openMemo(memo.id);
    memoList.appendChild(li);
  });
}

// 메모 열기
function openMemo(id) {
  const memos = JSON.parse(localStorage.getItem("memos")) || [];
  const memo = memos.find((memo) => memo.id === id);

  if (memo) {
    document.getElementById("memo-title").value = memo.title;
    tinymce.get("memo-content").setContent(memo.content);
    selectedMemoId = id; // 선택된 메모 ID 저장
  }
}

// 메모 검색
function searchMemos(value) {
  loadMemos(value);
}

// OpenAI 요약 기능
function summarizeMemo() {
  const content = tinymce
    .get("memo-content")
    .getContent({ format: "text" })
    .trim();

  if (!content) {
    document.getElementById("summarize-text").innerText =
      "Please enter text to summarize!";
    return;
  }

  document.getElementById("summarize-text").innerText = "Summarizing...";

  window.electron
    .summarizeText(content)
    .then((summary) => {
      document.getElementById("summarize-text").innerText = summary;
    })
    .catch((error) => {
      console.error("Error summarizing text:", error);
      document.getElementById("summarize-text").innerText =
        "Error summarizing text.";
    });
}

// 맞춤법 검사
function checkSpelling() {
  const content = tinymce
    .get("memo-content")
    .getContent({ format: "text" })
    .trim();

  if (!content) {
    document.getElementById("spellcheck-text").innerText =
      "Please enter text to check!";
    return;
  }

  document.getElementById("spellcheck-text").innerText = "Checking spelling...";

  window.electron.ipcRenderer
    .invoke("spell-check", content)
    .then((result) => {
      document.getElementById("spellcheck-text").innerText = result;
    })
    .catch((error) => {
      console.error("Error checking spelling:", error);
      document.getElementById("spellcheck-text").innerText =
        "Error checking spelling.";
    });
}

// Q&A 기능
function askQuestion() {
  const question = document.getElementById("question").value.trim();

  if (!question) {
    alert("Please enter a question!");
    return;
  }

  document.getElementById("qa-result").innerText = "Fetching answer...";

  window.electron.ipcRenderer
    .invoke("qa", question)
    .then((answer) => {
      document.getElementById("qa-result").innerText = answer;
    })
    .catch((error) => {
      console.error("Error fetching Q&A:", error);
      document.getElementById("qa-result").innerText = "Error fetching Q&A.";
    });
}

// 번역 기능
function translateMemo() {
  const content = tinymce.get("memo-content").getContent({ format: "text" });
  const language = document.getElementById("language").value;

  if (!content.trim()) {
    alert("Please enter text to translate!");
    return;
  }

  document.getElementById("translate-result").innerText = "Translating...";

  window.electron.ipcRenderer
    .invoke("translate", { content, targetLanguage: language })
    .then((translation) => {
      document.getElementById("translate-result").innerText = translation;
    })
    .catch((error) => {
      console.error("Error translating text:", error);
      document.getElementById("translate-result").innerText =
        "Error translating text.";
    });
}

// 분석 기능
function analyzeMemo() {
  const content = tinymce
    .get("memo-content")
    .getContent({ format: "text" })
    .trim();

  if (!content) {
    document.getElementById("analyze-text").innerText =
      "Please enter text to analyze!";
    return;
  }

  document.getElementById("analyze-text").innerText = "Analyzing...";

  window.electron.ipcRenderer
    .invoke("analyze", content)
    .then((analysis) => {
      document.getElementById("analyze-text").innerText = analysis;
    })
    .catch((error) => {
      console.error("Error analyzing text:", error);
      document.getElementById("analyze-text").innerText =
        "Error analyzing text.";
    });
}

function showError(message) {
  const errorDiv = document.getElementById("error-message");
  errorDiv.textContent = message; // 에러 메시지 설정
  errorDiv.style.display = "block"; // 메시지 표시

  // 3초 후 알림 메시지 숨기기
  setTimeout(() => {
    errorDiv.style.display = "none"; // 메시지 숨기기
  }, 3000);
}
