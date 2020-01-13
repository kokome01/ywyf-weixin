$(document).ready(function() {
	var oid = localStorage.assessOid;
	var strhtml = "";
	var inputs = ""
	$.ajax({
		url: web_url + '/ywyf-weixin/order/toComm?oid=' + oid, //地址
		dataType: "json",
		type: "post",
		xhrFields: {
			withCredentials: true
		},
		timeout: 50000,
		success: function(data) {
			console.log(JSON.stringify(data))
			//window.location.href = '../index.html';
			for(i = 0; i < data.order.orderProducts.length; i++) {
				if(data.order.orderProducts[i].isOnline == true) {
					inputs = '<input type="button" id="" value="已评价" />'
				} else {
					inputs = '<input type="button" id="" value="评价晒单" onclick="assessul(this)"/>'
				}
				strhtml += '<li class="assess_li1 assess_li" hid="0" onclick="assess(this)" pid="' +
					data.order.orderProducts[i].id +
					'"><img src="' +
					data.order.orderProducts[i].sku.product.pic +
					'" /><div class="assess_text"><p>' +
					data.order.orderProducts[i].sku.product.name +
					'</p>' +
					inputs +
					'</div></li>'
			}
			$(".body ul").empty().append(strhtml)
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			getcode()
		},
	})
})

function assessul(ob) {
	localStorage.assessName = $(ob).parents(".assess_text").find("p").text();
	localStorage.assessPic = $(ob).parents(".assess_li").find("img").attr("src");
	localStorage.assessPid = $(ob).parents(".assess_li").attr("pid");

	window.location.href = '../person/assess.html';
}