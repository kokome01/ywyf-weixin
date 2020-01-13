$(document).ready(function() {
	//判断信息是否为0
	news()
})
//当滚动条滚动了
//滚动条
$(window).scroll(function() {
	// 滚动条距离顶部的距离 大于 200px时
	if($(window).scrollTop() >= 50) {
		$(".index_head2").addClass("index_head2_f")
	} else {
		$(".index_head2").removeClass("index_head2_f")
	}
})
//综合排序和距离最近
function index_class(ob) {
	$(".body_clas_span").removeClass("body_clas_on")
	$(ob).addClass("body_clas_on");
}
//判断信息是否为0
function news() {
	if($("#index_text_t").text() == 0) {
		$("#index_text_t").hide()
	} else {
		$("#index_text_t").show()
	}
}
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
	//临时储存经纬度
	var positions = {};
	positions.x = x;
	positions.y = y;
	sessionStorage.positions = JSON.stringify(positions);
	// 百度地图API功能
	for(i = 0; i < $(".body_list").find("li").length; i++) {
		if($(".body_li").eq(i).attr("latitude") == null || $(".body_li").eq(i).attr("longitude") == null || $(".body_li").eq(i).attr("latitude") == "null" || $(".body_li").eq(i).attr("longitude") == "null") {
			$(".body_li_distance").eq(i).text("")
		} else {
			var map = new BMap.Map("allmap"); // 创建Map实例
			var point1 = new BMap.Point(x, y);
			var point2 = new BMap.Point($(".body_li").eq(i).attr("latitude"), $(".body_li").eq(i).attr("longitude"));
			var distance = map.getDistance(point1, point2);
			$(".body_li_distance").eq(i).text(parseInt(distance) + "m")
		}
	}
	// 百度地图API功能
	var map = new BMap.Map("allmap");
	var point = new BMap.Point(x, y);
	var gc = new BMap.Geocoder();
	gc.getLocation(point, function(rs) {
		var addComp = rs.addressComponents;
		console.log(addComp.province)
		$("#province").html(addComp.city)
		//alert(addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber);
	});
}

function error(err) {
	var errorTypes = {
		1: "用户拒绝定位服务",
		2: "获取不到定位信息",
		3: "获取定位信息超时"
	}
	console.log(errorTypes[err.code]);
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
		// 百度地图API功能
		var map = new BMap.Map("allmap");
		var point = new BMap.Point(positions.x, positions.y);
		var gc = new BMap.Geocoder();
		gc.getLocation(point, function(rs) {
			var addComp = rs.addressComponents;
			console.log(addComp.province)
			$("#province").html(addComp.city)
			//alert(addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber);
		});
	}
}

//window.onload = geolocationSupport();
//设置
function set_up() {
	$("#set_up").slideToggle();
}
//ajax
function ajax(page, xl, yl) {
	if(sessionStorage.storeIndex != undefined && sessionStorage.storeIndex != "undefined") {
		$.ajax({
			url: web_url + '/ywyf-weixin/spmkt/spmkt?pageNo=' + page + '&keyword=&cityiId=&type=' + sessionStorage.storeIndex + '&latitude=' + yl + '&longitude=' + xl, //地址
			dataType: "json",
			type: "post",
			xhrFields: {
				withCredentials: true
			},
			timeout: 50000,
			success: function(data) {
				console.log(JSON.stringify(data))
				if(data.msg == "参数为空，请注意定位问题") {
					//alert("尚未获取到手机的定位信息，请刷新页面或者打开GPS。")
				}

				var strhtml = "";
				var distance = ""; //距离
				var sales = 0; //月销售
				var postage = 0 //配送费
				for(i = 0; i < data.spmkt.list.length; i++) {
					//月销售
					if(data.spmkt.list[i].sales != null) {
						sales = data.spmkt.list[i].sales
					}
					//配送费用
					if(data.spmkt.list[i].postage != null) {
						postage = data.spmkt.list[i].postage
					}
					strhtml += '<li class="body_li" latitude="' +
						data.spmkt.list[i].latitude +
						'" longitude="' +
						data.spmkt.list[i].longitude +
						'" onclick="window.location.href=' + "'store_store.html?id=" + data.spmkt.list[i].id + "'" + '"><img src="' +
						data.spmkt.list[i].images +
						'" class="body_li_img" onerror="javascript:this.src=' + "'../img/TB.jpg'" + '"/><div class="body_li_text"><p class="body_li_h1">' +
						data.spmkt.list[i].name +
						'</p><p class="body_li_h2"></p><p class="body_li_h3">月销售<span>' +
						sales +
						'</span>单</p><p class="body_li_h3">配送费￥<span>' +
						postage +
						'</span><span class="body_li_distance">' +
						distance +
						'</span></p><div class="body_coupon"></div></div></li>'
				}
				//判断是否为初次加载0为是，其他为否
				if(page == 0) {
					$(".body_list").empty().append(strhtml)
				} else {
					$(".body_list").append(strhtml)
				}
				//判断是否为便利店还是餐厅
				if(sessionStorage.storeIndex==1){ //餐厅
					$("#index_head_name").html("医院餐厅"+"&nbsp;&nbsp;&nbsp;"+"|")
				}else{
					$("#index_head_name").html("便民超市"+"&nbsp;&nbsp;&nbsp;"+"|")
				}

			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				//alert(XMLHttpRequest.status);
				//alert(XMLHttpRequest.readyState);
				//alert(textStatus);
				console.log("网络请求失败，请联系网站管理员!");
			},
		})
	}else{
		//window.location.href='../other/drugstores_home.html'
	}

}
$(document).ready(function() {
	ajax(0)
	//下拉加载
	var page = 0;
	$(window).scroll(function() {
		if($(window).scrollTop() + $(window).height() + 5 > $(document).height()) {
			page += 1
			ajax(page)
		}
	});
})