//获取经纬度
function geolocationSupport() {
	if(!navigator.geolocation) {
		alert("你的浏览器不支持HTML5 Geolocation");
	} else {
		var options = {
			enableHighAccuracy: true,
			timeout: 60000,
			maximumAge: 60000
		}
		navigator.geolocation.getCurrentPosition(
			success,
			error,
			options
		)
	}
}

function success(position) {
	var x = position.coords.longitude;
	var y = position.coords.latitude;
	//alert("经度为:" + x + "纬度为:" + y);
	// 百度地图API功能
	for(i = 0; i < $(".body_list").find("li").length; i++) {
		if($(".body_li").eq(i).attr("latitude") == null || $(".body_li").eq(i).attr("longitude") == null || $(".body_li").eq(i).attr("latitude") == "null" || $(".body_li").eq(i).attr("longitude") == "null") {
			$(".body_li_distance").eq(i).text("")
		} else {
			var map = new BMap.Map("allmap"); // 创建Map实例
			var point1 = new BMap.Point(positions.x, positions.y);
			var point2 = new BMap.Point($(".body_li").eq(i).attr("latitude"), $(".body_li").eq(i).attr("longitude"));
			var distance = map.getDistance(point1, point2);
			$(".body_li_distance").eq(i).text(parseInt(distance) + "m")
		}
	}
}

function error(err) {
	var errorTypes = {
		1: "用户拒绝定位服务",
		2: "获取不到定位信息",
		3: "获取定位信息超时"
	}
	alert(errorTypes[err.code]);
}
//加载经纬度，每次进入只获取一次
window.onload = function() {
	if(sessionStorage.positions == undefined || sessionStorage.positions == "undefined") {
		geolocationSupport()
	} else {
		var positions = JSON.parse(sessionStorage.positions);
		// 百度地图API功能
		for(i = 0; i < $(".body_list").find("li").length; i++) {
			if($(".body_li").eq(i).attr("latitude") == null || $(".body_li").eq(i).attr("longitude") == null || $(".body_li").eq(i).attr("latitude") == "null" || $(".body_li").eq(i).attr("longitude") == "null") {
				$(".body_li_distance").eq(i).text("")
			} else {
				var map = new BMap.Map("allmap"); // 创建Map实例
				var point1 = new BMap.Point(positions.x, positions.y);
				var point2 = new BMap.Point($(".body_li").eq(i).attr("latitude"), $(".body_li").eq(i).attr("longitude"));
				var distance = map.getDistance(point1, point2);
				$(".body_li_distance").eq(i).text(parseInt(distance) + "m")
			}
		}
	}
}
//综合排序和距离最近
function index_class(ob) {
	$(".body_clas_span").removeClass("body_clas_on")
	$(ob).addClass("body_clas_on");
	//刷新当前页面
}
//ajax
function ajax(page, keyword) {
	if(keyword == null) {
		keyword = "1";
	}
	$.ajax({
		url: web_url + '/ywyf-weixin/spmkt/searchProductOrSpmkt?keyword=' + keyword + '&spmktId=1&pageNo=' + page + '&city=&type=1', //地址
		dataType: "json",
		type: "post",
		xhrFields: {
			withCredentials: true
		},
		timeout: 50000,
		success: function(data) {
			console.log(JSON.stringify(data));
			var strhtml = "";
			var address = "";
			var distance = ""; //距离
			var sales = "";
			for(i = 0; i < data.product.list.length; i++) {
				//判断地址是否为null
				if(data.product.list[i].address == null) {
					address = "暂未填写"
				} else {
					address = data.product.list[i].address
				}
				//判断通告是否为空
				if(data.product.list[i].notice == null || data.product.list[i].notice == "") {
					notice = "商家尚未填写通告"
				} else {
					notice = data.product.list[i].notice
				}
				//销售量
				if(data.product.list[i].sales == null || data.product.list[i].sales == ""){
					sales = "0"
				}else{
					sales = data.product.list[i].sales
				}
				//加载页面
				strhtml += '<li class="body_li" latitude="' +
					data.product.list[i].latitude +
					'" longitude="' +
					data.product.list[i].longitude +
					'" onclick="window.location.href=' + "'store_store.html?id=" +
					data.product.list[i].supermarketId + "'" +
					'"><div class="body_li_store"><img src="' +
					data.product.list[i].spmktcover +
					'" class="body_li_img" onerror="javascript:this.src=' + "'../img/TB.jpg'" + '"/><div class="body_li_text"><p class="body_li_h1">' +
					data.product.list[i].spmktname +
					'</p><p class="body_li_h3">店铺地址：<span>' +
					address +
					'</span></p><p class="body_li_h3">店铺通告:<span>' +
					notice +
					'</span><span class="body_li_distance">' +
					distance +
					'</span></p></div></div><div class="body_li_commodity"><img src="' +
					data.product.list[i].cover +
					'" class="commodity_img" onerror="javascript:this.src=' + "'../img/TB.jpg'" + '"/><div class="commodity_text"><p class="body_li_h1">' +
					data.product.list[i].pname +
					'</p><p class="body_li_h2"></p><p class="body_li_h3">月销售<span>' +
					sales +
					'</span>单</p><p class="body_li_h4">￥<span>' +
					data.product.list[i].discountPrice +
					'</span><del>￥<span>' +
					data.product.list[i].price +
					'</span></del></p></div></div></li>'
			}
			if(page == 1) {
				$(".body_list").empty().append(strhtml)
			} else {
				$(".body_list").append(strhtml)
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
	ajax(1, sessionStorage.storeSearch)
	//下拉加载
	var page = 0;
	$(window).scroll(function() {
		if($(window).scrollTop() + $(window).height() + 5 > $(document).height()) {
			page += 1
			ajax(page, sessionStorage.storeSearch)
		}
	});
})