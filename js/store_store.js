$(document).ready(function() {
	ajax(getQueryString("id"))
	//购物车为0
	shop_zero()
})
//ajax
function ajax(id) {
	if(id == null) {
		window.location.href = 'store_index.html'
	}
	$.ajax({
		url: web_url + '/ywyf-weixin/spmkt/spmtkInfo?id=' + id, //地址
		dataType: "json",
		type: "post",
		xhrFields: {
			withCredentials: true
		},
		timeout: 50000,
		success: function(data) {
			console.log(JSON.stringify(data))
			//收藏
			if(data.favorite == 0) {
				$(".store_i_collection").css("background-position", "0px -60px").attr("collection", "0");
			} else {
				$(".store_i_collection").css("background-position", "-30px -60px").attr("collection", "1");
			}
			//商家名字
			$("#store_name").text(data.spmktInfo.name)
			//商家地址
			$("#store_address").find("span").text(data.spmktInfo.address);
			//商家分类
			var typesList = "";
			var productsList = "";
			var sales = 0;
			var ulhtml = "";
			for(i = 0; i < data.spmktProductTypes.length; i++) {
				if(data.spmktProductTypes[i].spmktProducts.length != 0) {
					typesList += '<li class="catalogue_li" onclick="commodity_type(this,' +
						data.spmktProductTypes[i].id +
						')"><div class=""></div><p>' +
						data.spmktProductTypes[i].name +
						'</p></li>'
				}
				for(j = 0; j < data.spmktProductTypes[i].spmktProducts.length; j++) {
					if(data.spmktProductTypes[i].spmktProducts[j].sales != null) {
						sales = data.spmktProductTypes[i].spmktProducts[j].sales
					}
					if(j == 0) {
						ulhtml = '<li><span class="commodity_tou" id="' + data.spmktProductTypes[i].id + '">' + data.spmktProductTypes[i].name + '</span></li>'
					} else {
						ulhtml = ""
					}
					productsList += ulhtml + '<li class="commodity_li buy_li" typeId="' +
						data.spmktProductTypes[i].spmktProducts[j].typeId +
						'" co="' +
						data.spmktProductTypes[i].spmktProducts[j].id +
						'" weight="' +
						data.spmktProductTypes[i].spmktProducts[j].weight +
						'" img="' + data.spmktProductTypes[i].spmktProducts[j].cover + '"><div class="commodity_list" onclick="food(this)"><img src="' +
						data.spmktProductTypes[i].spmktProducts[j].cover +
						'" onerror="javascript:this.src=' + "'../img/TB.jpg'" + '"/><div class="commodity_li_text"><p class="commodity_li_name calculate_name">' +
						data.spmktProductTypes[i].spmktProducts[j].name +
						'</p><p class="commodity_li_introduce">' +
						data.spmktProductTypes[i].spmktProducts[j].name +
						'</p><p>销量<span>' +
						sales +
						'</span>份 好评率' +
						"100%" +
						'</p><p>￥<span class="commodity_li_price calculate_price">' +
						(data.spmktProductTypes[i].spmktProducts[j].discountPrice).toFixed(2) +
						'</span><del class="commodity_li_disprice">' +
						(data.spmktProductTypes[i].spmktProducts[j].price).toFixed(2) +
						'</del></p></div></div><div class="commodity_li_quantity li_quantity"><span class="quantity_reduce store_o" onclick="calculate(this,0)">-</span><label class="quantity_num store_o store_o_num">0</label><span class="quantity_add" onclick="calculate(this,1)">+</span></div></li>'
				}
			}
			//zero()
			//一级分类
			$(".catalogue_ul").empty().append(typesList)
			$(".catalogue_ul").find("li").eq(0).addClass("catalogue_li_on")
			//商品
			$(".commodity_ul").empty().append(productsList)
			//非默认第一的商品隐藏
			/*for(i = 0; i < $(".commodity_li").length; i++) {
				if($(".commodity_li").eq(i).attr("typeId") != data.spmktProductTypes[0].id) {
					$(".commodity_li").eq(i).addClass("hide")
				}
			}*/
			//起送价格(重量)rule： 0=包邮，1=满重包邮，2=满额包邮，3=固定邮费   amount 包邮=0.满重填写重量，满额填写金额，固定填写金额
			if(data.spmktmailfee[0] == undefined) {
				console.log("配送数据未输入")
				$("#spmktmailfee_rule").html("店内运费：尚不明确");
				$(".store_balance").attr("postage", 0);
			} else {
				$(".store_balance").attr("rule", data.spmktmailfee[0].rule);
				if(data.spmktmailfee[0].rule == 0) {
					$("#spmktmailfee_rule").html("<span class='spmktmailfee_bao'>包邮</span>")
				} else if(data.spmktmailfee[0].rule == 1) {
					$(".store_balance").attr("minweight", data.spmktmailfee[0].amount)
					$("#spmktmailfee_rule").html('店内运费：满<span id="altogether_surplus">' + data.spmktmailfee[0].amount + '</span>重量包邮')
				} else if(data.spmktmailfee[0].rule == 2) {
					$(".store_balance").attr("surplus", data.spmktmailfee[0].amount);
					$("#spmktmailfee_rule").html('店内运费：满<span id="altogether_surplus">' + data.spmktmailfee[0].amount + '</span>元包邮')
				} else if(data.spmktmailfee[0].rule == 3) {
					$("#spmktmailfee_rule").html('店内运费：固定邮费' + data.spmktmailfee[0].amount)
				}
				$(".store_balance").attr("price", data.spmktmailfee[0].price);
				if(data.spmktInfo.postage != null) {
					$(".store_balance").attr("postage", data.spmktInfo.postage);
				} else {
					$(".store_balance").attr("postage", 0);
				}
				$("#spmktmailfee_price").html('还差<span id="altogether_surplus">' + data.spmktmailfee[0].price + '</span>元起送')
			}
			//判断缓存数量然后
			if(localStorage.json_shop != undefined && localStorage.json_shop != "undefined") { //判断
				var num_data = JSON.parse(localStorage.json_shop);
				console.log(localStorage.json_shop)

				if(num_data != undefined && num_data != "undefined") {
					for(i = 0; i < num_data.store.length; i++) { //本地循环
						//console.log(data.spmktProductTypes[i].id)
						if(num_data.store[i].id == data.spmktProductTypes[i].id) { //判断是否存在这个商店
							for(j = 0; j < $(".commodity_li").length; j++) { //商品循环
								for(x = 0; x < num_data.store[i].commodity.length; x++) {
									//console.log($(".commodity_li").eq(j).attr("co")+"--"+num_data.store[j].commodity[x].id)
									if($(".commodity_li").eq(j).attr("co") == num_data.store[i].commodity[x].id) {
										$(".commodity_li").eq(j).find(".quantity_num").text(num_data.store[i].commodity[x].num)
									}
								}
							}
						}
					}
				}
			} else {

			}
			var hei = "";
			var heihtml = "";
			//添加高度的数组
			for(i = 0; i < data.spmktProductTypes.length; i++) {
				heihtml += data.spmktProductTypes[i].spmktProducts.length + ","
			}
			hei = heihtml.slice(0, -1);
			$(".body1").attr("hei", hei)
			//判断是否为零
			zero()
			//结算
			commodity_num()
			//判断屏幕尺寸然后自适应第一级分类
			min_height()
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			//alert(XMLHttpRequest.status);
			//alert(XMLHttpRequest.readyState);
			//alert(textStatus);
			console.log("网络请求失败，请联系网站管理员!");
		},
	})
}

