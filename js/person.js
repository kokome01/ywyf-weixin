window.onload = function() {
	if($(".person_body_li").length > 3) {
		for(i = 3; i < $(".person_body_li").length; i++) {
			$(".person_body_li").eq(i).remove()
		}
	}
}
$(document).ready(function() {
	var tou_img = "../img/head_img.png";
	var strhtml = ""
	var orders_length = ""
	//加载地址列表
	$.ajax({
		url: web_url + '/ywyf-weixin/user/userCenter', //地址
		dataType: "json",
		type: "post",
		timeout: 50000,
		xhrFields: {
			withCredentials: true
		},
		success: function(data) {
			console.log(JSON.stringify(data));
			//赋值
			if(data.status == 1) {
				console.log(JSON.stringify(data));
				//判断头像是否为空
				if(data.user.pic == null) {
					tou_img = "../img/head_img.png"
				} else {
					tou_img = data.user.pic
				}
				//消息个数
				if(data.msgNum == 0) {
					$(".msgNum").css("display", "none")
				}
				$(".head_tou_img").find("img").attr("src", tou_img);
				$(".head_tou_name").find("span").text(data.user.nickname);
				$(".msgNum").text(data.msgNum)
				$("#a").text(data.a);
				$("#b").text(data.b);
				$("#c").text(data.c);
				$("#d").text(data.d);
				$("#e").text(data.e);
				//订单
				$(".person_body ul").empty();
				if(data.orders.length != 0) {
					if(data.orders.length <= 3) {
						orders_length = data.orders.length
					} else {
						orders_length = 3
					}
					for(i = 0; i < orders_length; i++) {
						strhtml += '<li class="person_body_li" onclick="window.location.href=' + "'../person/order.html" + "'" +
							'"><img src="' +
							data.orders[i].orderProduct.sku.product.pic +
							'" /><div class="person_body_li_t"><b>' +
							data.orders[i].orderProduct.sku.product.name +
							'</b><p>规格：<span>' +
							data.orders[i].orderProduct.sku.spec +
							'</span></p></div></li>'
					}
				} else {
					strhtml = '<div class="person_body_li" style="color: #cdcdcd;">暂无最新订单</div>'
				}

				$(".person_body ul").append(strhtml)
				//广告
				var url1 = data.banners[0].url
				var url2 = url1.substr(39,5)
				$(".person_ad").find("img").attr("src", data.banners[0].pic);
				$(".person_ad").attr("onclick", "window.location.href='../other/introduction.html?id="+url2+"'")
			} else {
				/*alert("请登录");
				window.location.href = '../other/login.html'*/
			}

		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			/*alert(XMLHttpRequest.status);
			alert(XMLHttpRequest.readyState);
			alert(textStatus);*/
			console.log("网络请求失败，请联系网站管理员!");
		},
	})
	//加载默认地址

})