let login = document.querySelector("#login-form")
let warning = document.querySelector("#warning")

login.addEventListener('submit', e => {
    e.preventDefault()
    let email = document.querySelector("#email").value
    let password = document.querySelector("#psw").value

    data = { "email": email,
            "password": password
        }
    loginUser(data)
    
})

loginUser = (data) => {
    fetch('http://127.0.0.1:5000/stackoverflowlite/api/v1/auth/login', {
        method: 'POST',
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
        if (res.status == 200) {
            res.json().then(data => {
                localStorage.setItem("token", data.access_token)
                localStorage.setItem("username", data.success)
                window.location.href = "dashboard.html"
            })
            
        }
    })
    .catch((err) => {
        if (err.status == 401) {
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