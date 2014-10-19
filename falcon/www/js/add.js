function submit_to_server() {
	var inputs = ["groupName", "description", "location", "timeEnd"]
	var data = {
		groupName: document.forms["submission_form"]["groupName"].value,
		description: document.forms["submission_form"]["description"].value,
		location: document.forms["submission_form"]["location"].value,
		timeStart: moment(document.forms["submission_form"]["timeStart"].value, "HH:mm").unix(),
		timeEnd: moment(document.forms["submission_form"]["timeEnd"].value, "HH:mm").unix()
	}
	console.log(data);
	/*$.post(config.serverUri + "/add", function() {
		window.location.replace("index.html");
	});*/
}