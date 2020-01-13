$(document).ready(function() {
	chang_ajax(1, 0)

	//瀑布流下拉加载
	var page = 1;
	$(window).scroll(function() {
		if($(window).scrollTop() + $(window).height() + 5 > $(document).height()) {
			page += 1;
			chang_ajax(page, 1)
		}
	});
})

//加载ajax
function chang_ajax(page, empt) { //退换货类型，页数，是否为加载0为初始加载1为下拉加载
	$.ajax({
		url: web_url + '/ywyf-weixin/order/toChange?pageNo=' + page, //地址
		dataType: "json",
		type: "post",
		timeout: 50000,
		xhrFields: {
			withCredentials: true
		}, //跨域产生问题（跨域请求设置withCredentials）登录，退出登录
		success: function(data) {
			//window.location.reload()  	    //刷新当前页面\n
			console.log(JSON.stringify(data))
			if(data.msg != "请登录") {
				var strhtml = "",
					buttons = "",
					status = "",
					num = "",
					sty = "";
				for(i = 0; i < data.pagination.list.length; i++) {
					num = data.pagination.list[i].status;
					sty = data.pagination.list[i].style;
					if(num == 0) { //申请售后中
						buttons = '<span class="order_del" onclick="del(this,' + "'你确认要取消退款？'" + ')">取消退款</span>'
						status = "申请售后中"
					} else if(num == 1) { //商家同意
						buttons = '<span class="order_del" onclick="del(this,' + "'你确认要取消退款？'" + ')">取消退款</span><span onclick="express(this)">填写单号</span>'
						if(sty == 1) {
							status = "商家同意，退款处理中"
						} else if(sty == 2) {
							status = "商家同意，请填写换货单号"
						} else if(sty == 3) {
							status = "商家同意，请填写退货单号"
						}
					} else if(num == 2) { //商家拒绝
						buttons = ''
						status = "商家拒绝"
					} else if(num == 3) { //退款完成
						buttons = ''
						status = "退款完成"
					} else if(num == 4) { //换货完成，请注意查收
						buttons = '<span onclick="window.location.href=' + "'logistics.html'" + '">查看快递</span>'
						status = "换货完成，请注意查收"
					} else if(num == 5) { //售后取消
						buttons = ''
						status = "售后取消"
					} else if(num == 6) { //售后确认完成
						buttons = ''
						status = "售后确认完成"
					}
					strhtml += '<li class="order_li" id="' +
						data.pagination.list[i].id +
						'" rid="' +
						data.pagination.list[i].orderProduct.refundId +
						'"><img src="' +
						data.pagination.list[i].orderProduct.sku.product.pic +
						'" /><div class="order_name"><span class="order_status">' +
						status +
						'</span><p>' +
						data.pagination.list[i].orderProduct.sku.product.name +
						'</p><p class="order_spec">规格：<span>' +
						data.pagination.list[i].orderProduct.sku.spec +
						'</span></p></div><div class="order_price"><p>共<span>' +
						data.pagination.list[i].orderProduct.num +
						'</span>件商品，实付<span>￥</span><span>' +
						data.pagination.list[i].orderProduct.num * data.pagination.list[i].orderProduct.price +
						'</span></p></div><div class="order_operation">' +
						buttons +
						'</div></li>'
				}
				if(empt == 0) {
					$(".order_box ul").empty().append(strhtml);
				} else {
					$(".order_box ul").append(strhtml);
				}
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
//点击退换货类型
function list(ob, lis) {
	$(".order_head_i").removeClass("order_head_but");
	$(ob).addClass("order_head_but");
	chang_ajax(lis, 1, 0)
}
//点击删除订单
function del(ob, txt) {
	$(".black").css("display", "block");
	$(".cue").css("display", "block")
	$(ob).parents(".order_li").addClass("order_li_del");
	$(".cue_text").text(txt);
}
//确认删除
function cue_but() {
	//ajax
	var rid = $(".order_li_del").attr("rid");
	console.log('rid=' + rid)
	$.ajax({
		url: web_url + '/ywyf-weixin/order/cancel', //地址
		dataType: "json",
		type: "post",
		xhrFields: {
			withCredentials: true
		},
		timeout: 50000,
		data: 'rid=' + rid,
		/*beforeSend: function(XMLHttpRequest) { //加载开始显示
			$(".loading").css("display", "block");
		},*/
		success: function(data) {
			console.log(JSON.stringify(data));
			//window.location.href = '../index.html';
			$(".black").css("display", "none");
			$(".cue").css("display", "none");
			window.location.reload()
		},
		/*complete: function(XMLHttpRequest, textStatus) { //加载完毕后执行
			$(".loading").css("display", "none");
		},*/
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			getcode()
		},
	})
}
//取消删除
function cue_del() {
	$(".black").css("display", "none");
	$(".cue").css("display", "none");
	$(".order_li_del").removeClass("order_li_del");
}
//填写快递单号
function express(ob) {
	$(".black").css("display", "block");
	$(".express").css("display", "block");
	$(ob).parents(".order_li").addClass("order_li_express");
}
//确认填写快递单号
function express_but() {
	var id =$(".order_li_express").attr("rid");
	var val = $("#express_address").val()
	if($("#express_address").val().length > 6) {
		console.log('id=' + id + "&kdNum=" + $("#express_address").val())
		//ajax
		$.ajax({
			url: "http://www.51ywyf.com/ywyf-weixin/order/upKdNum", //地址
			dataType: "json",
			type: "post",
			xhrFields: {
				withCredentials: true
			},
			timeout: 50000,
			data: 'id=' + id + "&kdNum=" + val,
			/*beforeSend: function(XMLHttpRequest) { //加载开始显示
				$(".loading").css("display", "block");
			},*/
			success: function(data) {
				console.log(JSON.stringify(data));
				window.location.reload()
				//window.location.href = '../index.html';
				$(".order_li_express").remove()
				$(".black").css("display", "none");
				$(".express").css("display", "none");
				//清空
				$("#express_address").val("")
				$(".express_cu").text("请检查订单号是否填写正确，点击确认后，将无法取消退款请求")
			},
			/*complete: function(XMLHttpRequest, textStatus) { //加载完毕后执行
				$(".loading").css("display", "none");
			},*/
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				//console.log(XMLHttpRequest.status);
				//console.log(XMLHttpRequest.readyState);
				//console.log(textStatus);
				console.log("网络请求失败，请联系网站管理员!");
				//window.location.href=web_url+"/ywyf-weixin/getCode";
			},
		})
	}else{
		$(".express_cu").text("你尚未填写快递单号")
	}

}
//取消填写快递单号
function express_del() {
	$(".black").css("display", "none");
	$(".express").css("display", "none");
	$(".order_li_del").removeClass("order_li_express");
	$(".express_cu").text("请检查订单号是否填写正确，点击确认后，将无法取消退款请求")
}