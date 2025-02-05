const { dialog } = require('electron').remote;
const fs = require('fs');
const path = require('path');

// 파일 첨부 기능: 파일 선택하고 메모에 첨부
function openFile() {
    const files = dialog.showOpenDialogSync({
        properties: ['openFile'],
        filters: [
            { name: 'Documents', extensions: ['txt', 'pdf', 'docx'] },
            { name: 'Images', extensions: ['jpg', 'png', 'gif'] },
            { name: 'All Files', extensions: ['*'] }
        ]
    });

    if (files && files.length > 0) {
        const filePath = files[0];
        const fileName = path.basename(filePath);
        attachFileToMemo(fileName, filePath);
    }
}

// 메모에 파일 첨부
function attachFileToMemo(fileName, filePath) {
    const attachment = { name: fileName, path: filePath };
    const memoTitle = document.getElementById('memo-title').value;

    let memos = JSON.parse(localStorage.getItem('memos')) || [];
    const memoIndex = memos.findIndex(memo => memo.title === memoTitle);

    if (memoIndex !== -1) {
        if (!memos[memoIndex].attachments) {
            memos[memoIndex].attachments = [];
        }
        memos[memoIndex].attachments.push(attachment);
        localStorage.setItem('memos', JSON.stringify(memos));
    }
}

module.exports = { openFile };
