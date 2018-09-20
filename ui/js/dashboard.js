let ask = document.querySelector("#ask-form")
let warning = document.querySelector("#warning")
let questionStatus = document.querySelector("#questions-status")
let questionsTable = document.querySelector("#questions-table")
let username = document.querySelector("#username-field")
let token = localStorage.getItem("token")
let loggedInAs = localStorage.getItem("username")

// Set username on this page
username.innerHTML = loggedInAs

ask.addEventListener('submit', e => {
    e.preventDefault()
    let title = document.querySelector("#question-title").value
    let description = document.querySelector("#question-body").value

    data = {
            "title": title,
            "description": description
        }
    postQuestion(data)   

})

document.addEventListener("DOMContentLoaded", () => {
    getAllQuestions()
  });

postQuestion = (data) => {
    fetch('http://127.0.0.1:5000/stackoverflowlite/api/v1/questions/', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer '+token,
            'Accept': 'application/json, text/plain, */*',
            'Content-type': 'application/json'
        },
        body:JSON.stringify(data)
    })
    .then((res) => {
        return handleResponse(res)
    })
    .then((res) => {
        if (res.status == 201) {
            res.json().then(data => {
                warning.classList.remove('show')
                warning.classList.add('hide')
                success.classList.remove('hide')
                success.classList.add('show')

                success.innerHTML = `Success! ${data.message}`
                setTimeout(function () { location.reload(true); }, 2000);

            })
            
        }
    })
    .catch((err) => {
        if (err.status == 400) {
            err.json().then(data => {
                success.classList.remove('show')
                success.classList.add('hide')
                warning.classList.remove('hide')
                warning.classList.add('show')
                warning.innerHTML = `Warning! ${data.error}`
            })

        }
        else if (err.status == 401) {
            success.classList.remove('show')
            success.classList.add('hide')
            warning.classList.remove('hide')
            warning.classList.add('show')
            warning.innerHTML = `Please login first to post a question`

        }
    }) 
}

getAllQuestions = () => {
    fetch('http://127.0.0.1:5000/stackoverflowlite/api/v1/questions/', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json, text/plain, */*',
            'Content-type': 'application/json'
        }   
    })
    .then((response) => {
        return handleResponse(response)
    })
    .then((res) => {
        if (res.status == 200) {
            res.json().then(data => {
                output = ''
                data.questions.forEach(element => {
                    output += `
                    <tr>
                        <td>
                            <h4><a href="question.html" id="question-title"><b>${element.title}</b></a></h4>
                                <p>
                            Posted: <span id="post-time">${element.date_created}</span> | By <a href="profile.html" id="post-by">${element.username[0]}</a> | <a href="question.html" id="answers-count">${element.Answers.length}</a> answers
                        </p>
                        </td>
                        <td><img src="img/upvote.png" alt="upvotes image">3</td>
                    <td><img src="img/downvote.png" alt="upvotes image">0</span></td>
                    </tr>
                    
                    `
                });
                questionsTable.innerHTML = output

            })
            
        }
    })
    .catch((err) => {
        if (err.status == 404) {
            err.json().then(data => {
                console.log("No questions")
                questionStatus.classList.remove('hide')
                questionStatus.classList.add('show')
                addMessage = `Be the first one to ask`
                questionStatus.innerHTML = `${data.message}. ${addMessage}.`
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


