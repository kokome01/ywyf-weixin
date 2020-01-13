$(document).ready(function() {
	//旧ajax
	var strhtml = "",
		mailFee = ""
	$.ajax({
		url: web_url + '/ywyf-weixin/user/myNewPrescription?id=' + getQueryVariable("id"), //地址
		dataType: "json",
		type: "post",
		timeout: 50000,
		xhrFields: {
			withCredentials: true
		}, //跨域产生问题（跨域请求设置withCredentials）登录，退出登录
		beforeSend: function(XMLHttpRequest) {
			loding1("A3");
		},
		success: function(data) {
			console.log(data)
			var info = JSON.parse(data.DocPrescriptions.productInfo);
			sessionStorage.prescriptionId = data.DocPrescriptions.orderId;
			sessionStorage.docId = data.DocPrescriptions.docId;
			console.log(sessionStorage.docId)
			if(info[0].pic==undefined||info[0].pic=='undefined'){
				$(".login_head").attr("docId", data.DocPrescriptions.docId)
				$(".login_head").attr("userId", data.DocPrescriptions.userId)
				for(i = 0; i < info.length; i++) {
					strhtml += '<li class="shop_list_l" proid="' + info[i].id + '" uid="' +
						info[i].specId +
						'"><input type="checkbox" checked="checked" name="" id="" value="" onclick="commodity(this)" uname="0" /><div class="shop_list_text"><img src="http://www.51ywyf.com/photo/upload/' +
						info[i].img +
						'" /><p>' +
						info[i].name +
						'</p><p class="shop_list_t1">规格：<span >' +
						info[i].spec +
						'</span></p><p class="shop_list_t2">￥<span class="shop_price">' +
						info[i].price.toFixed(2) +
						'</span></p><div class="shop_list_but"><span>x</span><span class="shop_num">' +
						info[i].num +
						'</span></div></div></li>'
	
					addShop(info[i].specId, info[i].num, info[i].id)
				}
			}else{
				$(".login_head").attr("docId", data.DocPrescriptions.docId)
				$(".login_head").attr("userId", data.DocPrescriptions.userId)
				for(i = 0; i < info.length; i++) {
					strhtml += '<li class="shop_list_l" proid="' + info[i].proid + '" uid="' +
						info[i].id +
						'"><input type="checkbox" checked="checked" name="" id="" value="" onclick="commodity(this)" uname="0" /><div class="shop_list_text"><img src="' +
						info[i].pic +
						'" /><p>' +
						info[i].name +
						'</p><p class="shop_list_t1">规格：<span >' +
						info[i].spec +
						'</span></p><p class="shop_list_t2">￥<span class="shop_price">' +
						info[i].price.toFixed(2) +
						'</span></p><div class="shop_list_but"><span>x</span><span class="shop_num">' +
						info[i].num +
						'</span></div></div></li>'
	
					addShop(info[i].id, info[i].num, info[i].proid)
				}
			}
			
			//运费
			/*if(data.proShops[i].buyerItems[0].product.mailFee == null) {
				mailFee = "免运费"
			} else {
				mailFee = "运费：￥" + data.proShops[i].buyerItems[0].product.mailFee
			}*/
			$(".body").empty().append(strhtml);
			//总计
			zhonji()
			//记录是否关注
			if(data.subscribe == 1) { //已经关注
				localStorage.subscribe = 1;
			} else if(data.subscribe == 0) {
				localStorage.subscribe = 0;
			}
		},
		complete: function(XMLHttpRequest, textStatus) {
			loding2()
			// alert('远程调用成功，状态文本值：'+textStatus);
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			console.log("网络请求失败，请联系网站管理员!");
			//getcode()
		},
	})
})
/*加载完毕后执行*/
window.onload = function() {

}

//加入购物车
function addShop(skuId, amount, preId) {
	console.log(skuId + ',' + amount + ',' + preId)
	//加入购物车
	$.ajax({
		url: web_url + '/ywyf-weixin/cart/addToCart', //地址
		dataType: "json",
		type: "post",
		timeout: 50000,
		xhrFields: {
			withCredentials: true
		}, //跨域产生问题（跨域请求设置withCredentials）登录，退出登录
		data: 'skuId=' + skuId + '&amount=' + amount + '&preId=' + preId,
		beforeSend: function(XMLHttpRequest) {
			loding1("A3");
		},
		success: function(data) {
			console.log(JSON.stringify(data))
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			console.log("2.网络请求失败，请联系网站管理员!");
			//getcode()
		},
	})
}