//当滚动条滚动了
//滚动条
$(window).scroll(function() {
	// 滚动条距离顶部的距离 大于 200px时
	if($(window).scrollTop() >= 150) {
		$(".body_head_search").addClass("body_head_search_f");
		$(".catalogue_over").addClass("catalogue_over_f");
	} else if($(window).scrollTop() <= 100) {
		$(".body_head_search").removeClass("body_head_search_f");
		$(".catalogue_over").removeClass("catalogue_over_f");
	}
	//第一级菜单、
	var hei_attr = $(".body1").attr("hei").split(',');
	var min = 0;
	var max = 0;
	for(i = 0; i < hei_attr.length; i++) {
		if(i == 0) {
			min = 0;
			max = hei_attr[0] * 100 + 20;
		} else {
			min += hei_attr[i - 1] * 100 + 20;
			max += hei_attr[i] * 100 + 20
		}
		if($(window).scrollTop() >= min && $(window).scrollTop() < max) {
			$(".catalogue_ul").find("li").removeClass("catalogue_li_on")
			$(".catalogue_ul").find("li").eq(i).addClass("catalogue_li_on")
		}
	}
})
//点击第一级菜单
function commodity_type(ob, id) {
	$("html,body").animate({
		scrollTop: $("#" + id).offset().top
	}, 500);
	//window.location.hash = "#"+id;
	//$(".catalogue_li").removeClass("catalogue_li_on");
	//$(ob).addClass("catalogue_li_on");
	/*$(".commodity_li").addClass("hide");
	for(i = 0; i < $(".commodity_li").length; i++) {
		if($(".commodity_li").eq(i).attr("typeId") == id) {
			$(".commodity_li").eq(i).removeClass("hide")
		}
	}*/
	//
	min_height()
}

