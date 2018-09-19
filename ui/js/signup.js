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
    signUpUser(data)
})

signUpUser = (data) => {
    fetch('http://127.0.0.1:5000/stackoverflowlite/api/v1/auth/signup', {
        method: 'POST',
        mode: "cors",
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-type': 'application/json'
        },
        body:JSON.stringify(data)
    })
    .then((response) => {
        return handleResponse(response)
    })
    .then((res) => {
        if (res.status == 201) {
            res.json().then(data => {
                success.classList.remove('hide')
                warning.classList.add('hide')
                success.classList.add('show')

                redirectMessage = `Redirecting you to the login page in 5 seconds`
                success.innerHTML = `Success! ${data.message} ${redirectMessage}`

                // Redirect to login page after 5 seconds
                setTimeout(() => window.location.href = "index.html", 5000);
            })
            
        }
    })
    .catch((err) => {
        if (err.status == 400) {
            err.json().then(data => {
                warning.classList.remove('hide')
                warning.classList.add('show')
                warning.innerHTML = `Warning! ${data.error}`
            })

        }
    })   
}

handleResponse = (response) => {
    if (!response.ok) {
        throw response;
    }
    else {
    return response;
    }
}