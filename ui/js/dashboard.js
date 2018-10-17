const ask = document.querySelector('#ask-form');
const warning = document.querySelector('#warning');
const success = document.querySelector('#success');
const main = document.querySelector('#main-section');
const logout = document.querySelector('#logout');
const questionStatus = document.querySelector('#questions-status');
const questionsTable = document.querySelector('#questions-table');
const username = document.querySelector('#username-field');
const token = localStorage.getItem('token');
const loggedInAs = localStorage.getItem('username');
const baseUri = 'https://stackoverflowlite-api.herokuapp.com/stackoverflowlite/api/v1/questions';


// Set username on this page
username.innerHTML = loggedInAs;

// Return login message if user is not logged in
if (localStorage.getItem('token') === null) {
    let output = '';
    output += `<div id="warning" class="show" style="margin-left: 15px; margin-right: 15px;">
    Please login to view this page.</div>
    `;
    main.innerHTML = output;
    logout.innerHTML = 'Login';
}

// Add even listener on question form submission
ask.addEventListener('submit', e => {
    e.preventDefault();
    const qnTitle = document.querySelector('#question-title').value;
    const qnDescription = document.querySelector('#question-body').value;

    const qnDetails = {
            title: qnTitle,
            description: qnDescription
        };
    postQuestion(qnDetails);   
});

// Add event listener for when the page loads
document.addEventListener('DOMContentLoaded', () => {
    getAllQuestions();
  });

// Function to post new question
const postQuestion = (details) => {
    fetch(baseUri, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json, text/plain, */*',
            'Content-type': 'application/json'
        },
        body: JSON.stringify(details)
    })
    .then((res) => handleResponse(res))
    .then((res) => {
        if (res.status === 201) {
            res.json().then(data => {
                warning.classList.remove('show');
                warning.classList.add('hide');
                success.classList.remove('hide');
                success.classList.add('show');

                success.innerHTML = `Success! ${data.message}`;
                const timeOut = () => { location.reload(true); };
                setTimeout(timeOut, 2000);
            });  
        }
    })
    .catch((err) => {
        if (err.status === 400) {
            err.json().then(data => {
                success.classList.remove('show');
                success.classList.add('hide');
                warning.classList.remove('hide');
                warning.classList.add('show');
                warning.innerHTML = data.error;
            });
        } else if (err.status === 401) {
            success.classList.remove('show');
            success.classList.add('hide');
            warning.classList.remove('hide');
            warning.classList.add('show');
            warning.innerHTML = 'Please login first to post a question';
        }
    });
};

// Function to get all question from all users
const getAllQuestions = () => {
    fetch(baseUri, {
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
                let output = '';
                data.questions.forEach(element => {
                    output += `
                    <tr>
                        <td>
                            <h4 onclick="saveDetails(${element.question_id})" 
                            style="cursor: pointer;">
                                <a id="question-title"><b>${element.title}</b></a>
                            </h4>
                            <p>
                            Posted: <span id="post-time">${element.date_created}</span> | 
                            By <a href="#" id="post-by">${element.username[0]}</a> | 
                            <a href="question.html" id="answers-count">${element.Answers.length}
                            </a> answers
                        </p>
                        </td>
                        <td><img src="img/upvote.png" alt="upvotes image">3</td>
                    <td><img src="img/downvote.png" alt="upvotes image">0</span></td>
                    </tr>
                    `;
                });
                questionsTable.innerHTML = output;
            });   
        }
    })
    .catch((err) => {
        if (err.status === 404) {
            err.json().then(data => {
                questionStatus.classList.remove('hide');
                questionStatus.classList.add('show');
                const addMessage = 'Be the first one to ask';
                questionStatus.innerHTML = `${data.message}. ${addMessage}.`;
            });
        }
    });
};

