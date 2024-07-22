
document.getElementById('play-button').addEventListener('click', function() {
	fetch('/api/get-data')
		.then(response => response.json())
		.then(data => {
			document.getElementById('main-box').innerText = data.message;
		})
		.catch(error => console.error('Error:', error));
});