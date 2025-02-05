// 태그로 메모 검색
function searchMemosByTag(tag) {
    const memos = JSON.parse(localStorage.getItem('memos')) || [];
    return memos.filter(memo => memo.tags.includes(tag));
}

// 모든 태그 가져오기 (중복 제거)
function getAllTags() {
    const memos = JSON.parse(localStorage.getItem('memos')) || [];
    const tags = new Set();
    memos.forEach(memo => {
        memo.tags.forEach(tag => {
            tags.add(tag);
        });
    });
    return Array.from(tags);
}

// 특정 태그로 메모 필터링하여 표시
function filterMemosByTag(tag) {
    const filteredMemos = searchMemosByTag(tag);
    displayMemos(filteredMemos);
}

// 검색된 메모 표시 (렌더러 함수)
function displayMemos(memos) {
    const memoList = document.getElementById('memos');
    memoList.innerHTML = '';

    memos.forEach((memo, index) => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${memo.title}</strong><br><small>${memo.date}</small>`;
        li.onclick = () => openMemo(index);
        memoList.appendChild(li);
    });
}

module.exports = { searchMemosByTag, getAllTags, filterMemosByTag };
