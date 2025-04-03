# 🧠 SMART AI NOTE

![image](https://github.com/user-attachments/assets/2c56cbe3-144e-410e-becc-3ced0886f7e1)

AI 기능과 클라우드 동기화를 결합한 스마트 데스크탑 메모 애플리케이션입니다.  
Electron 기반으로 개발되었으며, OpenAI API와 Firebase를 통해 메모의 생성부터 분석, 저장까지 모든 과정을 지원합니다.

---

## 🎯 프로젝트 개요

- **프로젝트명**: SMART AI NOTE
- **목적**: 효율적인 메모 관리 및 AI 기반 생산성 향상을 위한 데스크탑 앱 개발
- **타겟 사용자**: 직장인, 학생, 연구자 등 지식 기반 작업을 하는 사용자

---

## 🛠 기술 스택

| 분야             | 사용 기술                         |
|------------------|------------------------------------|
| 프레임워크        | Electron, Node.js                  |
| 클라이언트        | HTML, CSS, Bootstrap, JavaScript   |
| 인증 & 데이터     | Firebase (Authentication, Realtime DB) |
| AI 기능           | OpenAI API                         |

---

## ⚙️ 개발 과정

1. 요구 사항 정의 및 기획
2. UI/UX 설계 및 프로토타입 구현
3. 핵심 기능 구현
    - Firebase Authentication을 이용한 로그인/회원가입
    - 메모 작성, 수정, 삭제 및 동기화
    - AI 기반 기능: 요약, 맞춤법 검사, 번역, Q&A, 분석
4. 문제 해결 및 성능 최적화
5. Windows `.exe`, macOS `.app` 파일로 빌드 및 배포

---

## ✨ 주요 기능

### 🔐 로그인 및 회원가입
- Firebase Authentication 기반 이메일 로그인
- 사용자 데이터 개별 분리 저장

### 📝 메모 작성 및 관리
- 메모 생성, 편집, 삭제 기능
- 실시간 저장 및 불러오기

### 🤖 AI 기능 (OpenAI API 기반)
- 자동 요약: 긴 텍스트를 간단하게 요약
- 맞춤법 검사: 문법 오류 탐지 및 수정
- 번역 기능: 다국어 번역 지원
- Q&A: 자유 질문에 대한 AI 응답 제공
- 분석: 노트의 키워드 및 요약 정보 제공

### ☁️ 클라우드 연동 (Firebase)
- 실시간 동기화: 여러 기기에서 동일한 데이터 사용
- 클라우드 백업으로 데이터 손실 방지

---

## 🧪 문제 해결 사례

| 문제 | 해결 방안 |
|------|-----------|
| Firebase 실시간 동기화 지연 | 데이터 구조 재설계 및 비동기 처리 적용 |
| AI 기능 정확도 낮음 | OpenAI 파라미터 튜닝 및 사용자 피드백 기반 개선 |
| UX 직관성 부족 | 검색 기능 개선 및 카테고리 UI 개선 적용 |

---

## 🚀 실행 방법

```bash
# 프로젝트 클론
git clone https://github.com/your-username/smart-note-app.git

# 패키지 설치
npm install

# 앱 실행
npm start
```

---

## 📦 배포

- Windows: `.exe` 실행 파일
- macOS: `.app` 실행 파일
- 빌드 도구: [Electron Builder](https://www.electron.build/)

