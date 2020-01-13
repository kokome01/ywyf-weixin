//查看订单详细
/*function height(ob) {
	if($(ob).attr("hei") == "1") {
		$(ob).removeClass("order_tc_height");
		$(ob).attr("hei", 0)
	} else if($(ob).attr("hei") == "0") {
		$(ob).addClass("order_tc_height")
		$(ob).attr("hei", 1)
	}
}*/
//催单
function urge(ob) {
	var times = null;
	var sec = 0;
	if($(ob).attr("urge") == 1) {
		$(ob).text("已催单")
		times = setInterval(function() {
			if(sec >= 100) {
				clearInterval(times);
				$(ob).attr("urge", 1);
				$(ob).text("催单")
			} else {
				sec = sec + 1;
				$(ob).attr("urge", 0)
			}
		}, 1000)
	} else {
		alert("已经催过单了，请稍等");
	}
}
//已完成订单的菜单栏点击
function order_menu(ob) {
	$(".order_menu_list").removeClass("order_menu_on")
	$(ob).addClass("order_menu_on");
	//ajax
	ajax(1, $(ob).text(), "#payment_2")
}
//设置
function set_up() {
	$("#set_up").slideToggle();
}
//ajax
function ajax(page, type, ul) {
	console.log(web_url + '/ywyf-weixin/spmkt/myOrder?type='+type+'&userId=17&pageNo='+page)

	$.ajax({
		url: web_url + '/ywyf-weixin/spmkt/myOrder?type=' + type +  '&pageNo=' + page, //地址
		dataType: "json",
		type: "post",
		xhrFields: {
			withCredentials: true
		},
		timeout: 50000,
		success: function(data) {
			console.log(JSON.stringify(data));
			if(data.msg == "请登录") {
				//alert("你尚未登录")
				window.location.href = '../other/login.html'
			} else {
				var strhtml1 = "";
				var strhtml2 = "";
				var strhtml3 = "";
				for(i = 0; i < data.myOrder.list.length; i++) {
					if(type == "待支付") {
						strhtml3 = '<span onclick="to_pay(this)">去支付</span>'
					} else if(type == "已支付") {
						strhtml3 = '<span onclick="urge(this)" urge = "1">催单</span>'
					} else if(type == "待评价") {
						strhtml3 = '<span onclick="to_store(this)">再次购买</span><span onclick="to_evaluate(' + data.myOrder.list[i].id + ')">评价</span><span onclick="to_after_sales()">申请售后</span>'
					} else if(type == "已完成") {
						strhtml3 = '<span onclick="to_store(this)">再次购买</span><span onclick="to_after_sales()">申请售后</span>'
					} else if(type == "售后中") {
						strhtml3 = '<span onclick="cancel_after_sales()">取消售后</span>'
					} else if(type == "已取消") {
						strhtml3 = '<span onclick="to_store(this)">再次购买</span>'
					}
					strhtml2 = ""
					for(j = 0; j < data.myOrder.list[i].spmktOrderProducts.length; j++) {
						strhtml2 += '<li class="order_tc_li" commId="' + data.myOrder.list[i].spmktOrderProducts[j].spmktProducts.id + '"><span>' +
							data.myOrder.list[i].spmktOrderProducts[j].spmktProducts.name +
							'</span><span class="comm_num">x<span class="order_comm_num">' +
							data.myOrder.list[i].spmktOrderProducts[j].num +
							'</span></span><span>￥<span class="order_comm_price">' +
							data.myOrder.list[i].spmktOrderProducts[j].price +
							'</span></span></li>'
					}
					strhtml1 += '<li class="order_li" supermarketId=' +
						data.myOrder.list[i].supermarketId +
						' addressId="' + data.myOrder.list[i].addressId + '" oid="' + data.myOrder.list[i].id + '"><img src="' +
						data.myOrder.list[i].images +
						'" onerror="javascript:this.src=' + "'../img/TB.jpg'" + '"/><div class="order_text" onclick="window.location.href='+"'../store/store_store.html?id="+data.myOrder.list[i].supermarketId+"'"+'"><span class="order_t_name">' +
						data.myOrder.list[i].supermarket +
						'</span><div class="store_img order_i_right"></div><span  class="order_t_state">' +
						data.myOrder.list[i].status +
						'</span><div class="order_t_commodity"><div class="store_img order_i_bottom"></div><ul class="order_tc_ul order_tc_height"  hei="1">' +
						strhtml2 +
						'</ul></div><p class="order_t_balance">共<span>' +
						data.myOrder.list[i].spmktOrderProducts.length +
						'</span>件产品，运费<span>' +
						data.myOrder.list[i].spmktmailfees[0].price +
						'<span>，实际付款<span>￥</span><span class="order_payment">' +
						"" +
						'</span></p></div><div class="order_t_button">' +
						strhtml3 +
						'</div></li>'
				}
				if(page == 1) {
					$(ul).empty().append(strhtml1)
				} else if(page > 1) {
					$(ul).append(strhtml1)
				}
				//如果进行中的订单没有值
				if($(".payment_1").find("li").length == 0) {
					$("#payment_1_head").hide()
				}
				//计算实付款
				for(i = 0; i < $(".order_li").length; i++) {
					var pay = parseFloat(0);
					for(j = 0; j < $(".order_li").eq(i).find(".order_tc_li").length; j++) {
						pay += parseFloat($(".order_li").eq(i).find(".order_tc_li").eq(j).find(".order_comm_num").text()) * parseFloat($(".order_li").eq(i).find(".order_tc_li").eq(j).find(".order_comm_price").text())
					}
					$(".order_payment").eq(i).text(pay.toFixed(2))
				}
				//判断是否为空
				if($("#payment_2").html()==""){
					$("#payment_2").html('<div class="payment_zero"></div>');
					
				}
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
$(document).ready(function() {
	ajax(1, "已支付", "#payment_1");
	ajax(1, "待支付", "#payment_2");
	//下拉加载
	var page = 0;
	$(window).scroll(function() {
		if($(window).scrollTop() + $(window).height() + 5 > $(document).height()) {
			page += 1
			ajax(page)
		}
	});
})
//去支付
function to_pay(ob) {
	$.ajax({
		url: web_url + '/ywyf-weixin/weixinpay/wxSpmktPay?oids=' + $(ob).parents(".order_li").attr("oid"), //地址
		dataType: "json",
		type: "post",
		xhrFields: {
			withCredentials: true
		},
		timeout: 50000,
		success: function(data1) {
			console.log(JSON.stringify(data1));
			var appId = data1.wxPagePay.map.appId;
			var timeStamp = data1.wxPagePay.map.timeStamp;
			var nonceStr = data1.wxPagePay.map.nonceStr;
			var package1 = data1.wxPagePay.map.package;
			var signType = "MD5";
			var paySign = data1.wxPagePay.map.sign2;
			//var total_fee = data.totalFee;
			if(typeof WeixinJSBridge == "undefined") {
				if(document.addEventListener) {
					document.addEventListener('WeixinJSBridgeReady', jsApiCall, false);
				} else if(document.attachEvent) {
					document.attachEvent('WeixinJSBridgeReady', jsApiCall);
					document.attachEvent('onWeixinJSBridgeReady', jsApiCall);
				}
			} else {
				WeixinJSBridge.invoke(
					'getBrandWCPayRequest', {
						"appId": appId, //公众号名称，由商户传入
						"timeStamp": timeStamp, //时间戳，自1970年以来的秒数
						"nonceStr": nonceStr, //随机串
						"package": package1,
						"signType": "MD5", //微信签名方式：
						"paySign": paySign //微信签名
					},

					function(res) {
						WeixinJSBridge.log(res.err_msg);
						//(res.err_msg);
						//alert(JSON.stringify(res));
						if(res.err_msg == "get_brand_wcpay_request:ok") {
							window.location.replace("/ywyfwx/store/store_order.html");
							/* $.ajax({
			                                    url:'"www.51wyfy.com/ywyfwx"',
			                                    dataType:'json',
			                                    success:function(data){
													if(data.status==1){
														window.location.replace("www.51wyfy.com/ywyfwx");
													}
			                                    }
			                                })*/
							//window.location.replace("{$callbackurl}");
						} else if(res.err_msg == "get_brand_wcpay_request:cancel") {
							// message: "已取消微信支付!"
							alert("已取消微信支付!")
							window.location.replace("/ywyfwx/store/store_order.html");
						} else {
							alert("支付异常！")
							window.location.replace("/ywyfwx/store/store_order.html");
						}
					}
				);
			}

			window.location.href = 'store_order.html'
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			//alert(XMLHttpRequest.status);
			//alert(XMLHttpRequest.readyState);
			//alert(textStatus);
			console.log("网络请求失败，请联系网站管理员!");
		},
	})

}
//去商店
function to_store(ob) {
	window.location.href = 'store_store.html?id=' + $(ob).parents(".order_li").attr("supermarketId");
}
//去评价
function to_evaluate(ob, oid) {
	localStorage.removeItem('store_evaluate');
	var store_evaluate = {};
	var store_commodity = [];
	store_evaluate.store_name = $(ob).parents(".order_li").find(".order_t_name").text();
	store_evaluate.store_img = $(ob).parents(".order_li").children("img").attr("src");
	store_evaluate.store_commodity = store_commodity;
	for(i = 0; i < $(ob).parents(".order_li").find(".order_tc_li").length; i++) {
		store_commodity.push({
			"comm_name": $(ob).parents(".order_li").find(".order_tc_li").eq(i).find("span").eq(0).text(),
			"comm_num": $(ob).parents(".order_li").find(".order_tc_li").eq(i).find(".comm_num").text()
		})
	}
	localStorage.store_evaluate = JSON.stringify(store_evaluate)
	console.log(localStorage.store_evaluate);
	window.location.href = 'store_evaluate.html?oid=' + oid;
}
//去售后
function to_after_sales() {

}
//取消售后
function cancel_after_sales() {

}