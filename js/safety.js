$(document).ready(function() {
	var sex = "",
		age = "",
		pic = "../img/tou.png";
	//加载地址列表
	$.ajax({
		url: web_url + '/ywyf-weixin/user/info', //地址
		dataType: "json",
		type: "post",
		timeout: 50000,
		xhrFields: {
			withCredentials: true
		},
		success: function(data) {
			console.log(JSON.stringify(data))
			//赋值
			if(data.status == 1) {
				//头像
				if(data.user.pic != null) {
					pic = data.user.pic
				}
				//性别
				if(data.user.sex != null) {
					if(data.user.sex == 0) {
						sex = "女"
					} else {
						sex = "男"
					}
				}
				//console.log(JSON.stringify(data));
				$(".safety_image").attr("src", pic)
				$(".safety_name").find(".safety_val").text(data.user.nickname);
				$(".safety_sexuality").find(".safety_val").text(sex);
				$("#login_name").val(data.user.tel)
				//如果是医生端1地址管理隐藏，如果是用户端0地址管理显示

			} else {
				console.log("状态为0")
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			getcode()
		},
	})
})
window.onload = function() {
	//加载年月日
	time()
}
/*返回body1*/
function back() {
	$(".body").show();
	$(".head").show();
	$(".body2").hide();
	$(".head2").hide();
}
/*跳转到body2*/
function body2(ob, txt, fun) {
	$(".body").hide();
	$(".head").hide();
	$(".body2").show();
	$(".body2>div").addClass("safety_hide")
	$(".head2").show();
	$(".safety_title").text(txt)
	$(ob).removeClass("safety_hide")
	$(".register_on").attr("onclick", fun);
}
/*修改名字*/
function name() {
	body2(".safety_entry_b", "用户名", "name_button()")
	$(".safety_entry").find("input[type='text']").val($(".safety_name").find(".safety_val").text())
}
//清除名字
function name_ovem() {
	$(".safety_entry").find("input[type='text']").val("")
}
//确认名字 
function name_button() {
	var name = $(".safety_entry").find("input[type='text']").val()
	back()
	$(".safety_name").find(".safety_val").text(name);
	//ajax
	ajax_but()
}
/*提交ajax*/
function ajax_but() {
	var sexi = 0
	if($(".safety_sexuality").find(".safety_val").text() == "女") {
		sexi = 0
	} else if($(".safety_sexuality").find(".safety_val").text() == "男") {
		sexi = 1
	}
	console.log($(".safety_image").attr("src"));
	//ajax
	$.ajax({
		url: web_url + '/ywyf-weixin/user/apply', //地址
		dataType: "json",
		type: "post",
		xhrFields: {
			withCredentials: true
		},
		timeout: 50000,
		data: "nickname=" + $(".safety_name").find(".safety_val").text() + "&sex=" + sexi + "&pic=" + $(".safety_image").attr("src"),
		success: function(data) {
			console.log(JSON.stringify(data));
			window.location.reload()
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			getcode()
		},
	})
}
/*修改性别*/
function sex() {
	body2(".safety_sex_b", "性别", "sex_button()")
	$(".safety_entry").find("input[type='text']").val($(".safety_name").find(".safety_val").text())
	var sex = $(".safety_sexuality").find(".safety_val").text()
	$(".safety_sex img").removeClass("safety_sex_gou")
	if(sex == "男") {
		$(".safety_sex").eq(0).find("img").addClass("safety_sex_gou")
	} else if(sex == "女") {
		$(".safety_sex").eq(1).find("img").addClass("safety_sex_gou")
	} else {
		$(".safety_sex").eq(2).find("img").addClass("safety_sex_gou")
	}
}
//选择性别
function sex_choice(ob) {
	$(".safety_sex img").removeClass("safety_sex_gou")
	$(ob).find("img").addClass("safety_sex_gou")
}
//确认性别
function sex_button() {
	back()
	var sex = $(".safety_sex_gou").parents(".safety_sex").find("span").text();
	$(".safety_sexuality").find(".safety_val").text(sex);
	//ajax
	ajax_but()
}
/*修改生日*/
function birthday() {
	body2(".safety_birthday_b", "出生日期", "birthday_button()");
	$(".year_val").text($(".safety_times").find(".safety_val").find("label").eq(0).text());
	$(".month_val").text($(".safety_times").find(".safety_val").find("label").eq(1).text());
	$(".day_val").text($(".safety_times").find(".safety_val").find("label").eq(2).text());
}
//确认生日
function birthday_button() {
	back()
	$(".safety_val").find("label").eq(0).text($("#year_val2").text())
	$(".safety_val").find("label").eq(1).text($("#month_val2").text())
	$(".safety_val").find("label").eq(2).text($("#day_val2").text())
}
/*加载年月日*/
function time() {
	var year = '';
	var month = ''
	var day = '';
	$(".yom_year").empty();
	$(".yom_month").empty();
	$(".yom_day").empty();
	for(i = 1920; i < 2019; i++) {
		year += '<p onclick="time_i(this)">' + i + '</p>'
	}
	for(i = 1; i < 12; i++) {
		if(i < 10) {
			month += '<p onclick="time_i(this)">0' + i + '</p>'
		} else {
			month += '<p onclick="time_i(this)">' + i + '</p>'
		}
	}
	for(i = 1; i < 31; i++) {
		if(i < 10) {
			day += '<p onclick="time_i(this)">0' + i + '</p>'
		} else {
			day += '<p onclick="time_i(this)">' + i + '</p>'
		}
	}
	$(".yom_year").append(year);
	$(".yom_month").append(month);
	$(".yom_day").append(day);
}
//点击事件
function time_i(ob) {
	$(ob).parents(".safety_birt_num").find("b").text($(ob).text())
	$("#year_val1").text($("#year_val2").text());
	$("#month_val1").text($("#month_val2").text());
	$("#day_val1").text($("#day_val2").text());
};
/*点击修改密码*/
function password() {
	body2(".safety_password_b", "修改密码", "password_button()")
}
//验证码倒计时
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
					$("#login_test").attr("token", data.token);
					if(data.msg == "短信发送成功，请注意查收!") {
						$(".cue_box").text("短信发送成功，请注意查收!").fadeIn(500).delay(1).fadeOut(500);
						//倒计时效果
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
								$(ob).disabled = false;
								$(ob).val("获取验证码");
								nums = 60; //重置时间
								$(ob).css({
									"background-color": "#0A79E5",
									"color": "#fff",
									"border-color": "#0A79E5"
								})
							} else {
								$(ob).val(num);
							}
						}, 1000);

					} else {
						$(".cue_box").text("请输入正确的手机号").fadeIn(500).delay(1).fadeOut(500);
					}

				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					getcode()
				},
			})
		}
	} else {
		console.log(132)
	}

}
/*提示*/
var login_phone = false

