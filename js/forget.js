//验证码倒计时,获取验证码
function sendMobileCode(ob) {
	var tel = $("#login_name").val()
	if(/^1\d{10}$/.test(tel)) {
		if($(ob).val() == "获取验证码") {
			$.ajax({
				url: web_url + '/ywyf-weixin/sendAliyunSms?tel=' + tel, //地址 czPwdSms
				dataType: "json",
				type: "post",
				timeout: 50000,
				success: function(data) {
					console.log(JSON.stringify(data))
					cue(".login_cue", data.msg, "#cc0000");
					$("#login_test").attr("token", data.token);
					if(data.msg == "短信发送成功，请注意查收!") {
						cue(".login_cue", data.msg, "#35c048");
						//倒计时效果
						$(ob).css({
							"background-color": "#cdcdcd",
							"color": "#fff",
							"border-color": "#fff"
						})
						$(ob).attr("onclick","console.log(12)")
						var times = "";
						var num = 60;
						times = setInterval(function() {
							num--
							if(num <= 0) {
								clearInterval(times); //清除js定时器
								$(ob).attr("onclick","sendMobileCode(this);")
								$(ob).val("获取验证码");
								nums = 60; //重置时间
								$(ob).css({
									"background-color": "#0A79E5",
									"color": "#fff",
									"border-color": "#0A79E5"
								})
							} else {
								$(ob).attr("onclick","console.log(12)")
								$(ob).val(num);
							}
						}, 1000);

					} else {
						cue(".login_cue", data.msg, "#cc0000");
					}

				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					getcode()
				},
			})
		}
	} else {
		cue(".login_cue", "请输入正确的手机号码", "#CC0000")
	}

}
/*提示*/
var login_phone = false

function login() {
	if($("#login_name").val() == "" || $("#login_name").val().length < 11) {
		cue(".login_cue", "请输入正确的手机号码", "#CC0000")
		login_phone = false
	} else if($("#login_test").val() == "") {
		cue(".login_cue", "你输入的验证码为空", "#CC0000")
		login_phone = false
	} else if($("#login_password").val() == "") {
		cue(".login_cue", "密码不能为空", "#CC0000")
		login_phone = false
	} else {
		login_phone = true
	}
}
/*忘记密码*/
function login_true() {
	login()
	if(login_phone == true) {
		//ajax
		$.ajax({
			url: web_url + '/ywyf-weixin/user/czPwdApply', //地址
			dataType: "json",
			type: "post",
			timeout: 50000,
			data: $('#form1').serialize() + '&token=' + $("#login_test").attr("token") + '&pwd1=' + $("#login_password").val(),
			success: function(data) {
				console.log(JSON.stringify(data));
				//成功
				if(data.msg == "修改成功") {
					cue(".login_cue", data.msg, "#35c048");
					window.location.href = '../other/login.html?name=1';
				} else {
					cue(".login_cue", data.msg, "#cc0000");
				}

			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				getcode()
			},
		})

	}
}