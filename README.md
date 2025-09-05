Smart Note Desktop (Electron)

AI 기반 스마트 노트 로컬 데스크톱 애플리케이션입니다.
자동 요약, 번역, 맞춤법 검사, Q&A 등 문서 편집을 보조하는 기능을 구현했습니다.
Electron 기반으로 개발하여 서버 없이 로컬 환경에서 실행 가능하며, 추후 Spring Boot 백엔드와 연동할 수 있도록 구조를 설계했습니다.

⸻

주요 기능
	•	문서 편집: 메모 작성, 수정, 삭제, 파일 업로드(.txt, .md, .html)를 지원했습니다.
	•	AI 보조 기능 (OpenAI API 연동): 텍스트 요약, 맞춤법 검사, 다국어 번역, Q&A 기능을 구현했습니다.
	•	데이터 관리: 로컬스토리지를 기반으로 사용자 데이터를 저장하고 관리했습니다.
	•	배포: Electron Builder를 사용하여 Windows 실행 파일로 패키징하고 배포까지 진행했습니다.

⸻

사용 기술
	•	Framework: Electron
	•	Front-End: JavaScript, HTML, CSS, Bootstrap
	•	Back-End (로컬 처리): Node.js, LocalStorage
	•	AI 연동: OpenAI API
	•	빌드/배포: Electron Builder

향후 확장
	•	Spring Boot 서버와 연동하여 사용자별 데이터 동기화를 지원할 예정입니다.
	•	IndexedDB 기반 로컬 데이터 저장소로의 전환을 검토했습니다.
	•	오프라인 모드와 PWA 지원도 적용 가능성을 검토했습니다.