//判断是否为数量0
function zero() {
	for(i = 0; i < $(".store_o_num").length; i++) {
		if($(".store_o_num").eq(i).text() == 0) {
			$(".store_o_num").eq(i).parents(".li_quantity").find(".store_o").css("opacity", "0")
		} else {
			$(".store_o_num").eq(i).parents(".li_quantity").find(".store_o").css("opacity", "1")
		}
	}

}
/*结算*/

function commodity_num() {
	//商品数量
	var nums = 0
	for(i = 0; i < $(".commodity_li").length; i++) {
		nums += parseInt($(".commodity_li").eq(i).find(".quantity_num").text())
	}
	$("#store_i_box_t").text(nums);
	if(nums == 0) {
		$("#store_i_box_t").hide()
	} else {
		$("#store_i_box_t").show()
	}
	//商品价格
	var price = 0.00;
	for(i = 0; i < $(".commodity_li").length; i++) {
		price += parseFloat($(".commodity_li").eq(i).find(".quantity_num").text()) * parseFloat($(".commodity_li_price").eq(i).text())
	}
	$("#altogether_price").text(price.toFixed(2))
	//剩余起送
	var surplus = parseFloat($(".store_balance").attr("surplus"))
	if(surplus - price >= 0) {
		$(".store_balance").removeClass("store_balance_on").attr("onclick", "settle(0)");
		$(".store_balance").find("p").html('还差<span id="altogether_surplus">' + $(".store_balance").attr("price") + '</span>元起送')
		$("#altogether_surplus").text((surplus - price).toFixed(2))
	} else if(surplus - price < 0) {
		$(".store_balance").addClass("store_balance_on").attr("onclick", "settle(1)")
		$(".store_balance").find("p").html("去结算");
	} else {
		$(".store_balance").find("p").html("完善店铺");
	}

}
/*展开 收缩订单*/
function buy_show() {
	if($("#store_i_box_t").text() != 0) {
		$(".black_b").toggle()
		$(".black").toggle()
		$(".buy_menu").slideToggle();
	}
	order_from()
}
/*赋值进订单*/
function order_from() {
	var strhtml = ""
	for(i = 0; i < $(".commodity_li").length; i++) {
		if($(".commodity_li").eq(i).find(".quantity_num").text() >= 1) {
			strhtml += '<li class="buy_li buy_text" co="' +
				$(".commodity_li").eq(i).attr("co") +
				'"" foot="1" img ="' +
				$(".commodity_li").eq(i).find(".commodity_list>img").attr("src") +
				'" weight="' +
				$(".commodity_li").eq(i).attr("weight") +
				'"><div class="buy_li_name"><span class="calculate_name">' +
				$(".commodity_li").find(".commodity_li_name").eq(i).text() +
				'</span></div><span class="buy_li_prices">￥<label class="calculate_price">' +
				$(".commodity_li").find(".commodity_li_price").eq(i).text() +
				'</label></span><div class="buy_li_quantity li_quantity"><span class="buy_reduce store_o" onclick="calculate(this,0)">-</span><label class="buy_num store_o_num">' +
				$(".commodity_li").find(".quantity_num").eq(i).text() +
				'</label><span class="buy_add" onclick="calculate(this,1)">+</span></div></li>'
		}
	}
	$(".buy_body>ul").empty().append(strhtml)
}
/*清空*/
function del() {
	var data = JSON.parse(localStorage.json_shop);
	//删除本地缓存 
	for(i = 0; i < data.store.length; i++) {
		if(data.store[i].id == getQueryString("id")) {
			data.store.splice(i, 1)
		}
	}
	localStorage.json_shop = JSON.stringify(data)
	buy_show()
	commodity_num()
	$(".buy_body>ul").empty()
	$(".quantity_num").css("opacity", "0")
	$(".quantity_reduce").css("opacity", "0")
	//
	window.location.reload()
}
/*收藏*/
function collection() {
	$.ajax({
		url: web_url + '/ywyf-weixin/spmkt/favorite?spmktId=' + getQueryString("id"), //地址
		dataType: "json",
		type: "post",
		xhrFields: {
			withCredentials: true
		},
		timeout: 50000,
		success: function(data) {
			console.log(JSON.stringify(data));
			if(data.msg == "请登录") {
				alert("你尚未登录")
				window.location.href = '../other/login.html'
			} else {
				if($(".store_i_collection").attr("collection") == 0) {
					$(".store_i_collection").attr("collection", 1)
				} else {
					$(".store_i_collection").attr("collection", 0)
				}
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

/*打开商品详细*/
function food(ob) {
	var name = $(ob).find(".commodity_li_name").text();
	var price = $(ob).find(".commodity_li_price").text();
	var introduce = $(ob).find(".commodity_li_introduce").text()
	var num = $(ob).parent(".commodity_li").find(".quantity_num").text();
	var co = $(ob).parent(".commodity_li").attr("co");
	var img = $(ob).find("img").attr("src")
	$("#food_name").text(name);
	$("#food_price").text(price);
	$("#food_introduce").text(introduce);
	$("#food_num").text(num);
	$(".food_text").attr("co", co);
	$(".food_text").attr("img", img)
	$(".food_img").find("img").attr("src", img)
	$(".head1").toggle();
	$(".head2").toggle();
	$(".body1").toggle();
	$(".body2").toggle();
	//判断是否为零
	zero()
}
//时候可以结算
function settle(va) {
	if(va == 1) {
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
				//console.log(JSON.stringify(data));
				if(data.status == 1) {
					window.location.href = 'store_settling.html?spmktId=' + getQueryString("id");
				} else {
					/*alert("请登录");
					window.location.href = '../other/login.html';*/
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
}
//购物车为0
function shop_zero() {
	if($(".store_i_shop_t").text() == 0) {
		$(".store_i_shop_t").hide()
	}
}
//搜索
function search_button() {
	var val = $("#search_val").val();
	$(".commodity_li").addClass("hide");
	if(val == "") {
		$(".commodity_tou").removeClass("hide");
	} else {
		$(".commodity_tou").addClass("hide");
	}
	for(i = 0; i < $(".commodity_li").length; i++) {
		if($(".commodity_li").eq(i).find(".commodity_li_name").text().search(val) >= 0) {
			$(".commodity_li").eq(i).removeClass("hide");
		}
	}
}

function storefront() {
	window.location.href = 'store_storefront.html?id=' + getQueryString("id")
}
//本地缓存购物车
function json_shop(storeId, storeName, commId, commName, commPrice, commNum, commImg, commweight, rule, weight, minPrice, amount, postage) { //店铺id，店铺名字，商品id，商品名字，商品价格，商品数量，商品图片，商品重量，配送规则，满额重量，满额价格，起送邮费，邮费
	var json_shop = {};
	var shop_store = [];
	var commodity = {};
	var commodity_li = [];
	var baoyou = {};
	var baoyou_li = [];
	//录入商家
	if(localStorage.json_shop == undefined || localStorage.json_shop == "undefined") {
		json_shop.store = shop_store;
		shop_store.push({
			"id": storeId,
			"name": storeName,
			"commodity": commodity,
			"baoyou": baoyou
		});
		json_shop.store[0].commodity = commodity_li
		commodity_li.push({
			"id": commId,
			"name": commName,
			"price": commPrice,
			"num": commNum,
			"img": commImg,
			"weight": commweight
		})
		json_shop.store[0].baoyou = baoyou_li
		baoyou_li.push({
			"rule": rule,
			"weight": weight,
			"minPrice": minPrice,
			"amount": amount,
			"postage": postage
		})
	} else {
		var store = "";
		var storenum_o = "";
		var comm = 0;
		var commnum_o = "";
		json_shop = JSON.parse(localStorage.json_shop)
		for(i = 0; i < json_shop.store.length; i++) {
			//console.log(json_shop.store[i].id+"::"+storeId)
			if(json_shop.store[i].id == storeId) { //存在同商店
				store = 1;
				storenum_o = i;
				for(j = 0; j < json_shop.store[i].commodity.length; j++) {
					if(json_shop.store[i].commodity[j].id == commId) { //存在相同的产品
						comm = 1;
						commnum_o = j;
					}
				}
			}
			if(store != 1) {
				store = 0;
			}
		}
		if(store == 1) {
			if(comm == 1) { //有商家，有产品
				if(commNum == 0) { //判断是否等于0
					json_shop.store[storenum_o].commodity.splice(commnum_o, 1);
				} else {
					json_shop.store[storenum_o].commodity[commnum_o].num = commNum;

				}
			} else { //有商家，无产品
				json_shop.store[storenum_o].commodity.push({
					"id": commId,
					"name": commName,
					"price": commPrice,
					"num": commNum,
					"img": commImg,
					"weight": commweight
				})
			}
		} else if(store == 0) { //无商家
			json_shop.store.push({
				"id": storeId,
				"name": storeName,
				"commodity": commodity,
				"baoyou": baoyou
			});
			json_shop.store[json_shop.store.length - 1].commodity = commodity_li
			commodity_li.push({
				"id": commId,
				"name": commName,
				"price": commPrice,
				"num": commNum,
				"img": commImg,
				"weight": commweight
			})
			json_shop.store[json_shop.store.length - 1].baoyou = baoyou_li
			baoyou_li.push({
				"rule": rule,
				"weight": weight,
				"minPrice": minPrice,
				"amount": amount,
				"postage": postage
			})
		}
		//shop_store = JSON.parse(json_shop).store
		//shop_store.push({"id":storeId,"name":storeName,"commodity":commodity,"baoyou":baoyou})
	}
	//判断是否存在商家（如果已经没有商品存在就把商家删除）
	for(i = 0; i < json_shop.store.length; i++) {
		if(json_shop.store[i].commodity.length == 0) {
			json_shop.store.splice(0, 1)
		}
	}
	//录入商品
	localStorage.json_shop = JSON.stringify(json_shop)
	console.log(localStorage.json_shop)
	//localStorage.json_shop = undefined
}

//加减产品
function calculate(ob, type) { //  1.对象 2.加1&减0
	var num = parseInt($(ob).parents(".li_quantity").find(".store_o_num").text())
	if(type == 1) {
		$(ob).parents(".li_quantity").find(".store_o_num").text(num + 1);
		//把值赋予本地缓存
		var storeId = getQueryString("id"),
			storeName = $("#store_name").text(),
			commId = $(ob).parents(".buy_li").attr("co"),
			commName = $(ob).parents(".buy_li").find(".calculate_name").text(),
			commPrice = $(ob).parents(".buy_li").find(".calculate_price").text(),
			commNum = $(ob).parents(".buy_li").find(".store_o_num").text(),
			commImg = $(ob).parents(".buy_li").attr("img"),
			commweight = $(ob).parents(".buy_li").attr("weight"),
			rule = $(".store_balance").attr("rule"),
			weight = $(".store_balance").attr("minweight"),
			minPrice = $(".store_balance").attr("price"),
			amount = $(".store_balance").attr("surplus"),
			postage = $(".store_balance").attr("postage");
		json_shop(storeId, storeName, commId, commName, commPrice, commNum, commImg, commweight, rule, weight, minPrice, amount, postage)
		//刷新页面
		//window.location.reload()
	} else if(type == 0) {
		if(num != 0) {
			if(num > 1) {
				$(ob).parents(".li_quantity").find(".store_o_num").text(num - 1)
			} else if(num == 1) {
				$(ob).parents(".li_quantity").find(".store_o_num").text(num - 1)
				if($(ob).parents(".buy_text").attr("foot") == 1) { //如果是底部
					$(ob).parents(".buy_text").remove();
					if($(".buy_body>ul").find("li").length == 0) {
						del()
					}
				}
			} else {
				$(ob).parents(".li_quantity").find(".store_o_num").text(0)
			}

			//把值赋予本地缓存
			var storeId = getQueryString("id"),
				storeName = $("#store_name").text(),
				commId = $(ob).parents(".buy_li").attr("co"),
				commName = $(ob).parents(".buy_li").find(".calculate_name").text(),
				commPrice = $(ob).parents(".buy_li").find(".calculate_price").text(),
				commNum = $(ob).parents(".buy_li").find(".store_o_num").text(),
				commImg = $(ob).parents(".buy_li").attr("img"),
				commweight = $(ob).parents(".buy_li").attr("weight"),
				rule = $(".store_balance").attr("rule"),
				weight = $(".store_balance").attr("minweight"),
				minPrice = $(".store_balance").attr("price"),
				amount = $(".store_balance").attr("surplus"),
				postage = $(".store_balance").attr("postage");
			json_shop(storeId, storeName, commId, commName, commPrice, commNum, commImg, commweight, rule, weight, minPrice, amount, postage)
			//刷新页面
			//window.location.reload()
		}
	}

	//关联值
	for(i = 0; i < $(".buy_li").length; i++) {
		if($(".buy_li").eq(i).attr("co") == $(ob).parents(".buy_li").attr("co")) {

			$(".buy_li").eq(i).find(".store_o_num").text($(ob).parents(".buy_li").find(".store_o_num").text())
		}
	}
	//判断所有num的值是否为0,对于减号的隐藏
	for(i = 0; i < $(".store_o_num").length; i++) {
		if($(".store_o_num").eq(i).text() == 0) {
			$(".store_o_num").eq(i).parents(".li_quantity").find(".store_o").css("opacity", "0")
		} else {
			$(".store_o_num").eq(i).parents(".li_quantity").find(".store_o").css("opacity", "1")
		}
	}
	//结算
	commodity_num()
}
//高度自适应
function min_height() {
	var list1 = window.screen.availHeight - 254
	var list2 = $(".commodity_ul").css("height").replace(/[^0-9]/ig, "")
	if(list1 >= list2) {
		$(".catalogue_over").css("min-height", list1 + "px")
	} else {
		$(".catalogue_over").css("min-height", list2 + "px")
	}
}
//返回
function back() {
	window.location.href = '../store/store_index.html'
}