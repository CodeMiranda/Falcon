function submit_to_server() {
	var inputs = ["groupName", "description", "location", "timeEnd"]
	for (var input of inputs) {
		console.log(document.forms["submission_form"][input].value)
	}
	var currenttime = new Date();
	console.log(currenttime);
}