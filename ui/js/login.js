const login = document.querySelector('#login-form');
const warning = document.querySelector('#warning');

// Add even listener for form submission
login.addEventListener('submit', e => {
    e.preventDefault();
    const usEmail = document.querySelector('#email').value;
    const usPassword = document.querySelector('#psw').value;

    const userData = { 
            email: usEmail,
            password: usPassword
        };
    loginUser(userData);   
});

// Function to log user in
const loginUser = (details) => {
    fetch('http://127.0.0.1:5000/stackoverflowlite/api/v1/auth/login', {
        method: 'POST',
        headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-type': 'application/json'
        },
        body: JSON.stringify(details)
    })
    .then((response) => handleResponse(response))
    .then((res) => {
        if (res.status === 200) {
            res.json().then(data => {
                localStorage.setItem('token', data.access_token);
                localStorage.setItem('username', data.success);
                localStorage.setItem('user_id', data.user_id);
                window.location.href = 'dashboard.html';
            });       
        }
    })
    .catch((err) => {
        if (err.status === 401) {
            err.json().then(data => {
                warning.classList.remove('hide');
                warning.classList.add('show');
                warning.innerHTML = `Signin failed! ${data.error}`;
            });
        }
    });   
};
