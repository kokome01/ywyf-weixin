//选择理由
function refund1(ob) {
	$(ob).parents(".refund_type").find(".refund_list").removeClass("refund_good");
	$(ob).addClass("refund_good")
}

function refund2(ob) {
	$(ob).parents(".refund_type").find(".refund_li").removeClass("refund_go");
	$(ob).addClass("refund_go")
}
/*添加图片*/
function upimg(obj) {
	var imgFile = obj.files[0];
	var img = new Image();
	var fr = new FileReader();
	fr.onload = function() {
		var htmlStr = '<div class="filePic"><input type="file" accept="image/gif,image/jpeg,image/jpg,image/png,image/svg" onchange="upimg(this)" class="fileimg_f" /><img src="' + fr.result + '" alt="" class="fileimg_imgs"/><img src="../img/ca1.png" class="fileimg_del" onclick="fileimg_del(this)" /></div>'
		if($(obj).parents('.imgOnloadWrap').find(".filePic").length == 1) {
			$(obj).parents('.imgOnloadWrap').find(".filePic").eq(0).hide()
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
	if($(".refund_good").attr("ref") == undefined) {
		$(".cue_box").text("服务类型未选择").fadeIn(500).delay(1).fadeOut(500);
	} else if($(".refund_go").attr("ref") == undefined) {
		$(".cue_box").text("申请原因未选择").fadeIn(500).delay(1).fadeOut(500);
	} else if($(".refund_val textarea").val().length < 6) {
		$(".cue_box").text("问题描述字数至少为六个字").fadeIn(500).delay(1).fadeOut(500);
	} else {
		//跳转
		window.location.href = 'order.html';
	}
}