/*单商品选择*/
function commodity(ob) {
	if($(ob).attr("uname") == "0") {
		
		$(ob).attr("uname", "1");
	} else {
		$(ob).attr("uname", "0");
	}
	//判断厂商下的商品是否全选
	factory_u(ob)
	//判断是否全选
	big_box_u()
	//改变总计
	zhonji()
}
/*产商选择*/
function factory(ob) {
	if($(ob).attr("uname") == "0") {
		$(ob).attr({
			"checked": "checked",
			"uname": "1"
		});
		$(ob).parents(".shop_list").find(".shop_list_l input").attr({
			"checked": "checked",
			"uname": "1"
		});
	} else {
		$(ob).removeAttr("checked");
		$(ob).attr("uname", "0");
		$(ob).parents(".shop_list").find(".shop_list_l input").removeAttr("checked");
		$(ob).parents(".shop_list").find(".shop_list_l input").attr("uname", "0");
	};
	//判断是否全选
	big_box_u()
	zhonji()
}
/*判断厂商下的商品是否全选*/
function factory_u(ob) {
	var nu = 0
	var ew = $(ob).parents(".shop_list").find(".shop_list_l");
	for(i = 0; i < ew.length; i++) {
		if(ew.eq(i).find("input").attr("uname") == "1") {
			nu = nu + 1
		}
	}
	if(nu == ew.length) {
		$(ob).parents(".shop_list").find(".shop_list_head input").attr({
			"checked": "checked",
			"uname": "1"
		});
	} else {
		$(ob).parents(".shop_list").find(".shop_list_head input").removeAttr("checked");
		$(ob).parents(".shop_list").find(".shop_list_head input").attr("uname", "0");
	}
}
/*全选*/
function big_box() {
	if($(".shop_balance input").attr("uname") == 0) {
		$(".shop_balance input").attr({
			"checked": "checked",
			"uname": "1"
		});
		for(i = 0; i < $(".shop_list").length; i++) {
			$(".shop_list").eq(i).find(".shop_list_head input").attr({
				"checked": "checked",
				"uname": "1"
			});
			$(".shop_list").eq(i).find("input[type='checkbox']").attr({
				"checked": "checked",
				"uname": "1"
			});
		}
	} else {
		$(".shop_balance input").removeAttr("checked");
		$(".shop_balance input").attr("uname", "0");
		for(i = 0; i < $(".shop_list").length; i++) {
			$(".shop_list").eq(i).find(".shop_list_head input").removeAttr("checked");
			$(".shop_list").eq(i).find(".shop_list_head input").attr("uname", "0");
			$(".shop_list").eq(i).find("input[type='checkbox']").removeAttr("checked");
			$(".shop_list").eq(i).find("input[type='checkbox']").attr("uname", "0");
		}
	}
	zhonji()
}
/*判断是否全选*/
function big_box_u() {
	var nu = 0
	var ew = $(".body").find(".shop_list");
	for(i = 0; i < ew.length; i++) {
		if($(".shop_list").eq(i).find(".shop_list_head input").attr("uname") == "1") {
			nu = nu + 1
		}
	}
	if(nu == ew.length) {
		$(".shop_balance input").attr({
			"checked": "checked",
			"uname": "1"
		});
	} else {
		$(".shop_balance input").removeAttr("checked");
		$(".shop_balance input").attr("uname", "0");
	}

}
/*点击结算*/
function result() {
	//结算
	var len = $(".shop_list_l").length;
	var sku = new Array();
	for(i = 0; i < len; i++) {
		sku[i] = $(".shop_list_l").eq(i).attr("uid");
	}
	localStorage.drug = sku;

	var name = "doc" + $(".login_head").attr("docId")
	send(name + "|可以跳转首页|0")
}
/*总计*/
function zhonji() {

	var zhong = 0;
	for(i = 0; i < $(".shop_list_l").length; i++) {
		var t1 = $(".shop_list_l").eq(i).find(".shop_price").text();
		var t2 = $(".shop_list_l").eq(i).find(".shop_num").text()
		zhong = zhong + (parseFloat(t1) * parseFloat(t2))

	}
	$(".zhongji").text(zhong.toFixed(2))
	//运费
	var mailFee = 0

	for(i = 0; i < $(".shop_list").length; i++) {
		if($(".shop_list").eq(i).find("label").text() == "免运费") {
			var fee = false
			for(z = 0; z < $(".shop_list").eq(i).find(".shop_list_l").length; z++) {
				if($(".shop_list").eq(i).find(".shop_list_l").eq(z).find("input[type='checkbox']").attr("uname") == 1) {
					fee = true;
				}
			}
			if(fee == true) {
				mailFee += parseFloat(0.00).toFixed(2);
			}

		} else {
			var fee = false
			for(z = 0; z < $(".shop_list").eq(i).find(".shop_list_l").length; z++) {
				if($(".shop_list").eq(i).find(".shop_list_l").eq(z).find("input[type='checkbox']").attr("uname") == 1) {
					fee = true;
				}
			}
			if(fee == true) {
				mailFee += parseFloat($(".shop_list").eq(i).find("label").text()).toFixed(2)
			}

		}
	}
	$("#mailFee").text(mailFee)
}
//获取到url的参数
function getQueryVariable(variable) {
	var query = window.location.search.substring(1);
	var vars = query.split("&");
	for(var i = 0; i < vars.length; i++) {
		var pair = vars[i].split("=");
		if(pair[0] == variable) {
			return pair[1];
		}
	}
	return(false);
}
//建立通信
var websocket = null;
//判断当前浏览器是否支持WebSocket
if('WebSocket' in window) {
	// id（user1:doc1） / 消息/ 是否是医生（不用在意）
	websocket = new WebSocket("ws://www.51ywyf.com/ywyf-weixin/websocket/user" + $(".login_head").attr("docId") + "/我是用户一/0");
} else {
	alert('当前浏览器 Not support websocket')
}

//连接发生错误的回调方法
websocket.onerror = function() {
	console.log("WebSocket连接发生错误");
};

//连接成功建立的回调方法
websocket.onopen = function() {
	console.log("WebSocket连接成功");

}

//接收到消息的回调方法
websocket.onmessage = function(event) {
	console.log("接收到消息");
}

//连接关闭的回调方法
websocket.onclose = function() {
	console.log("WebSocket连接关闭");
}

//监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
window.onbeforeunload = function() {
	closeWebSocket();
}

//关闭WebSocket连接
function closeWebSocket() {
	websocket.close();
}

//发送消息
function send(message) {
	websocket.send(message);
	alert("订单已经提交")
	window.location.href = 'pay.html'
}