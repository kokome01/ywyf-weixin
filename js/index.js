$(window).resize(function() { /*浏览器可视区域变化*/
	//幻灯片图片自适应
	$(".ad").css("width", document.body.clientWidth)
	$(".ad_b").height($(".ad_ul li img").height())
});
window.onload = function() {
	//幻灯片图片自适应
	$(".ad").css("width", document.body.clientWidth)
	$(".ad_b").height($(".ad_ul li img").height())
	//幻灯片
	
}

/*运动图片*/
function slide() {
	//轮播图
	var times1 = null;
	var num = $(".ad_ul").find("li").length
	var numq = (num + 2) * document.body.clientWidth
	$(".ad_ul").css("width", "" + numq + "+px")
	////加入尾图片
	strhtml = '<li onclick="window.location.href='+'person/blog.html'+'">'+$(".ad_ul").find("li").eq(0).html()+"</li>" 
	$(".ad_ul").append(strhtml)

	var wi = document.body.clientWidth //图片的宽度
	var dir = (-1) * wi
	var times = null;
	$(".ad_ul").css("left", "" + (dir) * (num) + "px")
	var lef = (dir) * (num - 1)
	////图片点
	$(".ad_spot_b").empty()
	var spothtml = ""
	var sp = 0
	for(i=0;i<num;i++){
		spothtml += '<li><div class="ad_spot" ></div></li>'
	}
	$(".ad_spot_b").append(spothtml)
	$(".ad_spot_b").find(".ad_spot").removeClass("ad_spot1")
	$(".ad_spot_b li").eq(sp).find(".ad_spot").addClass("ad_spot1")
	
	times = setInterval(function() {
		if(lef < 10) {
			$(".ad_ul").animate({ left: "" + (lef) + "px" });
			lef = lef - dir
			//判断点是否到最后一位
			sp = sp+1
			if(sp == num){
				sp  = 0
			}
		} else {
			$(".ad_ul").css("left", "" + (dir) * (num) + "px")
			lef = (dir) * (num - 1)
			//点返回最后第一位
			sp  = 0
		}
		//点付于class
		$(".ad_spot_b").find(".ad_spot").removeClass("ad_spot1")
		$(".ad_spot_b li").eq(sp).find(".ad_spot").addClass("ad_spot1")
	}, 2000);
}
/*新闻*/
function news() {
	var nw = 1
	times3 = null
	var len = $(".hot_new_b").length
	times3 = setInterval(function() {
		if(len == 1){
			
		}
		else if(nw == len) {
			$(".hot_new_box1").find(".hot_new_b").animate({ top: "-19px" });
			$(".hot_new_box1").find(".hot_new_b").eq(len - 1).animate({ top: "0px" });
			nw = 1
		} else {
			$(".hot_new_box1").find(".hot_new_b").animate({ top: "-19px" });
			$(".hot_new_box1").find(".hot_new_b").eq(nw - 1).animate({ top: "0px" });
			nw = nw + 1
		}
	}, 3000)
}
//推荐的轮播
function reco(){
	//赋值
	var str = ""
	for(i=0;i<6;i++){
		str += "<li>"+$(".activity_b_ul").find("li").eq(i).html()+"</li>"
	}
	$(".activity_b_ul").append(str)
	
	//轮播
	times4 = null
	var ran = -110
	var min = (8+1)*(-110)  //8个
	times4=setInterval(function(){
			if(ran <= min){
				ran = 0
				$(".activity_b_ul").css("left","0px");
				ran = ran-110
				$(".activity_b_ul").animate({left:""+ran+"px"});
				ran = ran-110
			}
			else{
				$(".activity_b_ul").animate({left:""+ran+"px"});
				ran = ran-110
			}
	},1000)
	
}
//高