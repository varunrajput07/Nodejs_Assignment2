document.getElementById('loginBtn').addEventListener('click', () => {
    fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: 'admin',
                password: 'password'
            }),
        })
        .then(res => res.json())
        .then(data => {
            localStorage.setItem('token', data.token);
            alert('Logged in!');
        });
});

document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('token');
    alert('Logged out!');
});

document.getElementById('fetchStudents').addEventListener('click', () => {
    const token = localStorage.getItem('token');
    fetch('/api/students', {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        })
        .then(res => res.json())
        .then(data => {
            const studentsList = document.getElementById('studentsList');
            studentsList.innerHTML = '';
            data.forEach(student => {
                studentsList.innerHTML += `<li>${student.name} - ${student.age}</li>`;
            });
        });
});