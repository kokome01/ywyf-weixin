//选择举报类型
function styles(ob) {
	$(".report_style_li").removeClass("report_style_on");
	$(ob).addClass("report_style_on");
}
//提交举报
function report_but() {
	if($(".report_style_on").attr("ty") == undefined) {
		alert("举报类型尚未选择")
	} else if($("#report_info").val() == "") {
		alert("举报说明不能为空")
	} else if($("#report_info").val().length < 6) {
		alert("举报说明文字不能少于六个字")
	} else {
		ajax()
	}
	//window.location.href='store_storefront.html?id='+getQueryString("id")
}
//ajax
function ajax() {
	console.log(web_url + '/ywyf-weixin/spmkt/complain?type=' + $(".report_style_on").text() + '&info=' + $("#report_info").val() + '&spmktId=' + 1 + '&images=' + $(".report_images>img").attr("src"))
	$.ajax({
		url: web_url + '/ywyf-weixin/spmkt/complain?type=' + $(".report_style_on").text() + '&info=' + $("#report_info").val() + '&spmktId=' + 1 + '&images=' + $(".report_images>img").attr("src"), //地址
		dataType: "json",
		type: "post",
		xhrFields: {
			withCredentials: true
		},
		timeout: 50000,
		success: function(data) {
			console.log(JSON.stringify(data));
			if(data.msg == "操作成功") {
				window.location.href = 'store_storefront.html?id=' + getQueryString("id")
			} else {
				/*alert("请登录")
				window.location.href = '../other/login.html'*/
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
/*添加图片*/
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