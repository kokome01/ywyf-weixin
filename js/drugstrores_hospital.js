$(document).ready(function() {
	var cla = getQueryString("cla");
	ajax(1, 1);
	//下拉加载
	var page = 1;
	$(window).scroll(function() {
		if($(window).scrollTop() + $(window).height() + 5 > $(document).height()) {
			console.log(page)
			page += 1
			ajax(page, 0);
		}
	});
})

function ajax(page, nu) {
	var search = "";
	if(sessionStorage.mainSearch == undefined) {
		search = ""
	} else {
		search = sessionStorage.mainSearch
	}
	//console.log('keyword=' + search + '&pageNo=' + page)
	$.ajax({
		url: web_url + '/ywyf-weixin/hospital/hospital?keyword=' + search + '&pageNo=' + page, //地址
		dataType: "json",
		type: "post",
		xhrFields: {
			withCredentials: true
		},
		timeout: 50000,
		beforeSend: function(XMLHttpRequest) { //加载开始显示
			$(".loading").css("display", "block");
		},
		success: function(data) {
			console.log(JSON.stringify(data))
			var strhtml = "";
			for(i = 0; i < data.hospital.list.length; i++) {
				if(data.hospital.list[i].isShow){
					strhtml += '<li class="drugstores_li" onclick="info(' +
					data.hospital.list[i].id +
					')" hid="' +
					data.hospital.list[i].id +
					'"><div><img src="' +
					data.hospital.list[i].pic +
					'" class="drugstores_img" onerror="javascript:this.src=' + "'../img/2017.jpg'" + '"/><div class="drugstores_text"><p class="hospital_name">' +
					data.hospital.list[i].hosName +
					'</p><p>地址：<span class="hospital_address">' +
					data.hospital.list[i].address +
					'</span></p><p>关联药房：<span class="hospital_drugstores" x='+data.hospital.list[i].locationX+' y='+data.hospital.list[i].locationY+' >' +
					"" +
					'</span></p><p>联系方式：<span class="hospital_tel">' +
					data.hospital.list[i].tel +
					'</span></p></div></div></li>'
				}
				
			}
			if(nu == 0) {
				$(".body ul").append(strhtml)
			} else {
				$(".body ul").empty().append(strhtml)
			}
			
		},
		complete: function(XMLHttpRequest, textStatus) { //加载完毕后执行
			$(".loading").css("display", "none");
			text_over()
			//相对距离
			//geolocationSupport()
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			getcode()
		},
	})
}

function info(id) {
	window.location.href = 'drugstores_home.html?id=' + id;
}

function text_over() {
	//多余的字显示...
	//可以重复使用
	var num = $('.hospital_address').size()
	for(var i = 0; i < num; i++) {
		var titleStr = $(".hospital_address").eq(i).text();
		var maxLen = 12; //设置要显示的字符数
		if(titleStr.length > maxLen) {
			$(".hospital_address").eq(i).html(titleStr.substring(0, maxLen) + "...");
		} else {
			$(".hospital_address").eq(i).html(titleStr);
		}
	}
}
/*相对距离*/
/*function geolocationSupport() {
	if(!navigator.geolocation) {
		console.log("你的浏览器不支持HTML5 Geolocation");
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
	$(".body").attr({
		"x": x,
		"y": y
	});
	//alert("经度为:" + x + "纬度为:" + y);
	// 百度地图API功能
	for(i=0;i<$(".drugstores_li").length;i++){
		if($(".hospital_drugstores").eq(i).attr("x")=="null"){
			$(".drugstores_text").eq(i).find(".hospital_drugstores").text("暂无距离")
		}else{
			//alert($(".hospital_drugstores").eq(i).attr("x"))
			var map = new BMap.Map("allmap"); // 创建Map实例
			var point1 = new BMap.Point($(".body").attr("x"), $(".body").attr("y"));
			var point2 = new BMap.Point($(".hospital_drugstores").eq(i).attr("x"), $(".hospital_drugstores").eq(i).attr("y"));
			var distance = map.getDistance(point1, point2);
			$(".hospital_drugstores").eq(i).text(parseInt(distance)+"m")
			
		}
		
	}
	
}

function error(err) {
	var errorTypes = {
		1: "用户拒绝定位服务",
		2: "获取不到定位信息",
		3: "获取定位信息超时"
	}
	console.log(errorTypes[err.code]);
}

function distance(loX, loY) {
	// 百度地图API功能
	var map = new BMap.Map("allmap"); // 创建Map实例
	var point1 = new BMap.Point(x, y);
	var point2 = new BMap.Point(loX, loY);
	var distance = map.getDistance(point1, point2);
	$(".bbb").text(distance)
}
*/