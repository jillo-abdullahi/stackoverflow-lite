const questionTitle = document.querySelector('#question-title');
const questionBody = document.querySelector('#question-body');
const answerTable = document.querySelector('#questions-table');
const warning = document.querySelector('#warning');
const success = document.querySelector('#success');
const username = document.querySelector('#username-field');
const loadQuestions = document.querySelector('.load-question');
const token = localStorage.getItem('token');
const loggedInAs = localStorage.getItem('username');
const logout = document.querySelector('#logout');
const questionId = localStorage.getItem('questionId');
const postAnswer = document.querySelector('#answersForm');

// Return login message if user is not logged in
if (localStorage.getItem('token') === null) {
    const output = `<div id="warning" class="show" style="margin-left: 15px; margin-right: 15px;">
    Please login to view this page.</div>`;
    loadQuestions.innerHTML = output;
    logout.innerHTML = 'Login';
}

// Set username on this page
username.innerHTML = loggedInAs;

// Add event listener for when the page loads
document.addEventListener('DOMContentLoaded', () => {
    getOneQuestion();
  });

// Load question onto the current page
let getOneQuestion = () => {
    fetch(`http://127.0.0.1:5000/stackoverflowlite/api/v1/questions/${questionId}`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json, text/plain, */*',
            'Content-type': 'application/json'
        }   
    })
    .then((response) => handleResponse(response))
    .then((res) => {
        if (res.status === 200) {
            res.json().then(data => {
                // Load question title and description onto this page
                questionTitle.innerHTML = data.question.title;
                questionBody.innerHTML = data.question.description;
                
                const answers = data.question.Answers;
                if (answers.length === 0) {
                    warning.classList.remove('hide');
                    warning.classList.add('show');
                    const message = 'This question has no answers yet. Post one below';
                    warning.innerHTML = message;
                } else {
                    let output = '';
                    answers.forEach(element => {
                        output += `
                        <tr>
                            <td>
                                <p>${element.title}</p>
                                <p> - <b>${element.username}</b>
                                <p>Posted on: ${element.date_created}</P>
                            </td>
                        </tr>
                        `;
                    });
                    answerTable.innerHTML += output;   
                }
            });    
        }
    })
    .catch((err) => {
        if (err.status === 404) {
                alert('Cannot fetch question');
        }
    });            
};

postAnswer.addEventListener('submit', e => {
    e.preventDefault();
    const answerBody = document.querySelector('#answer-body').value;

    const ansData = {
        description: answerBody
    };

    userPostAnswer(ansData);
});

// Function to post a new answer
let userPostAnswer = (details) => {
    fetch(`http://127.0.0.1:5000/stackoverflowlite/api/v1/questions/${questionId}/answers`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
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
                success.classList.add('show');

                success.innerHTML = `Success! ${data.message}`;
                const timeOut = () => { location.reload(true); };
                setTimeout(timeOut, 1000);
            });     
        }
    })
    .catch((err) => {
        if (err.status === 400 || err.status === 404) {
            err.json().then(data => {
                warning.classList.remove('hide');
                warning.classList.add('show');
                warning.innerHTML = `Warning! ${data.error}`;
            });
        }
    });  
};

