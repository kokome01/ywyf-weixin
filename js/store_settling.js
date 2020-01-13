$(document).ready(function() {
	//ajax
	ajax()
})
//备注
function other() {
	$(".other").show();
	$(".other_text").find("textarea").val($(".other_txt").text())
}

function other_complete() {
	$(".other_txt").text($(".other_text").find("textarea").val());
	$(".other").hide();
	$(".other_text").find("textarea").val("")
}

function other_del() {
	$(".other").hide();
	$(".other_text").find("textarea").val("")
}
//发票
function invoice() {
	if($("#settling_invoice_box").attr("inv") == 0) {
		$("#settling_invoice").animate({
			left: "20px"
		});
		$("#settling_invoice_box").css("background-color", "#0A79E5");
		$("#settling_invoice_box").attr("inv", "1");
	} else if($("#settling_invoice_box").attr("inv") == 1) {
		$("#settling_invoice").animate({
			left: "0px"
		});
		$("#settling_invoice_box").css("background-color", "#999");
		$("#settling_invoice_box").attr("inv", "0");
	}
}
//数据统计
function settling() {
	var plan1 = parseFloat(0);
	var plan2 = parseFloat(0);
	var plan3 = parseFloat(0);
	for(i = 0; i < $(".settling_commodity_ul").find("li").length; i++) {
		plan1 += parseFloat($(".settling_commodity_price_num").eq(i).text()) * parseFloat($(".settling_commodity_num_z").eq(i).text())
	}
	plan2 = parseFloat($("#transport_cost").text());
	console.log()
	//plan3 = parseFloat($("#discount_cost").text())
	//优惠
	$("#discount_plan").text(plan3.toFixed(2))
	//小计
	if((plan1 + plan2) >= parseFloat($("#settling_discount").attr("over"))) {
		$("#small_plan").text((plan1 + plan2).toFixed(2));
	} else {
		$(".stroke_de").addClass("stroke");
		$(".stroke_del").hide()
		$("#small_plan").text((plan1 + plan2).toFixed(2));
	}
	//总计
	$("#big_plan").text((plan1 + plan2).toFixed(2));
}
//ajax
function ajax() {
	//如果登录，就把默认地址加到地址中去
	$.ajax({
		url: web_url + '/ywyf-weixin/user/mailList', //地址
		dataType: "json",
		type: "post",
		timeout: 50000,
		xhrFields: {
			withCredentials: true
		},
		success: function(data) {
			console.log(JSON.stringify(data));
			if(data.status == 1) {
				for(i = 0; i < data.mailLists.length; i++) {
					if(data.mailLists[i].isDefault) {
						$(".settling_address1").text(data.mailLists[i].address);
						$(".settling_address2").find("span").eq(0).text(data.mailLists[i].name);
						$(".settling_address2").find("span").eq(2).text(data.mailLists[i].tel);
						var set_address = {};
						set_address.addressId = data.mailLists[i].id;
						sessionStorage.set_address = JSON.stringify(set_address)
					}
				}
			} else {
				/*alert("请登录");
				window.location.href = '../other/login.html';*/
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			//console.log(XMLHttpRequest.status);
			//console.log(XMLHttpRequest.readyState);
			//console.log(textStatus);
			console.log("网络请求失败，请联系网站管理员!");
		},
	})
	//加载药店
	if(getQueryString("spmktId") == null) {
		window.location.href = 'store_index.html'
	} else {
		//加载页面
		var set_data = JSON.parse(localStorage.json_shop);
		console.log(localStorage.json_shop)
		var strhtml = "";
		for(i = 0; i < set_data.store.length; i++) {
			if(set_data.store[i].id == getQueryString("spmktId")) {
				for(j = 0; j < set_data.store[i].commodity.length; j++) {
					strhtml += '<li class="settling_commodity_li"><img src="' +
						set_data.store[i].commodity[j].img +
						'"/><div class="settling_commodity_text"><p class="settling_commodity_name">' +
						set_data.store[i].commodity[j].name +
						'<span class="settling_commodity_price ">￥<span class="settling_commodity_price_num ">' +
						set_data.store[i].commodity[j].price +
						'</span></span></p><p class="settling_commodity_num">x<span class="settling_commodity_num_z">' +
						set_data.store[i].commodity[j].num +
						'</span></p></div></li>'
				}
				$(".commodity_shop").text();
				//加载配送费用
				if(set_data.store[i].baoyou[0].postage==""){
					$("#transport_cost").text(parseFloat(0))
				}else{
					$("#transport_cost").text(set_data.store[i].baoyou[0].postage)
				}
			}
		}
		$(".settling_commodity_ul").empty().append(strhtml)
		
		
		//统计数据
		settling()
		//加载地址
		if(sessionStorage.set_address == undefined) {
			$(".settling_address2").find("span").eq(2).text("暂无选择地址");
		} else {
			var set_address = JSON.parse(sessionStorage.set_address);
			//console.log(sessionStorage.set_address)
			$(".settling_address1").text(set_address.addressAddress);
			$(".settling_address2").find("span").eq(0).text(set_address.addressName)
			$(".settling_address2").find("span").eq(1).text("    ")
			$(".settling_address2").find("span").eq(2).text(set_address.addressTel)
		}

	}

}
//地址
function address() {
	window.location.href = '../other/adddress.html?html=1&spmktId=' + getQueryString("spmktId")
}
//下单
function place() {
	if(sessionStorage.set_address == undefined) {
		alert("请选择地址")
	} else {
		//触发关闭立即支付的按钮防止多次点击
		$(".store_balance").attr("onclick",'console.log("支付中...")').css("background-color","#666");
		$(".store_balance").find("p").text("支付中...")
		//支付
		var productList = "";
		var set_data = JSON.parse(localStorage.json_shop);
		var set_address = JSON.parse(sessionStorage.set_address);
		console.log(sessionStorage.set_address)
		for(i = 0; i < set_data.store.length; i++) {
			if(set_data.store[i].id==getQueryString("spmktId")){
				for(j = 0; j < set_data.store[i].commodity.length; j++) {
					productList += set_data.store[i].commodity[j].id + "," + set_data.store[i].commodity[j].price + "," + set_data.store[i].commodity[j].num + ";"
				}
			}
			
		}
		//
		productList = productList.substring(0, productList.length - 1)
		console.log(web_url + '/ywyf-weixin/spmkt/applyOrder?spmktId=' + getQueryString("spmktId") + '&productList=' + productList + '&addressId=' + set_address.addressId + '&info=' + $("#other_txt").text())
		//传值
		$.ajax({
			url: web_url + '/ywyf-weixin/spmkt/applyOrder?spmktId=' + getQueryString("spmktId") + '&productList=' + productList + '&addressId=' + set_address.addressId + '&info=' + $("#other_txt").text(), //地址
			dataType: "json",
			type: "post",
			xhrFields: {
				withCredentials: true
			},
			timeout: 50000,
			success: function(data) {
				console.log(JSON.stringify(data))
				//订单生成成功后，跳转回去，并且吧数据当前数据清除
				for(i = 0; i < set_data.store.length; i++) {
					if(set_data.store[i].id == getQueryString("spmktId")) {
						set_data.store.splice(i, 1)
					}
				}
				localStorage.json_shop = JSON.stringify(set_data)
				if(data.status == 1) {
					//console.log(data.oid)
					$.ajax({
						url: web_url + '/ywyf-weixin/weixinpay/wxSpmktPay?oids=' + data.oid, //地址
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
										//alert(res.err_msg);
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
							//console.log(XMLHttpRequest.status);
							//console.log(XMLHttpRequest.readyState);
							//console.log(textStatus);
							console.log("网络请求失败，请联系网站管理员!");
						},
					})
				} else {
					alert("支付异常，请联系网站客服");
					window.location.replace("/ywyfwx/store/store_order.html");
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				//console.log(XMLHttpRequest.status);
				//console.log(XMLHttpRequest.readyState);
				//console.log(textStatus);
				console.log("网络请求失败，请联系网站管理员!");
			},
		})
	}

}