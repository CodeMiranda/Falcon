function submit_to_server() {
	var inputs = ["groupName", "description", "location", "timeEnd"]
	var data = {
		groupName: document.forms["submission_form"]["groupName"].value,
		description: document.forms["submission_form"]["description"].value,
		location: document.forms["submission_form"]["location"].value,
		timeStart: document.forms["submission_form"]["timeStart"].value,
		timeEnd: document.forms["submission_form"]["timeEnd"].value
	}
	console.log(data);
	/*$.post(config.serverUri + "/group", function() {
		window.location.replace("index.html");
	});*/
}