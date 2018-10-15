const signup = document.querySelector('#signup-form');
const success = document.querySelector('#success');
const warning = document.querySelector('#warning');
const uri = 'https://stackoverflowlite-api.herokuapp.com/stackoverflowlite/api/v1/auth/signup';

// Event listener for user signup
signup.addEventListener('submit', e => {
    e.preventDefault();
    const usName = document.querySelector('#username').value;
    const usEmail = document.querySelector('#email').value;
    const usPassword = document.querySelector('#psw').value;
    const usConfPassword = document.querySelector('#cpsw').value;

    const userData = {
            username: usName,
            email: usEmail,
            password: usPassword,
            confirm: usConfPassword
        };
    signUpUser(userData);
});

const signUpUser = (details) => {
    fetch(uri, {
        method: 'POST',
        headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-type': 'application/json'
        },
        body: JSON.stringify(details)
    })
    .then((response) => handleResponse(response))
    .then((res) => {
        if (res.status === 201) {
            res.json().then(data => {
                success.classList.remove('hide');
                warning.classList.add('hide');
                success.classList.add('show');

                const redirectMessage = 'Redirecting you to the login page in ';

                const output = `<p> ${redirectMessage} 
                <span id="countdowntimer">3 </span> Seconds</p>`;
                countDown();

                success.innerHTML = `${data.message} ${output}`;

                // Redirect to login page after 3 seconds
                const redirect = () => { window.location.href = 'index.html'; };
                setTimeout(redirect, 3000);
            });   
        }
    })
    .catch((err) => {
        if (err.status === 400) {
            err.json().then(data => {
                warning.classList.remove('hide');
                warning.classList.add('show');
                warning.innerHTML = data.error;
            });
        }
    });  
};

// Function for countdown
const countDown = () => {
    let timeleft = 3;
    const downloadTimer = setInterval(timerFunc = () => {
    timeleft--;
    document.getElementById('countdowntimer').textContent = timeleft;
    if (timeleft <= 0) {
        clearInterval(downloadTimer);
    }  
    }, 1000);
};
