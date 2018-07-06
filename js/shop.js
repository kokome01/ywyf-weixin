/*加载完毕后执行*/
window.onload = function() {

}
/*数量加减*/
function shop_num(ob) {
	var shop_n = $(ob).parents(".shop_list_but").find(".shop_num")
	if($(ob).val() == "-") {
		if(shop_n.val() > 1) {
			shop_n.val(parseInt(shop_n.val()) - 1)
		}
	} else if($(ob).val() == "+") {
		shop_n.val(parseInt(shop_n.val()) + 1)
	}
	//总计
	zhonji()
	//ajax
	$.ajax({
		url: 'http://192.168.0.103/ywyf-weixin/cart/modifyAmount', //地址
		dataType: "json",
		type: "post",
		xhrFields: {
			withCredentials: true
		},
		timeout: 50000,
		data: 'skuId=' + $(ob).parents(".shop_list_l").attr("uid") + '&amount=' + $(ob).parents(".shop_list_but").find(".shop_num").val(),
		success: function(data) {
			//console.log(JSON.stringify(data));
			//成功
			if(data.msg == "更新成功!") {
				window.location.reload();
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
/*编辑*/
function commodity_del() {
	if($(".register_on").text() == "编辑") {
		$(".shop_balance_t3").css("display", "block");
		$(".shop_balance_t2").css("display", "none");
		$(".shop_balance_t1").css("display", "none");
		$(".register_on").text("完成")
		$(".settlement").css("background-color", "#999").text("删除").attr("set", "1")
	} else if($(".register_on").text() == "完成") {
		$(".shop_balance_t3").css("display", "none");
		$(".shop_balance_t2").css("display", "block");
		$(".shop_balance_t1").css("display", "block");
		$(".register_on").text("编辑")
		$(".settlement").css("background-color", "#cc0000").text("立即结算").attr("set", "0")
		//总计
		zhonji()
	}

}
/*点击结算或者删除*/
function result() {
	var len = $(".shop_list_l").length;
	var len_l = $(".shop_list_l").find("input[uname='1']").length;
	var sku = new Array();
	if($(".settlement").attr("set") == "0") {
		if(len_l >= 1) {
			//skuId
			//console.log($(".shop_list_l").find("input[uname='1']"))
			for(i = 0; i <= len_l - 1; i++) {
				sku.push($(".shop_list_l").find("input[uname='1']").eq(i).parents(".shop_list_l").attr("uid"));
			}
			//ajax
			localStorage.drug=sku;
			window.location.href = 'pay.html'

		} else {
			$(".settlement_cue").fadeIn(500).delay(1).fadeOut(500);
		}
	} else if($(".settlement").attr("set") == "1") {
		for(i = 0; i < len; i++) {
			if($(".shop_list_l").eq(i).find("input").attr("uname") == "1") {
				$(".shop_list_l").eq(i).addClass("del_shop_list")
			}
		}
		for(j = 0; j < $(".shop_list").length; j++) {
			if($(".shop_list").eq(j).find(".shop_list_head").find("input").attr("uname") == "1") {
				$(".shop_list").eq(j).addClass("del_shop_list_o");
			}
		}
		$(".black").show()

	}
}
/*总计*/
function zhonji() {

	var zhong = 0;
	console.log()
	for(i = 0; i < $(".shop_list_l").length; i++) {
		if($(".shop_list_l").eq(i).find("input").attr("uname") == 1) {
			var t1 = $(".shop_list_l").eq(i).find(".shop_list_t2 span").text();
			var t2 = $(".shop_list_l").eq(i).find(".shop_num").val()
			zhong = zhong + (t1 * t2)
		}
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
/*cue_but*/
function cue_but() {
	//ajax
	var arrDel = ""

	for(i = 0; i < $(".del_shop_list").length; i++) {
		if(i + 1 == $(".del_shop_list").length) {
			arrDel += $(".del_shop_list").eq(i).attr("uid");
		} else {
			arrDel += $(".del_shop_list").eq(i).attr("uid") + ",";
		}
	}
	$.ajax({
		url: 'http://192.168.0.103/ywyf-weixin/cart/delByIds', //地址
		dataType: "json",
		type: "post",
		timeout: 50000,
		xhrFields: {
			withCredentials: true
		}, //跨域产生问题（跨域请求设置withCredentials）登录，退出登录
		data: "skuIds=" + arrDel,
		success: function(data) {
			if(data.status == 1) {
				$(".cue_box").show();
				$(".cue_box span").text("删除成功");
				$(".cue_box").fadeOut();
				window.location.reload();
			}
			//console.log(JSON.stringify(data))
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			/*alert(XMLHttpRequest.status);
			alert(XMLHttpRequest.readyState);
			alert(textStatus);*/
			console.log("网络请求失败，请联系网站管理员!");
		},
	})
	$(".del_shop_list_o").remove();
	$(".black").hide();
}
/*cue_del*/
function cue_del() {
	$(".shop_list_l").removeClass("del_shop_list");
	$(".shop_list").removeClass("del_shop_list");
	$(".black").hide();
}