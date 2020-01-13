$(document).ready(function() {
	$.ajax({
		url: web_url + '/ywyf-weixin/product/query?id='+getQueryString("id"), //地址
		dataType: "json",
		type: "post",
		timeout: 50000,
		success: function(data) {
			console.log(JSON.stringify(data))
			//l轮播滚动图
			var strhtml = "",
				prohtml = "",
				commhtml = ""
				
			if(data.product.pics != null) {
				for(i = 0; i < data.product.pics.length; i++) {
					strhtml += '<li><img src="' +
						data.product.pics[i] +
						'" class="ad" /></li>'
				}
			} else {
				strhtml = '<li><img src="' + data.product.pic + '" class="ad" /></li>'
			}
			$(".ad_ul").empty().append(strhtml);
			if($(".ad").length!=1){
				slide()
			}
			$(".ad").css({"width":document.body.clientWidth,"height":document.body.clientWidth})
			$(".ad_b").height(document.body.clientWidth);
			//是否为处方
			if(data.product.isCounter) {
				$(".commodity_body1").find("img").attr("src", "../img/ico_bs2.jpg");
				$("#commodity_isCounter").text("处方");
				var prescription = false;
				if(sessionStorage.prescription!=undefined&&sessionStorage.prescription!="undefined"){
				 	var data2 = JSON.parse(sessionStorage.prescription);
					for(o=0;o<data2.pre_nu.length;o++){
						if(data2.pre_nu[o].pre_id==getQueryString("id")){
							prescription = true;
						}	
					}
				}
				if(prescription){
					$(".intro_but").css("display","block");
					$(".intro_but_check").css("display","none");
				}else{
					$(".intro_but").css("display","none");
					$(".intro_but_check").css("display","block");
				}
				
			}else{
				$(".commodity_body1").find("img").attr("src", "../img/ico_bs1.jpg")
				$("#commodity_isCounter").text("非处方");
				$(".intro_but").css("display","block");
				$(".intro_but_check").css("display","none");
			}
			//商品名字
			$(".commodity_body1").find("h4").text(data.product.name);
			//商品价格
			$(".commodity_text_mo").text(data.product.skus[data.product.skus.length-1].price.toFixed(2));
			//商品运费
			if(data.product.freight == 0.0) {
				$("#commodity_freight").text("包邮")
			} else {
				$("#commodity_freight").text(data.product.freight.price);
			};
			//浏览量
			$("#commodity_zom1").text(data.product.clickNum);
			//累积销量
			$("#commodity_zom2").text(data.product.sales);
			//累积评价
			$("#commodity_zom3").text(data.disComments.good + data.disComments.mid + data.disComments.low);
			//生产厂家
			$("#commodity_fac_name").text(data.product.fac_name);
			//规格
			$("#commodity_specs").text(data.product.specs);
			//品牌
			if(data.product.brand_name == null) {
				$("#commodity_brand_name").text("无");
			} else {
				$("#commodity_brand_name").text(data.product.brand_name);
			}
			//药房
			$("#commodity_ph_name").text(data.product.ph_name);
			//批准文号
			$("#commodity_batchNum").text(data.product.batchNum);
			//剂型
			$("#commodity_dosage").text(data.product.dosage);
			//默认商品图片
			$(".black_img").find("img").attr("src", data.product.pic);
			//默认价格
			$("#intro_shop_num").text(data.product.skus[data.product.skus.length-1].price.toFixed(2));
			//规格
			for(i = 0; i < data.product.skus.length; i++) {
				prohtml += '<div class="black_spec_list" skuId="' +
					data.product.skus[i].id +
					'" onclick="spec(this,' +
					data.product.skus[i].price +
					')">' +
					data.product.skus[i].spec +
					'</div>'
			}
			$(".black_spec_b").empty().append(prohtml);
			$(".black_spec_b").find("div").eq(data.product.skus.length-1).addClass("black_spec_o");
			//评价名称
			$(".evaluate_name span").text($(".commodity_body1 h4").text());

			//好评
			$("#evaluate_num2").text(data.disComments.good)
			//中评
			$("#evaluate_num3").text(data.disComments.mid)
			//差评
			$("#evaluate_num4").text(data.disComments.low)
			//计算好评率
			evaluate_ratio()
			//清空评论详情
			//$(".evaluate_body ul").empty();
			for(i = 0; i < data.disComments.comments.length; i++) {
				commhtml = '<li><div class="user_head"><img src="' +
					data.disComments.comments[i].user.pic +
					'" /><p class="user_name">' +
					data.disComments.comments[i].user.nickname +
					'</p><span class="evaluate_time">评论于<label>' +
					formatDateTime(data.disComments.comments[i].addtime*1000) +
					'</label></span></div><div class="user_evaluate"><p>' +
					data.disComments.comments[i].content +
					'</p></div><div class="user_ass">评价：<span>' +
					great(0) +
					'</span></div></li>'
			}
			$(".evaluate_body ul").empty().append(commhtml)
			//产品细节
			$(".comm_details_img").html(data.product.description)
			//产品id
			$(".commodity_body1").attr("preId", data.product.id);
			//收藏
			if(data.isFavorite == 0) {
				$(".collection").attr("uname", "0");
				$(".collection").find("img").attr("src", "../img/xin (1).png");
				$(".collection").find("p").text("未收藏").css("color", "#666")
			} else {
				$(".collection").attr("uname", "1")
				$(".collection").find("img").attr("src", "../img/xin (2).png");
				$(".collection").find("p").text("已收藏").css("color", "#cc0000")
			}
			//
			add_num()
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			getcode()
		},
	})
})
//时间戳
function formatDateTime(inputTime) {
	var date = new Date(inputTime);
	var y = date.getFullYear();
	var m = date.getMonth() + 1;
	m = m < 10 ? ('0' + m) : m;
	var d = date.getDate();
	d = d < 10 ? ('0' + d) : d;
	var h = date.getHours();
	h = h < 10 ? ('0' + h) : h;
	var minute = date.getMinutes();
	var second = date.getSeconds();
	minute = minute < 10 ? ('0' + minute) : minute;
	second = second < 10 ? ('0' + second) : second;
	return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
}
//好评差评
function great(g) {
	var val = ""
	if(g == 0) {
		val = "好评"
	} else if(g == 1) {
		val = "中评"
	} else {
		val = "差评"
	}
	return val
}
$(window).resize(function() { /*浏览器可视区域变化*/
	//幻灯片图片自适应
	$(".ad").css({"width":document.body.clientWidth,"height":document.body.clientWidth})
	$(".ad_b").height(document.body.clientWidth)
});
window.onload = function() {
	//幻灯片图片自适应
	$(".ad").css({"width":document.body.clientWidth,"height":document.body.clientWidth})
	$(".ad_b").height(document.body.clientWidth)
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
			$(".ad_ul").animate({
				left: "" + (lef) + "px"
			});
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
	$(".black").hide();
	
}
//选择规格
function spec(ob, num) {
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
	//ajax
	$.ajax({
		url: web_url+"/ywyf-weixin/product/favorite", //地址
		dataType: "json",
		type: "post",
		xhrFields: {
			withCredentials: true
		},
		timeout: 50000,
		data: "proid=" + $(".commodity_body1").attr("preid") + "&isFavorite=" + $(".collection").attr("uname"),
		success: function(data) {
			if(data.msg == "请登录") {
				/*alert("请登录");
				window.location.href = '../other/login.html'*/
			} else {
				//成功
				console.log(JSON.stringify(data))
				if($(ob).find("p").text() == "未收藏") {
					$(ob).find("img").attr("src", "../img/xin (2).png");
					$(ob).find("p").text("已收藏").css("color", "#cc0000");
					$(".collection").attr("uname", "1")
				} else {
					$(ob).find("img").attr("src", "../img/xin (1).png");
					$(ob).find("p").text("未收藏").css("color", "#666");
					$(".collection").attr("uname", "0")
				}
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			getcode()
		},
	})

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
	$("#evaluate_num1").text(num2 + num3 + num4);
	num1 = $("#evaluate_num1").text();
	if(num1 != 0) {
		$("#evaluate_num0").text(parseInt(num2 / (parseInt($("#evaluate_num1").text())) * 100))
	} else {
		$("#evaluate_num0").text(0)
	}

}
/*动画效果*/
function anima() {
	$(".intro_shop_anima").css("top", "-50px")
	$(".intro_shop_anima").show().animate({
		top: "-5px"
	});
	setTimeout('$(".intro_shop_anima").hide()', 500);
	var shop_i =  parseInt($(".intro_shop_i").text()) ;
	$(".intro_shop_i").text(shop_i+parseInt($("#number").val()) )
	add_num()
	$("#number").val("1")
}
/*规格选择*/
function spec_l() {
	$(".black_spec_l").remove()
	$(".black_spec_o").append('<img src="../img/sys_item.gif" class="black_spec_l"/>')
}
/*显示在页面中*/
function norms() {
	$("#norms").text($(".black_spec_o").text())
}
/*加入购物车*/
function add_but() {
	console.log('skuId=' + $(".black_spec_o").attr("skuId") + '&amount=' + $("#number").val() + '&preId=' + $(".commodity_body1").attr("preid"))
	//ajax
	$.ajax({
		url: web_url + '/ywyf-weixin/cart/addToCart', //地址
		dataType: "json",
		type: "post",
		timeout: 50000,
		xhrFields: {
			withCredentials: true
		},
		data: 'skuId=' + $(".black_spec_o").attr("skuId") + '&amount=' + $("#number").val() + '&preId=' + $(".commodity_body1").attr("preid"),
		success: function(data) {
			//console.log(JSON.stringify(data))
			if(data.status == 1) {
				//动画效果
				anima()
				norms()
			} else {
				/*alert("请登录");
				window.location.href = 'login.html';*/
			}

		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			getcode()
		},
	})
}
function getUrl(para){
    var paraArr = location.search.substring(1).split('&');
    for(var i = 0;i < paraArr.length;i++){
        if(para == paraArr[i].split('=')[0]){
            return paraArr[i].split('=')[1];
        }
    }
    return '';
}
//判断购物车里面加入的数量
function add_num(){
	if($(".intro_shop_i").text()==0){
		$(".intro_shop_i").css("display","none")
	}
	else{
		$(".intro_shop_i").css("display","block")
	}
}
//需求登记
function prescription(){
	localStorage.prescription_name=$(".commodity_body1>h4").text();
	localStorage.prescription_price=$(".commodity_text_mo").text();
	$.ajax({
		url: web_url+'/ywyf-weixin/cart/toCart', //地址
		dataType: "json",
		type: "post",
		timeout: 50000,
		xhrFields: {
			withCredentials: true
		}, //跨域产生问题（跨域请求设置withCredentials）登录，退出登录
		success: function(data) {
			if(data.status == 1) {
				window.location.href='../other/prescription.html?id='+getQueryString("id")
			} else {
				/*alert("请登录");
				window.location.href = '../other/login.html'*/
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			getcode()
		},
	})
	
}
