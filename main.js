const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const { OpenAI } = require("openai");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

// OpenAI 설정
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // .env 파일에서 API 키 가져오기
});

// 비밀번호 파일 경로
const PASSWORD_FILE = path.join(app.getPath("userData"), "password.json");

function hashPassword(password, salt = null) {
  if (!salt) {
    salt = crypto.randomBytes(16).toString("hex");
  }
  const hash = crypto
    .pbkdf2Sync(password, salt, 100000, 64, "sha512")
    .toString("hex");
  return { salt, hash };
}

function createWindow(page = "index.html") {
  const win = new BrowserWindow({
    width: 1920,
    height: 1080,

    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      enableRemoteModule: false,
    },
  });

  win.loadFile(page);
  return win;
}

// 비밀번호 설정 확인
function isPasswordSet() {
  return fs.existsSync(PASSWORD_FILE);
}

// 비밀번호 검증 함수
function verifyPassword(providedPassword) {
  if (!isPasswordSet()) return false;
  const storedData = JSON.parse(fs.readFileSync(PASSWORD_FILE));
  const { salt, hash } = hashPassword(providedPassword, storedData.salt);
  return hash === storedData.hash;
}

// OpenAI 요약 기능 IPC 처리
ipcMain.handle("summarize-text", async (event, content) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "당신은 텍스트를 요약하는 한국어 조수입니다.",
        },
        {
          role: "user",
          content: `다음 내용을 한국어로 요약해 주세요(100자 이내로): ${content}`,
        },
      ],
      max_tokens: 1000,
    });
    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error summarizing text:", error.message);
    return `Error: ${error.message}`;
  }
});

// OpenAI 맞춤법 검사 IPC 처리
ipcMain.handle("spell-check", async (event, content) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "당신은 텍스트의 띄어쓰기 맞춤법을 검사하고 수정하는 한국어 조수입니다.",
        },
        {
          role: "user",
          content: `다음 텍스트의 맞춤법을 확인하고 수정해 주세요: ${content}`,
        },
      ],
      max_tokens: 1000,
    });
    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error checking spelling:", error.message);
    return `Error: ${error.message}`;
  }
}); 

// OpenAI 질문 답변(Q&A) IPC 처리
ipcMain.handle("qa", async (event, question) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "당신은 모든 질문에 대해 답변하는 한국어 조수입니다.",
        },
        { role: "user", content: `다음 질문에 답변해 주세요: ${question}` },
      ],
      max_tokens: 1000,
    });
    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error in Q&A:", error.message);
    return `Error: ${error.message}`;
  }
});

// OpenAI 번역(translate) IPC 처리
ipcMain.handle("translate", async (event, { content, targetLanguage }) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `당신은 텍스트를 ${targetLanguage}로 번역하는 한국어 조수입니다.`,
        },
        {
          role: "user",
          content: `다음 텍스트를 ${targetLanguage}로 번역해 주세요: ${content}`, 
        },
      ],
      max_tokens: 1000,
    });
    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error translating text:", error.message);
    return `Error: ${error.message}`;
  }
});

// OpenAI 분석(analyze) IPC 처리
ipcMain.handle("analyze", async (event, content) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "당신은 텍스트를 분석하는 한국어 조수입니다.",
        },
        { role: "user", content: `다음 텍스트를 분석해 주세요: ${content}` },
      ],
      max_tokens: 1000,
    });
    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error analyzing text:", error.message);
    return `Error: ${error.message}`;
  }
});

app.on("ready", () => {
  createWindow("set_password.html");
});

ipcMain.handle("set-password", async (event, password) => {
  const { salt, hash } = hashPassword(password);
  fs.writeFileSync(PASSWORD_FILE, JSON.stringify({ salt, hash }));

  // 현재 창 닫기
  const windows = BrowserWindow.getAllWindows();
  windows.forEach((win) => win.close());

  // 로그인 화면 로드
  createWindow("login.html");
});

ipcMain.handle("login", async (event, password) => {
  if (verifyPassword(password)) {
    // 현재 창 닫기
    const windows = BrowserWindow.getAllWindows();
    windows.forEach((win) => win.close());

    // 메인 화면 로드
    createWindow("index.html");
  } else {
    event.sender.send("login-failure");
  }
});
