function sign_out() {
	window.localStorage.setItem("realname", null);
	window.location = "login.html";
}