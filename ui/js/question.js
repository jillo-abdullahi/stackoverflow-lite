const questionTitle = document.querySelector('#question-title');
const questionBody = document.querySelector('#question-body');
const questionAuthored = document.querySelector('#posted-by');
const questionPostTime = document.querySelector('#posted-at');
const answerTable = document.querySelector('#questions-table');
const warning = document.querySelector('#warning');
const success = document.querySelector('#success');
const username = document.querySelector('#username-field');
const loadQuestions = document.querySelector('.load-question');
const logout = document.querySelector('#logout');
const postAnswer = document.querySelector('#answersForm');
const updateAnswer = document.querySelector('#answersEditForm');
const editAnswerContainer = document.querySelector('#edit-container');
const editAnswerTitle = document.querySelector('#edit-answer-body');
const closeButton = document.getElementById('cancel-form');
const userId = localStorage.getItem('user_id');
const questionId = localStorage.getItem('questionId');
const token = localStorage.getItem('token');
const loggedInAs = localStorage.getItem('username');
const baseUri = 'https://stackoverflowlite-api.herokuapp.com/stackoverflowlite/api/v1/';


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
    fetch(`${baseUri}questions/${questionId}`, {
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
                questionAuthored.innerHTML = data.question.username;
                questionPostTime.innerHTML = data.question.date_created;

                const questionAuthor = data.question.user_id;
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
                                    <p id="answer-title">${element.title}</p>
                                    <p> - <b>${element.username}</b>
                                    <p>Posted on: ${element.date_created}</p>
                                    <ul id="buttons-list">
                                
                                `;
                        //Add appropriate buttons based on current user
                        if (`${questionAuthor}` === `${userId}` && `${element.user_id}` === `${userId}`) {
                            output += `
                                <li>
                                <button onclick="editAnswer(${element.id})" id="edit-qn-btn">
                                <i class="fa fa-edit"></i> Edit</button>
                                </li>`;
                                if (element.preferred !== true) {
                                    output += `
                                    <li>
                                    <button onclick="acceptAnswer(${element.id})" id="accept-ans-btn">
                                    <i class="fa fa-check"></i> Accept</button>
                                    </li>
                                    `;
                                }       
                        } else if (`${element.user_id}` === `${userId}`) {
                            output += `
                                <li>
                                <button onclick="editAnswer(${element.id})" id="edit-qn-btn">
                                <i class="fa fa-edit"></i> Edit</button>
                                </li>
                                `;
                        } else if (`${questionAuthor}` === `${userId}` && element.preferred !== true) {
                            output += `
                                <li>
                                <button onclick="acceptAnswer(${element.id})" id="accept-ans-btn">
                                <i class="fa fa-check"></i> Accept</button>
                                </li>
                                `;
                        }
                        if (element.preferred === true) {
                            output += `
                            <li><p><span id="accepted">Accepted</span></p></li>`;
                        }   
                        output += `
                                    </ul>
                                </td>
                            </tr>`;
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
    fetch(`${baseUri}questions/${questionId}/answers`, {
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

// Function to accept answer
const acceptAnswer = (answerId) => {
    if (confirm('Please confirm if you would like to accept this answer')) { 
        fetch(`${baseUri}questions/${questionId}/answers/${answerId}`, {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json, text/plain, */*',
            'Content-type': 'application/json'
        },
        body: JSON.stringify({})
        })
        .then((response) => handleResponse(response))
        .then((res) => {
            if (res.status === 200) {
                res.json().then(data => {
                    alert(data.message);
                    const timeOut = () => { location.reload(true); };
                    setTimeout(timeOut, 1000);
                });     
            }
        })
        .catch((err) => {
            if (err.status === 403) {
                err.json().then(data => {
                    alert(data.message);
                });
            }
            });  
    }  
};

// close the edit answer modal using the close button
closeButton.addEventListener('click', e => {
    e.preventDefault();
    document.getElementById('edit-container').style.display = 'none';

    // Display post answer form on cancellation
    postAnswer.style.display = 'block';
});


// Function to edit answer
const editAnswer = (answerId) => {

    // Hide the post answer form
    postAnswer.style.display = 'none';

    // Display the edit answer form
    editAnswerContainer.style.display = 'block';
    editAnswerContainer.focus();

    
    // Set the value of form field to the answer being edited
    fetch(`${baseUri}answer/${answerId}`, {
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
                editAnswerTitle.value = data.message;
            });    
        }
    })
    .catch((err) => {
        if (err.status === 404) {
            err.json().then(data => {
                alert(data.message);
            });
        }
    });   
    
    // Edit the answer that has been selected
    updateAnswer.addEventListener('submit', e => {
        e.preventDefault();
        const newAnswer = editAnswerTitle.value;

        const ansBody = {
            description: newAnswer
        };

        fetch(`${baseUri}questions/${questionId}/answers/${answerId}`, {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json, text/plain, */*',
            'Content-type': 'application/json'
        },
        body: JSON.stringify(ansBody)
        })
        .then((response) => handleResponse(response))
        .then((res) => {
            if (res.status === 200) {
                res.json().then(data => {
                    alert(data.message);
                    const timeOut = () => { location.reload(true); };
                    setTimeout(timeOut, 1000);
                });     
            }
        })
        .catch((err) => {
            if (err.status === 403) {
                err.json().then(data => {
                    alert(data.message);
                });
            }
            });  
    });  
};
