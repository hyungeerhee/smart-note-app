const { contextBridge, ipcRenderer } = require("electron");

// contextBridge를 사용하여 메인 프로세스와의 안전한 통신 제공
contextBridge.exposeInMainWorld("electron", {
  // OpenAI 텍스트 요약 기능
  summarizeText: (content) => ipcRenderer.invoke("summarize-text", content),

  // 파일 열기 대화상자 호출
  openFile: () => ipcRenderer.invoke("dialog:openFile"),

  // 파일 읽기 기능
  readFile: (filePath, encoding = "utf-8") =>
    ipcRenderer.invoke("file:readFile", filePath, encoding),

  // ipcRenderer를 통한 메인 프로세스와의 기타 통신 기능
  ipcRenderer: {
    // Promise 기반 비동기 요청
    invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args),

    // 단순 메시지 전송
    send: (channel, data) => ipcRenderer.send(channel, data),

    // 특정 이벤트에 대한 수신 및 처리
    on: (channel, func) =>
      ipcRenderer.on(channel, (event, ...args) => func(...args)),

    // 이벤트 제거 (옵션)
    removeListener: (channel, func) =>
      ipcRenderer.removeListener(channel, func),
  },
});
