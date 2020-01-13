$(document).ready(function() {
	var sku = ""
	if(localStorage.drug == undefined) { //无商品传入
		sku = ""
		//window.location.href = '../other/shop.html'
	} else {
		sku = localStorage.drug;
	}
	var skus = sku.split(",")
	console.log(skus)
	//ajax
	$.ajax({
		url: web_url + '/ywyf-weixin/cart/toVerfiyPro', //地址
		dataType: "json",
		type: "post",
		xhrFields: {
			withCredentials: true
		},
		timeout: 50000,
		data: 'ids=' + skus,
		success: function(data) {
			console.log(JSON.stringify(data));
			//console.log(data.msg)
			if(data.msg == "获取产品信息成功" || data.msg == "您购买的部分产品库存不足") {
				//地址
				var address = false;
				for(i = 0; i < data.mailLists.length; i++) {
					if(data.mailLists[i].isDefault) {
						address = true;
						$("#address_t_name").text(data.mailLists[i].name);
						$("#address_t_tel").text(data.mailLists[i].tel);
						$("#address_t_address").text(data.mailLists[i].address);
						$(".address").attr("tid", data.mailLists[i].id)
					}
				}

				if(address == false) {
					if(data.mailLists.length == 0) {
						$("#address_t_name").text("");
						$("#address_t_tel").text("");
						$("#address_t_address").html("尚未填写收货地址" + "<br/>" + "请新增收货地址");
						$(".address").attr("tid", "");
					} else {
						$("#address_t_name").text(data.mailLists[0].name);
						$("#address_t_tel").text(data.mailLists[0].tel);
						$("#address_t_address").text(data.mailLists[0].address);
						$(".address").attr("tid", data.mailLists[0].id);
					}

				}
				//商品
				var strhtmlo = ""
				var strhtmli = ""
				var c = "";
				var isCounter = "";
				for(i = 0; i < data.proShops.length; i++) {
					for(j = 0; j < data.proShops[i].buyerItems.length; j++) {
						//查询处方并且生成一个数组
						if(data.proShops[i].buyerItems[j].product.isCounter){
							isCounter +=data.proShops[i].buyerItems[j].preId+","
						}
						$(".foot_but").attr("Counter",isCounter.substr(0, isCounter.length - 1))
						
						//判断是否存货足以
						if(data.proShops[i].buyerItems[j].sku.stock <= 0) {
							c = "暂无存货"
						} else if(data.proShops[i].buyerItems[j].sku.stock - data.proShops[i].buyerItems[j].amount <= 0) {
							c = "存货不足购买"
						} else {
							c = ""
						}
						strhtmli += '<li class="pay_list_b" kid="' +
							data.proShops[i].buyerItems[j].sku.id +
							'"><img src="' +
							data.proShops[i].buyerItems[j].product.pic +
							'" /><div class="pay_list_b_t"><p>' +
							data.proShops[i].buyerItems[j].product.name +
							'</p><p>规格：<span>' +
							data.proShops[i].buyerItems[j].sku.spec +
							'</span></p><p><span>￥</span><span class="pay_price">' +
							data.proShops[i].buyerItems[j].sku.price +
							'</span><label class="quantity">' +
							data.proShops[i].buyerItems[j].amount +
							'</label><label>×</label><label class="non_stock">' +
							c +
							'</label></p></div></li>'
					}
					strhtmlo += '<li class="pay_list"><div class="pay_list_h"><span>' +
						data.proShops[i].phName +
						'</span></div><ul>' +
						strhtmli +
						'</ul><div class="pay_list_f"><p>共<span>2</span>类商品，共小计：<span class="cc0000 small_plan">0.00</span></p><p>运费：<span class="cc0000 express_sm">' +
						(data.proShops[i].mailFee).toFixed(2) +
						'</span></p></div></li>'
					//清空
					strhtmli = ""
				}
				$(".pay_box ul").empty().append(strhtmlo);
				/*页面计算*/
				//暂无存货
				non_stock()
				//产家小计
				subtotal()
				//产品金额
				grand_total()
				//实际付款
				payment()

			} else if(data.msg == "获取产品信息失败") {
				alert(data.msg);
				window.location.href = '../other/shop.html'
			} else {
				alert(data.msg);
			}

		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			console.log("网络请求失败，请联系网站管理员!");
		},
	})
})
//提交订单
function pay_successl() {
	console.log(localStorage.param1)
	var kid = new Array();
	var wechat = true;
	var oid = ""
	for(i = 0; i < $(".pay_list_b").length; i++) {
		kid.push($(".pay_list_b").eq(i).attr("kid"));
	}
	//console.log(kid)
	//ajax
	if($(".address").attr("tid") == "") {
		alert("你的地址尚未填写!")
		wechat = false;
	} else {
		var datas = "" 
		console.log('sendId=' + $(".address").attr("tid") + '&ids=' + kid +"&prescriptionId="+sessionStorage.prescriptionId+'&docId='+sessionStorage.docId)
		if(sessionStorage.docId == undefined || sessionStorage.docId == "undefined" ){
			datas = 'sendId=' + $(".address").attr("tid") + '&ids=' + kid +"&prescriptionId=0"
		}else{
			datas = 'sendId=' + $(".address").attr("tid") + '&ids=' + kid +"&prescriptionId="+sessionStorage.prescriptionId+'&docId='+sessionStorage.docId
		}
		console.log(datas)
		$.ajax({
			url: 'http://www.51ywyf.com/ywyf-weixin/cart/catrToOrder', //地址
			dataType: "json",
			type: "post",
			xhrFields: {
				withCredentials: true
			},
			timeout: 50000,
			data: datas,
			success: function(data) {
				console.log(JSON.stringify(data));
				if(data.omsg == "库存不足!") {
					alert("库存不足!")
					wechat = false;
				} else if(data.omsg == "请登录") {
					/*alert("请登录");
					window.location.href = '../other/login.html'*/
					wechat = false;
				} else if(data.omsg == "订单生成成功!") {
					//消除处方需求
					if(sessionStorage.prescription!=undefined&&sessionStorage.prescription!="undefined"){
						var data2 = JSON.parse(sessionStorage.prescription);
						var prescription = false;
						var data3 = $(".foot_but").attr("counter").split(",")
						for(o=0;o<data2.pre_nu.length;o++){
							for(p=0;p<data3.length;p++){
								if(data2.pre_nu[o].pre_id==data3[p]){
									data2.pre_nu.splice(o, 1);
								}	
							}
						}
						sessionStorage.prescription = JSON.stringify(data2);
					}
					
					//console.log(sessionStorage.prescription)
					console.log("生成成功")
					//生成的订单支付
					$(".foot_but").attr("onclick","console.log('提交订单中')").css("background-color","#cdcdcd").text("提交中.."); //防止多次点击
					$.ajax({
						url:'http://www.51ywyf.com/ywyf-weixin/weixinpay/wxPay', //地址
						dataType: "json",
						type: "post",
						xhrFields: {
							withCredentials: true
						},
						timeout: 50000,
						data: 'oids=' + data.orderUtil.oids,
						success: function(data1) {
							console.log(JSON.stringify(data1));
							var appId = data1.map.appId;
							var timeStamp = data1.map.timeStamp;
							var nonceStr = data1.map.nonceStr;
							var package1 = data1.map.package;
							var signType = "MD5";
							var paySign = data1.map.sign2;
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
											//判断是否关注微信
											if(localStorage.subscribe == 0){  //未关注
												window.location.replace("../other/is_subscribe.html");
											}else {
												window.location.replace("../person/order.html");
											}	
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
											window.location.replace("../person/order.html");
										} else {
											alert("支付异常！")
											window.location.replace("../person/order.html");
										}
									}
								);
							}
						},
						error: function(XMLHttpRequest, textStatus, errorThrown) {
							console.log("网络请求失败，请联系网站管理员!");
						},
					})
					wechat = true;
				} else if(data.omsg == "订单生成失败!") {
					alert("生成失败")
					window.location.href = '../other/pay_abnormal.html'
					wechat = false;
				}else{
					alert(data.omsg);
				}
				//成功
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				alert("订单生成失败")
				window.location.replace("../person/order.html");
			},
		})
	}

}
window.onload = function() {
	//暂无存货
	non_stock()
	//产家小计
	subtotal()
	//产品金额
	grand_total()
	//实际付款
	payment()
}
/*暂无存货*/
function non_stock() {
	for(i = 0; i < $(".pay_list_b").length; i++) {
		if($(".pay_list_b").eq(i).find(".non_stock").text() == "") {
			$(".pay_list_b").eq(i).find(".non_stock").css("display", "none");
		}
	}
}
/*产家小计*/
function subtotal() {
	for(j = 0; j < $(".pay_list").length; j++) {
		var num0 = 0;
		var num1 = 0;
		var num2 = 0;
		for(i = 0; i < $(".pay_list").eq(j).find(".pay_list_b").length; i++) {
			num1 = parseFloat($(".pay_list").eq(j).find(".pay_list_b").eq(i).find(".pay_price").text());
			num2 = parseFloat($(".pay_list").eq(j).find(".pay_list_b").eq(i).find(".quantity").text());
			num0 += num1 * num2
		}
		$(".pay_list").eq(j).find(".small_plan").text(num0.toFixed(2))
	}
}
/*产品金额*/
function grand_total() {
	var num4 = 0;
	var num5 = 0;
	//商品
	for(i = 0; i < $(".pay_list").length; i++) {
		num4 += parseFloat($(".pay_list").eq(i).find(".small_plan").text());
	}
	$(".grand_total").text(num4.toFixed(2))
	//快递
	for(i = 0; i < $(".pay_list").length; i++) {
		num5 += parseFloat($(".pay_list").eq(i).find(".express_sm").text());
	}
	$(".express_big").text(num5.toFixed(2));
}
/*实际付款*/
function payment() {
	$(".payment_num").text((parseFloat($(".grand_total").text()) + parseFloat($(".express_big").text())).toFixed(2))
}

//微信支付获取url
/*function getUrlParam(name){
    //构造一个含有目标参数的正则表达式对象
    var reg = new RegExp("(^|&)"  name  "=([^&]*)(&|$)");
    //匹配目标参数
    var r = window.location.search.substr(1).match(reg);
    //返回参数值
    if (r!=null) return unescape(r[2]); return null;
}*/