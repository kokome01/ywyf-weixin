$(document).ready(function() {
	var oid = localStorage.customer
	//ajax
	console.log(oid)
	$.ajax({
		url: web_url + '/ywyf-weixin/order/toRefund?opId=' + oid, //地址
		dataType: "json",
		type: "post",
		timeout: 50000,
		xhrFields: {
			withCredentials: true
		}, //跨域产生问题（跨域请求设置withCredentials）登录，退出登录
		success: function(data) {
			console.log(JSON.stringify(data)) //打印data
			$("#refund_pic").attr("src", data.orderProduct.sku.product.pic);
			$("#refund_name").text(data.orderProduct.sku.product.name);
			$("#refund_price").text(data.orderProduct.price);
			$("#refund_num").text(data.orderProduct.num);
			$(".refund_details").attr("ref",data.orderProduct.id);
			console.log(data.orderProduct.oid)
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			getcode()
		},
	})
})
//上传图片
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
			$(".fileimg_imgs").attr("src", data.url);
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			getcode()
		},
	})

}
//选择理由
function refund1(ob) {
	$(ob).parents(".refund_type").find(".refund_list").removeClass("refund_good");
	$(ob).addClass("refund_good")
}

function refund2(ob) {
	$(ob).parents(".refund_type").find(".refund_li").removeClass("refund_go");
	$(ob).addClass("refund_go")
}
//上传图片
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
			$(".fileimg_imgs").attr("src", data.url);
			//window.location.reload()
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			getcode()
		},
	})
}

/*添加图片*/
function upimg(obj) {
	var imgFile = obj.files[0];
	var img = new Image();
	var fr = new FileReader();
	fr.onload = function() {
		var htmlStr = '<div class="filePic"><input type="file" onchange="upimg(this)" class="fileimg_f" /><img src="' + fr.result + '" alt="" class="fileimg_imgs"/><img src="../img/ca1.png" class="fileimg_del" onclick="fileimg_del(this)" /></div>'
		if($(obj).parents('.imgOnloadWrap').find(".filePic").length == 1) {
			$(obj).parents('.imgOnloadWrap').find(".filePic").eq(0).hide();
			$(obj).parents('.imgOnloadWrap').append(htmlStr);
			$(obj).parents('.imgOnloadWrap').find(".fileimg_num").text($(obj).parents('.imgOnloadWrap').find(".filePic").length - 1)
		} else {
			$(".cue_box").text("最多只能传一张图片").fadeIn(500).delay(1).fadeOut(500);
		}
		obj.value = '';
	}
	fr.readAsDataURL(imgFile);
}
/*图片删除*/
function fileimg_del(ob) {
	$(ob).parents('.imgOnloadWrap').find(".fileimg_num").text($(ob).parents('.imgOnloadWrap').find(".filePic").length - 2)
	$(ob).parents('.imgOnloadWrap').find(".filePic").eq(0).show()
	$(ob).parents(".filePic").remove();
}
/*提交申请*/
function refunds() {
	//取值
	var types1 = $(".refund_good").attr("ref"); //1退款2换货3仅退款
	var types2 = $(".refund_go").attr("ref"); //1.不想要了2.买错了3.实际产品和描述不符，4有破损，5商家发错货
	var types3 = $(".refund_val textarea").val(); //问题描述
	var img = $(".fileimg_imgs").attr("src");
	var id = $(".refund_details").attr("ref");
	if(types1 == undefined) {
		$(".cue_box").text("服务类型未选择").fadeIn(500).delay(1).fadeOut(500);
	} else if(types2 == undefined) {
		$(".cue_box").text("申请原因未选择").fadeIn(500).delay(1).fadeOut(500);
	} else if(types3.length < 6) {
		$(".cue_box").text("问题描述字数至少为六个字").fadeIn(500).delay(1).fadeOut(500);
	} else {
		//console.log("re_style=" + types1 + "&note=" + types3 + "&style=" + types2 + "&img=" + img + "&op_id=" + localStorage.customer)
		//ajax
		$.ajax({
			url: web_url + '/ywyf-weixin/order/applyRefund', //地址
			dataType: "json",
			type: "post",
			xhrFields: {
				withCredentials: true
			},
			timeout: 50000,
			data: "re_style=" + types1 + "&note=" + types3 + "&style=" + types2 + "&img=" + img + "&op_id=" + id,
			success: function(data) {
				console.log(JSON.stringify(data))
				window.location.href = 'chang.html'
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				getcode()
			},
		})
	}
}