function login() {
	if($("#login_test").val() == "") {
		$(".cue_box").text("您的验证码为空").fadeIn(500).delay(1).fadeOut(500);
		login_phone = false
	} else if($("#login_test").val() == "") {
		$(".cue_box").text("您的验证码为空").fadeIn(500).delay(1).fadeOut(500);
		login_phone = false
	} else if($("#login_password").val() == "") {
		$(".cue_box").text("您的新密码为空").fadeIn(500).delay(1).fadeOut(500);
		login_phone = false
	} else {
		login_phone = true;
	}
}
/*修改密码*/
function password_button() {
	login()
	if(login_phone == true) {
		console.log($('#form1').serialize() + '&token=' + $("#login_test").attr("token") + '&pwd1=' + $("#login_password").val() + $("#login_name").val())
		//ajax
		$.ajax({
			url: web_url + '/ywyf-weixin/user/czPwdApply', //地址
			dataType: "json",
			type: "post",
			timeout: 50000,
			data: $('#form1').serialize() + '&token=' + $("#login_test").attr("token") + '&pwd1=' + $("#login_password").val() + '&tel=' + $("#login_name").val(),
			success: function(data) {
				console.log(JSON.stringify(data));
				//成功
				if(data.msg == "修改成功") {
					alert("修改成功");
					sex_button()
				} else {
					alert("修改失败")
				}

			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				getcode()
			},
		})

	}
}
/*修改头像*/
/*function upimg(obj) {
	/*var imgFile = obj.files[0];
	var img = new Image();
	var fr = new FileReader();
	fr.onload = function() {
		$(".safety_image").attr("src", fr.result)
		obj.value = '';
		//ajax
		ajax_but()
	}
	fr.readAsDataURL(imgFile);*/
//var imgFile = obj.files[0];

/*}*/
function uploadPic() {
	var formData = new FormData();
	console.log(document.getElementById("file").files[0]);
	formData.append('pic', document.getElementById("file").files[0]);
	console.log(formData);
	///ajax
	$.ajax({
		url: web_url + '/ywyf-weixin/upload/uploadPic1.do', //地址
		dataType: "json",
		type: "post",
		xhrFields: {
			withCredentials: true
		},
		timeout: 50000,
		data: formData,
		async: false,
		processData: false,
		contentType: false,
		success: function(data) {
			console.log(JSON.stringify(data));
			$(".safety_image").attr("src", data.url);
			//window.location.reload()
			ajax_but()
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			getcode()
		},
	})
}
//退出登录
function exit() {
	///ajax
	$.ajax({
		url: web_url + '/ywyf-weixin/login/exit', //地址
		dataType: "json",
		type: "post",
		xhrFields: {
			withCredentials: true
		},
		timeout: 50000,
		async: false,
		processData: false,
		contentType: false,
		success: function(data) {
			console.log(JSON.stringify(data));
			window.location.reload()
			localStorage.removeItem('json_shop');
			localStorage.removeItem('ywyfWx_userId'); 
			sessionStorage.removeItem('set_address');
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			getcode()
		},
	})
}