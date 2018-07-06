$(window).resize(function() { /*浏览器可视区域变化*/
	//幻灯片图片自适应
	$(".ad").css("width", document.body.clientWidth)
	$(".ad_b").height($(".ad_ul li img").height())
});
window.onload = function() {
	//幻灯片图片自适应
	$(".ad").css("width", document.body.clientWidth)
	$(".ad_b").height($(".ad_ul li img").height())
	//
	spec_l()
	
}
$(document).ready(function() {
	//规格默认
	spec_mo()
	//评论好评率
	evaluate_ratio()
	//默认规格
	$("#norms").text("");
	
})

/*运动图片*/
function slide() {
	//轮播图
	var times1 = null;
	var num = $(".ad_ul").find("li").length
	var numq = (num + 2) * document.body.clientWidth
	$(".ad_ul").css("width", "" + numq + "+px")
	////加入尾图片
	strhtml = '<li ><img src="' + $(".ad_ul li").eq(0).find("img").attr("src") + '" class="ad" /></li>'
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
	for(i = 0; i < num; i++) {
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
			sp = sp + 1
			if(sp == num) {
				sp = 0
			}
		} else {
			$(".ad_ul").css("left", "" + (dir) * (num) + "px")
			lef = (dir) * (num - 1)
			//点返回最后第一位
			sp = 0
		}
		//点付于class
		$(".ad_spot_b").find(".ad_spot").removeClass("ad_spot1")
		$(".ad_spot_b li").eq(sp).find(".ad_spot").addClass("ad_spot1")
	}, 4000);
}
/*加入购物车*/
//叉
function del() {
	$('html,body').removeClass('ovfHiden'); //使网页恢复可滚
	$(".black").hide()
}
//选择规格
function spec(ob,num) {
	$("#intro_shop_num").text(num.toFixed(2))
	$(".black_spec_list").removeClass("black_spec_o")
	$(ob).addClass("black_spec_o")
	spec_l()
}
//默认第一个规格为默认
function spec_mo() {
	$(".black_spec_list").eq(0).addClass("black_spec_o")
}
//显示black
function black_show() {
	$('html,body').addClass('ovfHiden'); //使网页不可滚动
	$(".black").show()
}
//减
function minus() {
	var num = parseInt($("#number").val())
	if(num >= 2) {
		$("#number").val(num - 1)
	}
}
//加
function add() {
	var num = parseInt($("#number").val())
	$("#number").val(num + 1);
}
/*foot*/
//收藏
function collection(ob) {
	if($(ob).find("p").text() == "收藏") {
		$(ob).find("img").attr("src", "../img/xin (2).png")
		$(ob).find("p").text("已收藏").css("color","#cc0000")
	} else {
		$(ob).find("img").attr("src", "../img/xin (1).png")
		$(ob).find("p").text("收藏").css("color","#666")
	}

}
/*头部分类*/
function intro(ob, obj) {
	$(".commodity_top").find("h4").removeClass("comm_on")
	$(ob).addClass("comm_on")

	$(".body_o").hide()
	$(obj).show()
}
/*评价*/
function evaluate_ratio() {
	var num1 = 0
	var num2 = parseInt($("#evaluate_num2").text())
	var num3 = parseInt($(".evaluate_score").find("span").eq(2).find("label").text())
	var num4 = parseInt($(".evaluate_score").find("span").eq(3).find("label").text())
	$("#evaluate_num1").text(num2+num3+num4);
	num1 = $("#evaluate_num1").text();
	if(num1!=0){
		$("#evaluate_num0").text(parseInt(num2 / (parseInt($("#evaluate_num1").text())) * 100))
	}
	else{
		$("#evaluate_num0").text(0)
	}
	
}
/*动画效果*/
function anima() {
	$(".intro_shop_anima").css("top", "-50px")
	$(".intro_shop_anima").show().animate({ top: "-5px" });
	setTimeout('$(".intro_shop_anima").hide()', 500);
}
/*规格选择*/
function spec_l() {
	$(".black_spec_l").remove()
	$(".black_spec_o").append('<img src="../img/sys_item.gif" class="black_spec_l"/>')
}
/*显示在页面中*/
function norms(){
	$("#norms").text($(".black_spec_o").text())
}
/*加入购物车*/
function add_but(){
	//ajax
	$.ajax({
		url: 'http://192.168.0.101/ywyf-weixin/cart/addToCart', //地址
		dataType: "json",
		type: "post",
		timeout: 50000,
		xhrFields: {
			withCredentials: true
		},
		data:'skuId='+$(".black_spec_o").attr("skuId")+'&amount='+$("#number").val()+'&preId='+$(".commodity_body1").attr("preid"),
		success: function(data) {
			//console.log(JSON.stringify(data))
			if(data.status == 1) {
				//动画效果
				anima()
				norms()
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
