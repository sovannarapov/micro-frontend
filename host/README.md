# codekbpbuix

##### 1. NVM 설치

- [ ] nvm 다운로드 https://github.com/coreybutler/nvm-windows/releases/download/1.1.11/nvm-setup.zip
- [ ] 다운로드된 파일 설치
- [ ] 설치 완료 후 command 창에서 순서대로 실행
- nvm install 16.17.1
- nvm use 16.17.1

##### 2. PNPM 설치

- [ ] Command 창에서 실행
- npm i -g pnpm
- pnpm이 아닌 npm이나 yarn도 사용 가능하나 npm을 사용할 경우 "npm i --force" 로 모듈 설치

##### 3. VSCode 환경설정

- [ ] Auto save 설정
- File > Preferences > Settings
- 열린 Settings탭 화면 상단 "Search Settings"란에 "settings" 입력
- 설정 내용 복사 https://docs.google.com/document/d/1r2PnopKlMjZ2l4sZRWh7B2IaiUkdeMXyqjimCaC7zlo/edit?usp=sharing
- 화면 중간 "Edit in settings.json" 클릭
- settings.json 에 복사한 내용 붙여넣기 후 저장

- [ ] Extensions 설정
- Extensions 다운로드 https://drive.google.com/file/d/1Y9u5DgY-T1DaTOl8cA4bpk6TwSK7jJ9j/view?usp=sharing
- 좌측 끝 아이콘들 중 "Extensions" 선택
- 상단에 "동그라미 세개" 버튼 클릭하여 "Install from VSIX..." 선택
- 다운로드된 Extensions 선택하여 설치

##### 4. Chrome Vue Devtool 설치

- https://chrome.google.com/webstore/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd?hl=en

##### 5. Project 구동

- [ ] VSCode GUI에서 순서대로 실행
- File > Open Folder > Git Clone한 폴더 선택
- View > Terminal
- Terminal 탭 우측 끝에서 "Command Prompt" 선택
- [ ] Command Prompt에서 순서대로 실행
- pnpm i
- pnpm serve
