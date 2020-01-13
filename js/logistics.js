$(document).ready(function() {
	if(getQueryString("number")!=null){
		logistics(getQueryString("number"))
	}else{
		$(".logistics_company span").text("暂无物流信息");
		$(".logistics_numbers span").text("暂无物流信息");
		$(".logistics_state span").text("暂无物流信息");
		$(".logistics_tel span").text("暂无物流信息");
	}
	
})
//进行物流追踪
function logistics(number) {
	$.ajax({
		url: "http://www.51ywyf.com/YWYF/express/expressQueryByNo?no="+number+'&type=',
		dataType: "json",
		type: "post",
		timeout: 50000,
		xhrFields: {
			withCredentials: true
		},
		success: function(data) {
			console.log(data)
			var data = JSON.parse(data)
			var strhtml = ""; //设定空值
			var issign = ""
			var exp = ""
			var zhu = 0;
			var ku = ""
			var quhtml = ""
			var numbers = ""
			if(data.result.list.length != 0) {
				for(var i = 0; i < data.result.list.length; i++) //循环
				{
					strhtml += '<li><p>' +
						data.result.list[i].status +
						'</p><p class="logis_time">' +
						data.result.list[i].time +
						'</p><div class="logis_symbol"></div></li>' //整个值修改
				}
				//快递
				ku = data.result.expName
				if(ku == "sto") {
					exp = "申通快递"
				} else if(ku == "sfexpress") {
					exp = "顺丰快递"
				} else if(ku == "yto") {
					exp = "圆通快递"
				} else if(ku == "yunda") {
					exp = "韵达快递"
				} else if(ku == "zto") {
					exp = "中通快递"
				} else if(ku == "EMS") {
					exp = "EMS快递"
				} else if(ku == "deppon") {
					exp = "德邦快递"
				} else if(ku == "htky") {
					exp = "百世快递"
				} else if(ku == "ttkdex") {
					exp = "天天快递"
				} else {
					exp = "（" + ku + "）"
				}
				//订单状态
				if(data.result.deliverystatus==0){
					zhu = '快递收件(揽件) '
				}else if(data.result.deliverystatus==1){
					zhu = '在途中 '
				}else if(data.result.deliverystatus==2){
					zhu = '正在派件'
				}else if(data.result.deliverystatus==3){
					zhu = '已签收'
				}else if(data.result.deliverystatus==4){
					zhu = '派送失败'
				}else if(data.result.deliverystatus==5){
					zhu = '疑难件'
				}else if(data.result.deliverystatus==6){
					zhu = '退件签收'
				}
				
				//物流单号
				numbers = data.result.number
				
			} else {
				exp = "暂无物流信息"
				issign = "暂无物流信息"
				strhtml = "暂无物流信息，如有疑问请联系客服"
				numbers = "暂无物流信息"
			}
			//添加物流
			quhtml = '<div class="black_box"><div class="logistics_box"><div class="logistics_tou"><span>物流动态</span><span></span></div><div class="logistics_head"><p class="logistics_state">物流状态：<span></span></p><p class="logistics_company">物流公司：<span></span></p><p class="logistics_numbers">快递单号：<span></span></p><p>平台电话：<span>0571-8373-1253</span></p></div><ul class="logistics_body" id="logistics_body">' + strhtml + '</ul></div></div>'
			$(".logis_wire ul").empty().append(strhtml); //添加到页面
			//添加物流状态
			$(".logistics_state span").text(issign);
			$(".logistics_company span").text(exp);
			$(".logistics_numbers span").text(numbers);
			$(".logistics_state span").text(data.result.expSite);
			$(".logistics_tel span").text(data.result.expPhone);
			$(".logistics_box").show();
			//$("body").addClass("ovfHiden")
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			getcode()
		},
	});
}
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