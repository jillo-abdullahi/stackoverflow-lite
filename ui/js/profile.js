const questionStatus = document.querySelector('#questions-status');
const questionsPopStatus = document.querySelector('#questions-pop-status');
const questionsTable = document.querySelector('#questions-table');
const questionsPopTable = document.querySelector('#questions-pop-table');
const profileMain = document.querySelector('.profile-main');
const questionButton = document.querySelector('#ask-question-btn');
const logout = document.querySelector('#logout');
const currentUser = document.querySelector('#username');
const answersProvided = document.querySelector('#answers-count');
const questionsAsked = document.querySelector('#questions-count');
const username = document.querySelector('#username-field');
const token = localStorage.getItem('token');
const loggedInAs = localStorage.getItem('username');
const userId = localStorage.getItem('user_id');
const baseUri = 'https://stackoverflowlite-api.herokuapp.com/stackoverflowlite/api/v1/';

// Return login message if user is not logged in
if (localStorage.getItem('token') === null) {
    let output = '';
    output += `<div id="warning" class="show" style="margin-left: 15px; margin-right: 15px;">
        Please login to view this page.
        </div>`;
    profileMain.innerHTML = output;
    logout.innerHTML = 'Login';
    questionButton.style.display = 'none';
}

// Set username on this page
username.innerHTML = loggedInAs;
currentUser.innerHTML = loggedInAs;

// Add event listener for when the page loads
document.addEventListener('DOMContentLoaded', () => {
    getAnswersProvided();
    getUserQuestions();
  });

// Get the number of answers by this user
let getAnswersProvided = () => {
    fetch(`${baseUri}answers/${userId}`, {
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
                // Set value for number of answers provided
                const noOfAnswers = data.message.length;
                answersProvided.innerHTML = noOfAnswers;
            });     
        }
    })
    .catch((err) => {
        if (err.status === 404) {
            answersProvided.innerHTML = '0';    
        }
    });             
};

// Get all questions by the current user
let getUserQuestions = () => {
    fetch(`${baseUri}question/${userId}`, {
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
                let popOutput = '';
                data.questions.forEach(element => {
                    output += `
                    <tr>
                        <td>
                        <h4 onclick="saveDetails(${element.question_id})" style="cursor: pointer">
                            <a id="question-title"><b>${element.title}</b></a>
                        </h4>
                        <p>
                            Posted: <span id="post-time">${element.date_created}</span> | 
                            <a href="question.html" id="answers-count">
                            ${element.Answers.length}
                            </a> answers |
                            <button type="button" data-id=${element.question_id} 
                            id="qn-del-btn" onclick="deleteQuestion(${element.question_id})">
                            <i class="fa fa-trash"></i> 
                            <span class="btn-text">Delete</span></button>
                        </p>
                        </td>
                        <td><img src="img/upvote.png" alt="upvotes image">3</td>
                        <td><img src="img/downvote.png" alt="upvotes image">0</span></td>
                    </tr>`;

                    popOutput += `
                    <tr>
                        <td>
                        <h4 onclick="saveDetails(${element.question_id})" style="cursor: pointer">
                            <a id="question-title"><b>${element.title}</b></a>
                        </h4>
                        <p>
                            <h4 id="answers-count">
                            <u>Total answers: ${element.Answers.length}</u>
                            </h4>
                        </p>
                        </td>
                        <td><img src="img/upvote.png" alt="upvotes image">3</td>
                        <td><img src="img/downvote.png" alt="upvotes image">0</span></td>
                    </tr>`;
                });
                questionsTable.innerHTML = output;
                questionsPopTable.innerHTML = popOutput;


                // Set value for number of questions asked
                const noOfQuestions = data.questions.length;
                questionsAsked.innerHTML = noOfQuestions;
            });     
        }
    })
    .catch((err) => {
        if (err.status === 404) {
            questionsAsked.innerHTML = '0';
            questionStatus.classList.remove('hide');
            questionStatus.classList.add('show');
            const addMessage = 'You haven\'t asked any question yet.';
            questionStatus.innerHTML = `${addMessage}`;

            questionsPopStatus.classList.remove('hide');
            questionsPopStatus.classList.add('show');
            questionsPopStatus.innerHTML = `${addMessage}`;   
        }
    });
};
// Function to delete question
const deleteQuestion = (questionId) => {
    if (confirm('Are you sure you want to delete this question?')) {
        fetch(`${baseUri}questions/${questionId}`, {
        method: 'DELETE',
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
                alert(data.message);
                location.reload(true);
            });
        }
    })
    .catch((err) => {
        if (err.status === 400) {
            err.json().then(data => {
                alert(data.error);
            });
        }
    });          
    }     
};
