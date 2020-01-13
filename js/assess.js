$(document).ready(function() {
	var pid = localStorage.assessPid;
	var name = localStorage.assessName;
	var pic = localStorage.assessPic;

	$(".evaluate_head img").attr("src",pic);
	$(".evaluate_name_p").text(name);
	$(".evaluate_head").attr("oid", pid)
})
//评价等级
function pin(ob) {
	$(".pin").removeClass("pin_good")
	$(ob).addClass("pin_good");
}
/*添加图片*/

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
			var htmlStr = '<div class="filePic"><input type="file"  onchange="uploadPic()" class="fileimg_f" id="file"/><img src="' + "../img/image.jpg" + '" alt="" class="fileimg_imgs"/><img src="../img/ca1.png" class="fileimg_del" onclick="fileimg_del(this)" /></div>'
			var len = $('.imgOnloadWrap').find(".filePic").length
			if(len <= 4) {
				console.log(1)
				$('.imgOnloadWrap').append(htmlStr);
				$('.imgOnloadWrap').find(".fileimg_num").text(len);
				$(".fileimg_f").eq(len).attr("id", "file0")

			} else if(len == 5) {
				$('.imgOnloadWrap').find(".filePic").eq(0).hide()
				$('.imgOnloadWrap').append(htmlStr);
				$('.imgOnloadWrap').find(".fileimg_num").text(len)
			} else {
				$(".cue_box").text("最多只能传五张图片").fadeIn(500).delay(1).fadeOut(500);
			}
			$(".fileimg_imgs").eq(len).attr("src", data.url);
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			getcode()
		},
	})

}
/*图片删除*/
function fileimg_del(ob) {
	$(ob).parents('.imgOnloadWrap').find(".fileimg_num").text($(ob).parents('.imgOnloadWrap').find(".filePic").length - 2)
	$(ob).parents('.imgOnloadWrap').find(".filePic").eq(0).show()
	$(ob).parents(".filePic").remove();
}
//提交评价
function assess() {
	if($(".evaluate_body").find("textarea").val().length < 6) {
		$(".cue_box").text("评价的字数少于六个字").fadeIn(500).delay(1).fadeOut(500);
	} else {
		//取值
		var comm = $(".pin_good").attr("pin") //0为好评，1为中评，2为差评
		var txt = $(".evaluate_body").find("textarea").val() //取到了评价
		var img = "" //图片
		var len = $(".filePic").length

		for(i = 1; i < len; i++) {
			if(i = len - 1) {
				img += $(".filePic").eq(i).find(".fileimg_imgs").attr("src");
			} else {
				img += $(".filePic").eq(i).find(".fileimg_imgs").attr("src") + ","
			}
		}
		console.log("opId=" + $(".evaluate_head").attr("oid") + "&content=" + comm + "&imgs=" + img + "&evaluation=" + $(".evaluate_body textarea").val())
		//ajax
		$.ajax({
			url: web_url + "/ywyf-weixin/order/applyComm?opId=" + $(".evaluate_head").attr("oid") + "&content=" + $(".evaluate_body textarea").val() + "&imgs=" + img + "&evaluation=" + comm, //地址
			dataType: "json",
			type: "post",
			xhrFields: {
				withCredentials: true
			},
			timeout: 50000,
			success: function(data) {
				console.log(JSON.stringify(data))
				window.location.href = '../person/assessul.html';

			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				getcode()
			},
		})
	}
}