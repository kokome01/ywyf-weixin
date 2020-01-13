//验证码倒计时,获取验证码
function sendMobileCode(ob) {
	$.ajax({
		url: web_url+'/ywyf-weixin/sendAliyunSms?tel=' + $("#login_name").val(), //地址 sendSms
		dataType: "json",
		type: "post",
		timeout: 50000,
		success: function(data) {
			//console.log(JSON.stringify(data))
			$("#login_test").attr("token", data.token)
			if(data.msg=="短信发送成功，请注意查收!"){
				cue(".login_cue", data.msg, "#35c048");
				//倒计时效果
				if($(ob).val() == "获取验证码") {
					$(ob).css({
						"background-color": "#cdcdcd",
						"color": "#fff",
						"border-color": "#fff"
					})
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
				}
			}
			else{
				cue(".login_cue", data.msg, "#CC0000");
			}
			
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			getcode()
		},
	})
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
	} else if($("#login_password_two").val() == "") {
		cue(".login_cue", "再次输入密码不能为空", "#CC0000")
		login_phone = false;
	} else {
		login_phone = true;
	}
	return login_phone
}
/*修改密码*/
function login_true() {
	console.log("returnUrl=&tel="+$("#login_name").val()+'&pwd='+$("#login_password").val()+"&code="+$("#login_test").val()+"&pwd1="+$("#login_password_two").val() + '&addType=1&token=' + $("#login_test").attr("token"))
	login()
	if(login_phone == true) {
		$.ajax({
			url: web_url+'/ywyf-weixin/register/apply', //地址
			dataType: "json",
			type: "post",
			timeout: 50000,
			data: "returnUrl=&tel="+$("#login_name").val()+'&pwd='+$("#login_password").val()+"&code="+$("#login_test").val()+"&pwd1="+$("#login_password_two").val() + '&addType=1&token=' + $("#login_test").attr("token"),
			success: function(data) {
				console.log(JSON.stringify(data))
				if(data.msg=="注册成功!"){
					cue(".login_cue", "成功注册", "#35c048")
					window.location.href = 'login.html?name=1';
				}else{
					cue(".login_cue", data.msg, "#CC0000")
				}
				
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				getcode()
			},
		})
		//console.log("注册成功")
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