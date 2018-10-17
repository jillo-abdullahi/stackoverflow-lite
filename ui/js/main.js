const myFunction = () => {
	const x = document.getElementById('myTopnav');
	console.log(x);
	if (x.className === 'topnav') {
		x.className += ' responsive';
	} else {
		x.className = 'topnav';
		}
	};
	
const handleResponse = (response) => {
	if (!response.ok) {
		throw response;
		} else {
		return response;
	}
};

const logOut = () => {
	localStorage.clear();
	window.location.href = 'index.html';
};

const saveDetails = (questionId) => {
    localStorage.setItem('questionId', questionId);
    window.location.href = 'question.html';
};

