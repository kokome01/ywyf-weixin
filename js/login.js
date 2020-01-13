$(document).ready(function() {
	code()
})
/*提示*/
var login_phone = false;

function login() {
	if($("#login_name").val() == "" || $("#login_name").val().length < 11) {
		cue(".login_cue", "请输入正确的手机号码", "#CC0000")
		login_phone = false
	} else if($("#login_password").val() == "") {
		cue(".login_cue", "密码不能为空", "#CC0000")
		login_phone = false
	} else if($("#login_test").val() == "") {
		cue(".login_cue", "你输入的验证码为空", "#CC0000")
		login_phone = false
	} else {
		login_phone = true
	}
}
/*点击登录*/
function login_true() {
	//console.log($('#form1').serialize() + '&returnUrl=')
	login()
	if(login_phone == true) {
		//ajax
		$.ajax({
			url: web_url + '/ywyf-weixin/login/apply', //地址
			dataType: "json",
			type: "post",
			xhrFields: {
				withCredentials: true
			},
			timeout: 50000,
			data: $('#form1').serialize() + '&returnUrl=',
			success: function(data) {
				//console.log(JSON.stringify(data))
				//成功
				cue(".login_cue", data.msg, "#cc0000");
				if(data.msg == "登录成功!") {
					//localStorage.ywyfWx_userId = data.user.id;
					//localStorage.param1 = data.user.param1;
					window.location.href = '../index.html';
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				getcode()
			},
		})

	}
}
/*验证码*/
function code() {
	$("#codeValidateImg").attr("src", web_url + '/ywyf-weixin/getSysManageLoginCode');
}
//清空input
function empty(ob) {
	$(ob).parents(".account_empty ").find("input").val("")
}
//密码查看
function eye() {
	if($(".account_pass_img").attr("name") == "0") {
		$(".account_pass_img").attr({
			"src": "../img/eye.png",
			"name": "1"
		});
		$(".account_pass_ming").show().val($(".account_pass_an").val());
	} else {
		$(".account_pass_img").attr({
			"src": "../img/eye2.png",
			"name": "0"
		});
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
	$(".cue_box").fadeOut(2000) //.remove()
}

/*密码显示转移*/
function zhuan() {
	$("#login_password").val($("#login_password2").val())
}
/**/
function rt() {
	if(getQueryString("name") == 1) {
		window.location.href = '../index.html';
	} else {
		window.history.back(-1);
	}
}