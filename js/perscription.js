/*添加图片*/
function upimg(obj) {
	var formData = new FormData();
	//console.log(document.getElementById("file").files[0]);
	formData.append('pic', document.getElementById("file").files[0]);
	//console.log(formData);
	///ajax
	$.ajax({
		url: 'http://192.168.0.102/ywyf-weixin/upload/uploadPic1.do', //地址
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
			$(".fileimg_imgs").attr("src", data.url);
			//window.location.reload()
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			//alert(XMLHttpRequest.status);
			//alert(XMLHttpRequest.readyState);
			//alert(textStatus);
			console.log("网络请求失败，请联系网站管理员!");
		},
	})
}
/*图片删除*/
function fileimg_del(ob) {
	$(ob).parents('.imgOnloadWrap').find(".fileimg_num").text($(ob).parents('.imgOnloadWrap').find(".filePic").length - 2)
	$(ob).parents('.imgOnloadWrap').find(".filePic").eq(0).show()
	$(ob).parents(".filePic").remove();
}
/*选择处方类型*/
function presc1() {
	$(".body1").hide();
	$(".body2").show()
	$(".back").attr("onclick", "presc0()")
	$(".register_on").text("确认").attr("onclick", "presc_but1()")
}

function presc2() {
	$(".body1").hide();
	$(".body3").show();
	$(".back").attr("onclick", "presc0()")
	$(".register_on").text("确认").attr("onclick", "presc_but2()")
}
//返回选择
function presc0() {
	$(".body1").show();
	$(".body2").hide();
	$(".body3").hide();
	$(".back").attr("onclick", "window.location.href='introduction.html'")
	$(".register_on").text("")
}
//点击确认

function presc_but1() {
	var btm = false;
	var sex = ""
	if($("#user-name").val() == "") {
		$(".cue_box").text("请输入你的名字").fadeIn(500).delay(1).fadeOut(500);
		btm = false
	} else if($("#user-phone").val() == "") {
		$(".cue_box").text("请输入你的电话").fadeIn(500).delay(1).fadeOut(500);
		btm = false
	} else if($("#user-address").val() == "") {
		$(".cue_box").text("请输入你的地址").fadeIn(500).delay(1).fadeOut(500);
		btm = false
	} else if($("#user-years").val() == "") {
		$(".cue_box").text("请输入你的年龄").fadeIn(500).delay(1).fadeOut(500);
		btm = false
	} else if($("#user-hospital").val() == "") {
		$(".cue_box").text("请输入你的医院").fadeIn(500).delay(1).fadeOut(500);
		btm = false
	} else if($("#user-doctor").val() == "") {
		$(".cue_box").text("请输入你的医生").fadeIn(500).delay(1).fadeOut(500);
		btm = false
	} else {
		btm = true
	}

	if(btm == true) {
		console.log($('#form1').serialize())
		if($("input[sexc='1']").val() == 0) {
			sex = 0
		} else {
			sex = 1
		}
		ajax_but($('#form1').serialize(),"")
		//$(".cue_box").css("background-color", "#4FD24E").text("提交成功").fadeIn(500).delay(1).fadeOut(500);
		//window.location.href = 'introduction.html'
	}
}

function presc_but2() {
	var btm = false;
	if($(".fileimg_imgs").attr("src") == "../img/image.jpg") {
		$(".cue_box").text("请上传图片").fadeIn(500).delay(1).fadeOut(500);
		btm = false;
	} else {
		btm = true;
	}
	if(btm == true) {
		ajax_but('user_name=&age=&sex=0&hospital=&doc=&dis_content=',$(".fileimg_imgs").attr("src"))
		//$(".cue_box").css("background-color", "#4FD24E").text("提交成功").fadeIn(500).delay(1).fadeOut()
		//window.location.href = 'introduction.html';
	}
}
//性别
function sex_x(ob) {
	$("input[type='radio']").attr("sexc", "0");
	$(ob).attr("sexc", "1");
}
//ajax
function ajax_but(fr,zhi){
	//ajax
	$.ajax({
		url: 'http://192.168.0.102/ywyf-weixin/user/preApply', //地址
		dataType: "json",
		type: "post",
		timeout: 50000,
		xhrFields: {
			withCredentials: true
		},
		data: fr + '&pic='+zhi,
		success: function(data) {
			//console.log(JSON.stringify(data))
			if(data.status == 1) {
				if(data.msg=="更新成功"){
					$(".cue_box").css("background-color", "#4FD24E").text("提交成功").fadeIn(500).delay(1).fadeOut(500);
					window.location.href = 'introduction.html';
				}
			} else {
				alert("请登录");
				window.location.href = 'login.html';
			}

		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			/*alert(XMLHttpRequest.status);
			alert(XMLHttpRequest.readyState);
			alert(textStatus);*/
			console.log("网络请求失败，请联系网站管理员!");
		},
	})
}