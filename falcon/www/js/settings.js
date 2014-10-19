function sign_out() {
	window.localStorage.setItem("userName", "");
	window.location = "login.html";
}