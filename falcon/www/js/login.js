function set_name() {
	var realname = document.getElementById("name");
	window.localStorage.setItem("realname", realname.value);
	window.location = "index.html";
}

