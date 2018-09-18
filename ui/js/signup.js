let signup = document.querySelector("#signup-form")
let success = document.querySelector("#success")
let warning = document.querySelector("#warning")

signup.addEventListener('submit', e => {
    e.preventDefault()
    let username = document.querySelector("#username").value
    let email = document.querySelector("#email").value
    let password = document.querySelector("#psw").value
    let confirmPassword = document.querySelector("#cpsw").value

    data = {
            "username": username,
            "email": email,
            "password": password,
            "confirm-password": confirmPassword
        }
    fetch('http://127.0.0.1:5000/stackoverflowlite/api/v1/auth/signup', {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-type': 'application/json'
        },
        body:JSON.stringify(data)
    })
    .then((res) => res.json())
    .then((data) => {
        if (data.message == "user registered successfully"){
            success.classList.remove('hide')
            warning.classList.add('hide')
            success.classList.add('show')

            redirectMessage = 'Redirecting you to the login page in 5 seconds'
            success.innerHTML = 'Success! '+data.message+'. '+redirectMessage

            // Redirect to login page after 5 seconds
            setTimeout(function () {
                window.location.href = "login.html";
             }, 5000);
        }
        else if (data.error) {
            warning.classList.remove('hide')
            warning.classList.add('show')
            warning.innerHTML = 'Warning! '+data.error
        }

    })   

})