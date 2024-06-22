document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    if (password !== 'Login System') {
        showMessage('Incorrect password. Please try again.');
        return;
    }

    if (username !== 'Toran') {
        showMessage('Only Toran is allowed to login.');
        return;
    }

    window.location.href = `welcome.html?username=${username}`;
});

function showMessage(message) {
    const messageDiv = document.getElementById('message');
    messageDiv.innerText = message;
}

