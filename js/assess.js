//评价等级
function pin(ob) {
	$(".pin").removeClass("pin_good")
	$(ob).addClass("pin_good");
}
/*添加图片*/
function upimg(obj) {
	var imgFile = obj.files[0];
	var img = new Image();
	var fr = new FileReader();
	fr.onload = function() {
		var htmlStr = '<div class="filePic"><input type="file" accept="image/gif,image/jpeg,image/jpg,image/png,image/svg" onchange="upimg(this)" class="fileimg_f" /><img src="' + fr.result + '" alt="" class="fileimg_imgs"/><img src="../img/ca1.png" class="fileimg_del" onclick="fileimg_del(this)" /></div>'
		if($(obj).parents('.imgOnloadWrap').find(".filePic").length <= 4) {
			$(obj).parents('.imgOnloadWrap').append(htmlStr);
			$(obj).parents('.imgOnloadWrap').find(".fileimg_num").text($(obj).parents('.imgOnloadWrap').find(".filePic").length - 1)
		} else if($(obj).parents('.imgOnloadWrap').find(".filePic").length == 5) {
			$(obj).parents('.imgOnloadWrap').find(".filePic").eq(0).hide()
			$(obj).parents('.imgOnloadWrap').append(htmlStr);
			$(obj).parents('.imgOnloadWrap').find(".fileimg_num").text($(obj).parents('.imgOnloadWrap').find(".filePic").length - 1)
		} else {
			$(".cue_box").text("最多只能传五张图片").fadeIn(500).delay(1).fadeOut(500);
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
//提交评价
function assess() {
	if($(".evaluate_body").find("textarea").val().length < 6) {
		$(".cue_box").text("评价的字数少于六个字").fadeIn(500).delay(1).fadeOut(500);
	} else {
		//取值
		var comm = $(".pin_good").attr("pin") //0为好评，1为中评，2为差评
		var txt	 = $(".evaluate_body").find("textarea").val() //取到了评价
		var img  = ""  //图片
		var len  = $(".filePic").length
		
		for(i=1;i<len;i++){
			if(i=len-1){
				img += $(".filePic").eq(i).find(".fileimg_imgs").attr("src");
			}
			else{
				img += $(".filePic").eq(i).find(".fileimg_imgs").attr("src")+","
			}
		}
		//ajax
		
		//跳转
		window.location.href = 'order.html'
	}
}