function submit_to_server() {
	var inputs = ["groupName", "description", "location", "timeStart", "timeEnd"]
	var data = {
		groupName: document.forms["submission_form"]["groupName"].value,
		description: document.forms["submission_form"]["description"].value,
		location: document.forms["submission_form"]["location"].value,
		timeStart: moment(document.forms["submission_form"]["timeStart"].value, "HH:mm").unix(),
		timeEnd: moment(document.forms["submission_form"]["timeEnd"].value, "HH:mm").unix()
	}
	//console.log(data);
	targetServer = config.serverUri + '/add?' + $.params(data);
	$.post(targetServer, function(response) {
		console.log(response);
		//window.location.replace("index.html");
	});
}