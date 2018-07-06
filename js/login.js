//清空input
function empty(ob) {
	$(ob).parents(".account_empty ").find("input").val("")
}
//密码查看
function eye() {
	if($(".account_pass_img").attr("name") == "0") {
		$(".account_pass_img").attr({ "src": "../img/eye.png", "name": "1" });
		$(".account_pass_ming").show().val($(".account_pass_an").val());
	} else {
		$(".account_pass_img").attr({ "src": "../img/eye2.png", "name": "0" });
		$(".account_pass_an").val($(".account_pass_ming").val());
		$(".account_pass_ming").hide()
	}
}
//提示
function cue(wei, txt, color) {
	$(".login_cue").empty()
	var cue_html = '<div class="cue_box">' + txt + '</div>'
	$(wei).append(cue_html)
	$(".cue_box").css("background-color", color)
	$(".cue_box").fadeOut(2000)//.remove()
}

/*密码显示转移*/
function zhuan(){
	$("#login_password").val($("#login_password2").val())
}
