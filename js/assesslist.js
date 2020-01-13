function assess(ob) {
	if($(ob).attr("hid") == 0) {
		$(ob).attr("hid", "1").find(".assess_val").removeClass("assess_hide")
	} else {
		$(ob).attr("hid", "0").find(".assess_val").addClass("assess_hide")
	}
}
$(document).ready(function() {
	var page = 1
	ajax(1, 0);
	$(window).scroll(function() {
		if($(window).scrollTop() + $(window).height() + 5 > $(document).height()) {
			page += 1
			ajax(2, 1)
		}
	});
})

function ajax(page, emt) {
	var strhtml = "",
		greade = ""
	$.ajax({
		url: web_url + '/ywyf-weixin/order/commList', //地址
		dataType: "json",
		type: "post",
		xhrFields: {
			withCredentials: true
		},
		timeout: 50000,
		data: 'pageNo=' + page,
		success: function(data) {
			console.log(JSON.stringify(data))
			//window.location.href = '../index.html';
			if(data.status == 1) {
				for(i = 0; i < data.pagination.list.length; i++) {
					if(data.pagination.list[i].greade == 0) {
						greade = "好评"
					} else if(data.pagination.list[i].greade == 1) {
						greade = "中评"
					} else if(data.pagination.list[i].greade == 2) {
						greade = "差评"
					}
					strhtml += '<li class="assess_li" hid="0" onclick="assess(this)"><img src="' +
						data.pagination.list[i].product.pic +
						'" /><div class="assess_text"><p>' +
						data.pagination.list[i].product.name +
						'</p><p class="assess_time"><span>' +
						formatDateTime(data.pagination.list[i].addtime * 1000) +
						'</span><span>' +
						greade +
						'</span></p><p class="assess_val assess_hide">我的评价：<span>' +
						data.pagination.list[i].content +
						'</span></p></div></li>'
				}
				if(emt == 0) {
					$(".body ul").empty().append(strhtml)
				} else {
					$(".body ul").append(strhtml)
				}

			} else {
				//window.location.href = '../other/login.html'
			}

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