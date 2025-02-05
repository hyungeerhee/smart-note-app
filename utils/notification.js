// 알림 설정 기능
function showNotification(title, body) {
    const notification = new Notification(title, {
        body: body,
        icon: 'assets/icon.png'
    });

    notification.onclick = () => {
        console.log('Notification clicked');
    };
}

// 리마인더 설정
function setReminder(dateTime, title, body) {
    const reminderTime = new Date(dateTime).getTime();
    const currentTime = new Date().getTime();

    const timeDifference = reminderTime - currentTime;

    if (timeDifference > 0) {
        setTimeout(() => {
            showNotification(title, body);
        }, timeDifference);
    } else {
        console.log('Reminder time is in the past. Please set a future time.');
    }
}

module.exports = { showNotification, setReminder };
