$(document).ready(function(){
	if(getQueryString("oid")==undefined){
		window.location.href = '../store/store_order.html';
	}else{
		ajax()
	}
})
//星级
function star(nu){
	$(".evaluate_botton_box").find(".store_i_star").css("background-position","-120px -80px")
	for(i=0;i<nu;i++){
		$(".evaluate_botton_box").find(".store_i_star").eq(i).css("background-position","-80px -80px")
	}
	$(".evaluate_botton_box").attr("star",nu);
}
//满意差评按钮
function evaluate_style(ob) {
	$(ob).parents(".evaluate_botton_box").find(".evaluate_red").css({
		"background-color": "#fff",
		"color": "#cc0000"
	}).find(".store_img").css("background-position", "-80px -0px");
	$(ob).parents(".evaluate_botton_box").find(".evaluate_blue").css({
		"background-color": "#fff",
		"color": "#0A79E5"
	}).find(".store_img").css("background-position", "-0px -0px");
	$(ob).parents(".evaluate_botton_box").find(".evaluate_yellow").css({
		"background-color": "#fff",
		"color": "#ffb400"
	}).find(".store_img").css("background-position", "-40px -0px");
	if($(ob).attr("col") == "1") {
		$(ob).css({
			"background-color": "#cc0000",
			"color": "#fff"
		});
		$(ob).find(".store_img").css("background-position", "-100px -0px")
	} else if($(ob).attr("col") == "2") {
		$(ob).css({
			"background-color": "#0A79E5",
			"color": "#fff"
		});
		$(ob).find(".store_img").css("background-position", "-20px -0px")
	} else if($(ob).attr("col") == "3") {
		$(ob).css({
			"background-color": "#ffb400",
			"color": "#fff"
		});
		$(ob).find(".store_img").css("background-position", "-60px -0px")
	}
}
//提交评价
function evaluate_but() {
	if($(".evaluate_criticism").find("textarea").val()==""){
		alert("输入文字不能为空")
	}else if($(".evaluate_criticism").find("textarea").val().length<6){
		alert("输入的文字不能小于六个字符")
	}else if($(".evaluate_botton_box").attr("star")==undefined){
		alert("请评价产品星级")
	}else{
		$.ajax({
		url: web_url + '/ywyf-weixin/spmkt/commApply/?oid='+getQueryString("oid")+'&pid=&note='+$(".evaluate_criticism").find("textarea").val()+'&images='+$(".fileimg_imgs").attr("src")+'&star='+$(".evaluate_botton_box").attr("star"), //地址
		dataType: "json",
		type: "post",
		xhrFields: {
			withCredentials: true
		},
		timeout: 50000,
		data: $('#form1').serialize() + '&returnUrl=',
		success: function(data) {
			console.log(JSON.stringify(data))
			if(data.status!=1){
				/*alert("请登录");
				window.location.href="../other/login.html"*/
			}else{
				alert("评价成功");
				window.location.href="../store/store_order.html"
				localStorage.removeItem('store_evaluate');
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			//alert(XMLHttpRequest.status);
			//alert(XMLHttpRequest.readyState);
			//alert(textStatus);
			console.log("网络请求失败，请联系网站管理员!");
		},
	})
	}
	

	//window.location.href = 'store_order.html'
}
//图片上传
function upimg(obj) {
	var formData = new FormData();
	//console.log(document.getElementById("file").files[0]);
	formData.append('pic', document.getElementById("file").files[0]);
	//console.log(formData);
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
			$(".fileimg_imgs").attr("src", data.url);
			//window.location.reload()
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			getcode()
		},
	})
}
//加载
function ajax(){
	var store_evaluate = JSON.parse(localStorage.store_evaluate);
	$(".evaluate_thing>img").attr("src",store_evaluate.store_img);
	$(".evaluate_text_name").text(store_evaluate.store_name);
	var strhtml = "";
	for(i=0;i<store_evaluate.store_commodity.length;i++){
		strhtml += '<li><span>'
				+store_evaluate.store_commodity[i].comm_name+
				'</span><span class="evaluate_list_right"><span>'
				+store_evaluate.store_commodity[i].comm_num+
				'</span></span></li>'
	}
	$(".evaluate_list>ul").empty().append(strhtml)
}
