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

function ajax(page, nu) { //页数，是否为初次加载
	var search = ""
	if(sessionStorage.mainSearch == undefined ||sessionStorage.mainSearch == "null") {
		search = ""
	} else {
		search = sessionStorage.mainSearch
	}
	$.ajax({
		url: web_url + '/ywyf-weixin/hospital/pharmacy?keyword=' + search + '&pageNo=' + page, //地址
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
			var strhtml = "",
				address = "",
				cell = "";
			for(i = 0; i < data.hospital.list.length; i++) {
				//地区
				if(data.hospital.list[i].address == null) {
					address = "未填写地区"
				} else {
					address = data.hospital.list[i].address
				}
				//联系方式
				if(data.hospital.list[i].cellPhone == null) {
					cell = "未填写联系方式"
				} else {
					cell = data.hospital.list[i].cellPhone
				}
				//加载
				strhtml += '<li class="drugstores_li" onclick="info(' +
					data.hospital.list[i].id +
					')"><div><img src="' +
					data.hospital.list[i].pic +
					'" class="drugstores_img"  onerror="javascript:this.src=' + "'../img/2017.jpg'" + '"/><div class="drugstores_text"><p class="drugstores_name">' +
					data.hospital.list[i].pharmacyName +
					'</p><p class="drugstores_address">地区：<span>' +
					address +
					'</span></p><p>所属医院：<span>' +
					data.hospital.list[i].hospitalName +
					'</span></p><span class="drugstores_distance">' +
					"" +
					'</span></div></div></li>'
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
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			getcode()
		},
	})
}

function info(info) {
	window.location.href = 'drugstores_info.html?info=' + info
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