$(document).ready(function() {
	if(getQueryString("name")==null){
		orderlist(1, "", 0)
	}else{
		var ord = ""
		$(".order_head_i").removeClass("order_head_but");
		if(getQueryString("name")==0){
			ord = 1
		}else if(getQueryString("name")==1){
			$(".tips").show();
			ord = 2
		}else if(getQueryString("name")==2){
			ord = 3
		}else if(getQueryString("name")==3){
			ord = 4
		}
		$(".order_head_i").eq(ord).addClass("order_head_but")
		orderlist(1,getQueryString("name"), 0)
	}
	
	//下拉加载
	var page = 1;
	$(window).scroll(function() {
		if($(window).scrollTop() + $(window).height() + 5 > $(document).height()) {
			page += 1
			orderlist(page, $(".order_head_but").attr("uname"), 1)
		}
	});
})
//加载订单列表
function orderlist(num, types, emp) {
	var strhtml1 = "",
		strhtml2 = "",
		orderStatus = "",
		order_condition = "";
		//console.log("pageNo=" + num + "&type=" + types + '&returnUrl=')
	$.ajax({
		url: web_url + '/ywyf-weixin/order/orderList', //地址
		dataType: "json",
		type: "post",
		timeout: 50000,
		xhrFields: {
			withCredentials: true
		}, //跨域产生问题（跨域请求设置withCredentials）登录，退出登录
		data: "pageNo=" + num + "&type=" + types + '&returnUrl=',
		beforeSend:function(XMLHttpRequest){
			loding1("A3")
		},
		success: function(data) {
			console.log(JSON.stringify(data)) //打印data
			//window.location.reload()  	    //刷新当前页面
			if(data.msg == "请登录") {
				/*window.location.href = '../other/login.html'*/
			}
			if(emp == 0) {
				$(".order_box ul").empty()
			}
			if(data.pagination.totalCount == 0) {
				$(".order_box ul").empty()
			} else {
				for(i = 0; i < data.pagination.list.length; i++) {
					//订单状态
					if(data.pagination.list[i].orderStatus == 0) { //未付款
						orderStatus = '<span class="order_pay" onclick="pay(this)">一键支付</span><span class="order_del" onclick="del(this)">取消订单</span>';
						order_condition = "未付款";
						order_refund = ""
					} else if(data.pagination.list[i].orderStatus == 1) { //已付款
						orderStatus = ' <span class="order_warn" onclick="warn(this)"><b>提醒发货</b><label>一天只能提醒一次</label></span>'
						order_condition = "已付款";
						order_refund = '<span class="order_refund" onclick="customer(this)">申请售后</span>'
					} else if(data.pagination.list[i].orderStatus == 2) { //已发货
						orderStatus = ' <span class="order_take" onclick="take(this)">确认收货</span><span class="order_refund" onclick="window.location.href=' + "'../person/logistics.html?number=" + data.pagination.list[i].expiressNum + "'" + '">查看物流</span>'
						order_condition = "已发货";
						order_refund = '<span class="order_refund" onclick="customer(this)">申请售后</span>'
					} else if(data.pagination.list[i].orderStatus == 3) { //已完成待评价
						orderStatus = ' <span class="order_assess" onclick="assess(this)">评价商品</span>'
						order_condition = "已完成";
						order_refund = '<span class="order_refund" onclick="customer(this)">申请售后</span>'
					} else if(data.pagination.list[i].orderStatus == 4) { //交易关闭
						orderStatus = ' <span class="order_del" onclick="del(this)">删除订单</span>'
						order_condition = "交易关闭";
						order_refund = ""
					} else if(data.pagination.list[i].orderStatus == 5) { //订单完成且已评价
						orderStatus = ' <span class="order_del" onclick="del(this)">删除记录</span>'
						order_condition = "已评价";
						order_refund = '<span class="order_refund" onclick="customer(this)">申请售后</span>'
					} else if(data.pagination.list[i].orderStatus == 6) { //售后处理中
						orderStatus = ' '
						order_condition = "售后中";
						order_refund = '<span class="order_refund" onclick="customer_list(this)">查看售后</span>'
					}
					//添加订单
					//console.log(strhtml2)
					//清空strhtml1
					strhtml1 = ""
					for(j = 0; j < data.pagination.list[i].orderProducts.length; j++) {
						//console.log(data.pagination.list[i].orderProducts.length);
						strhtml1 += '<li class="order_li" oidi="' +
							data.pagination.list[i].orderProducts[j].id +
							'" iid="' +
							data.pagination.list[i].orderProducts[j].skuid +
							'" proid="' +
							data.pagination.list[i].orderProducts[j].sku.proId +
							'">' +
							order_refund +
							'<img src="' +
							data.pagination.list[i].orderProducts[j].sku.product.pic +
							'" /><div class="order_name"><p>' +
							data.pagination.list[i].orderProducts[j].sku.product.name +
							'</p><p class="order_spec" skuid="' +
							data.pagination.list[i].orderProducts[j].sku.id +
							'">规格：<span>' +
							data.pagination.list[i].orderProducts[j].sku.spec +
							'</span></p></div><div class="order_price"><p>共<span class="order_number_x">' +
							data.pagination.list[i].orderProducts[j].num +
							'</span>件商品，实付<span>￥</span><span>' +
							(data.pagination.list[i].totalfee).toFixed(2) +
							'</span></p></div></li>'

					}
					strhtml2 += '<li class="order_list" oid="' +
						data.pagination.list[i].id +
						'"><div class="order_vender"><p>订单编号：<span class="order_vender_num">' +
						data.pagination.list[i].orderNum +
						'</span><p>订单时间：<span class="order_vender_time">' +
						formatDateTime(data.pagination.list[i].addtime*1000) +
						'</span></p></p><p class="order_condition">' +
						order_condition +
						'</p></div><ul id="order_b_ul">' +
						strhtml1 +
						'</ul><div class="order_operation">' +
						orderStatus +
						'</div></li>'
					strhtml1 = ""

				}
				//console.log(strhtml2)
				$(".order_box>ul").append(strhtml2)
				strhtml2 = ""
			}

		},
		complete:function(XMLHttpRequest,textStatus){
			loding2()
            // alert('远程调用成功，状态文本值：'+textStatus);
        },
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			getcode()
		},
	})
}
window.onload = function() {}
//头部分类点击
function list(ob) {
	orderlist(1, $(ob).attr("uname"), 0);
	$(".order_head_i").removeClass("order_head_but");
	$(ob).addClass("order_head_but");
	//只有在待发货内显示提示
	if($(ob).attr("uname")==1){
		$(".tips").show();
	}else{
		$(".tips").hide();
	}
	
}
//点击删除订单
function del(ob) {
	$(".black").css("display", "block");
	$(".cue").css("display", "block");
	$(ob).parents(".order_list").addClass("order_li_del");
	$(".cue_text").text("你确认要删除订单");
	$(".cue_confirm").attr("onclick", "cue_but2()")
}
//确认收货
function cue_but1() {
	var oid = $(".order_take_y").parents(".order_list").attr("oid");
	//ajax
	$.ajax({
		url: web_url + '/ywyf-weixin/order/Confirm?oid=' + oid, //地址
		dataType: "json",
		type: "post",
		timeout: 50000,
		xhrFields: {
			withCredentials: true
		}, //跨域产生问题（跨域请求设置withCredentials）登录，退出登录
		success: function(data) {
			console.log(JSON.stringify(data)) //打印data
			//window.location.reload()  //刷新当前页面
			$(".order_take_y").text("已收货").removeClass("order_take_y");
			$(".black").css("display", "none");
			$(".cue").css("display", "none");
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			getcode()
		},
	})
}
//确认删除
function cue_but2() {
	//ajax
	var oid = $(".order_li_del").attr("oid");
	$.ajax({
		url: web_url + '/ywyf-weixin/order/delOrder?oid=' + oid, //地址
		dataType: "json",
		type: "post",
		timeout: 50000,
		xhrFields: {
			withCredentials: true
		}, //跨域产生问题（跨域请求设置withCredentials）登录，退出登录
		success: function(data) {
			console.log(JSON.stringify(data)) //打印data
			//window.location.reload()  	    //刷新当前页面
			$(".order_li_del").remove()
			$(".black").css("display", "none");
			$(".cue").css("display", "none");
			manufactor()
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			//alert(XMLHttpRequest.status);
			//alert(XMLHttpRequest.readyState);
			//alert(textStatus);
			console.log("网络请求失败，请联系网站管理员!");
		},
	})
}
//取消收货/删除
function cue_del() {
	$(".black").css("display", "none");
	$(".cue").css("display", "none");
	$(".order_li_del").removeClass("order_li_del");
	//
	$(".order_take_y").removeClass("order_take_y");
}
//判断商城是否存在
function manufactor() {
	for(i = 0; i < $(".order_list").length; i++) {
		if($(".order_list").eq(i).find(".order_li").length == 0) {
			$(".order_list").eq(i).remove()
		}
	}
}
//提醒发货
function warn(ob) {
	if($(ob).find("b").text() == "提醒发货") {
		$(ob).find("b").text("已经提醒")
	} else {
		$(ob).find("label").fadeIn(500).delay(1).fadeOut(500);
	}
}
//确认收货
function take(ob) {
	$(".black").css("display", "block");
	$(".cue").css("display", "block");
	$(ob).addClass("order_take_y");
	$(".cue_text").text("你确认收货");
	$(".cue_confirm").attr("onclick", "cue_but1()")
}
//申请售后
function customer(ob) {
	localStorage.customer = $(ob).parents(".order_li").attr("oidi")
	console.log(localStorage.customer)
	window.location.href = 'refund.html'
}
//填写售后快递单号
function express(ob) {
	$(".black").css("display", "block");
	$(".express").css("display", "block");
	$(ob).addClass("order_express_x");
}
//取消快递单号
function express_del() {
	$(".black").css("display", "none");
	$(".express").css("display", "none");
	$(".order_express_x").removeClass("order_express_x");
}
//确认快递单号
function express_but() {
	var id = $(".order_express_x").parents(".order_list").attr("oid");
	var num = $(".express_cue_tx").val()
	//ajax
	//console.log($(".order_li_del").parents(".order_li").attr("oid"))
	$.ajax({
		url: web_url + '/ywyf-weixin/order/upKdNum?id=' + id + '&kdNum=' + num, //地址
		dataType: "json",
		type: "post",
		timeout: 50000,
		xhrFields: {
			withCredentials: true
		}, //跨域产生问题（跨域请求设置withCredentials）登录，退出登录
		success: function(data) {
			console.log(JSON.stringify(data)) //打印data
			//window.location.reload()  	    //刷新当前页面
			$(".black").css("display", "none");
			$(".express").css("display", "none");
			$(".order_express_x").removeClass("order_express_x");
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			getcode()
		},
	})
}
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
//一键支付
function pay(ob) {
	//alert(parseInt($(ob).parents(".order_list").attr("oid")));	
	$.ajax({
		url: web_url + '/ywyf-weixin/weixinpay/wxPay', //地址
		dataType: "json",
		type: "post",
		xhrFields: {
			withCredentials: true
		},
		timeout: 50000,
		data: 'oids=' + parseInt($(ob).parents(".order_list").attr("oid")),
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
							window.location.replace("/ywyfwx/person/order.html");
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
							window.location.replace("/ywyfwx/person/order.html");
						} else {
							alert("支付异常！")
							window.location.replace("/ywyfwx/person/order.html");
						}
					}
				);
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			getcode()
		},
	})
}
//评价商品
function assess(ob) {
	localStorage.assessOid = $(ob).parents(".order_list").attr("oid");
	window.location.href = '../person/assessul.html';
}
//查看售后列表
function customer_list(ob) {
	//localStorage.customerList = $(ob).parents(".order_list").attr("oidi");
	window.location.href = '../person/chang.html';
}