$(document).ready(function() {
	//星级
	xin()
	//ajax
	ajax(getQueryString("id"))
})
//ajax
function ajax(id) {
	if(id == null) {
		id = 1;
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
			console.log(JSON.stringify(data));
			var logo = "";
			var name = "";
			var sales = "";
			var notice = "";
			var info = "";
			var tel = "";
			var address = "";
			var qualification = ""
			if(data.msg == "数据获取成功") {
				//商家图片
				if(data.spmktInfo.images == "") {
					logo = "../img/TB.jpg"
				}
				$("#store_logo").attr("src", logo)
				//商家名字
				if(data.spmktInfo.name == "") {
					name = "尚未填写商家名称"
				} else {
					name = data.spmktInfo.name
				}
				$("#storefront_name").text(name);
				//商家销售额度
				if(data.spmktInfo.sales == null) {
					sales = "0"
				} else {
					sales = data.spmktInfo.sales
				}
				$("#storefront_sales").text(sales);
				//商家公告
				if(data.spmktInfo.notice == "") {
					notice = "[公告]"
				} else {
					notice = "[公告]" + data.spmktInfo.notice
				}
				$("#store_notice").text(notice);
				//商家信息
				if(data.spmktInfo.info == "") {
					info = "尚未填写商家信息"
				} else {
					info = data.spmktInfo.info
				}
				$("#store_info").text(info);
				//商家电话
				if(data.spmktInfo.tel == "") {
					tel = "尚未填写商家电话"
				} else {
					tel = data.spmktInfo.tel
				}
				$("#store_tel").text(tel);
				//商家地址
				if(data.spmktInfo.address == "") {
					address = "尚未填写商家电话"
				} else {
					address = data.spmktInfo.address
				}
				$("#store_address").text(address);
				//商家营业时间
				if(data.spmktInfo.businessHours==null){
					$("#store_businessHours").text("商家暂无填写营业时间")
				}else{
					$("#store_businessHours").text(data.spmktInfo.businessHours)
				}
				//商家配送
				var postage = 0;
				if(data.spmktInfo.postage!=null){
					postage = data.spmktInfo.postage
				}
				
				if(data.spmktmailfee[0].rule==0){
					$("#spmktmailfee").html('<span class="font_12" >'+data.spmktmailfee[0].price+'</span>元起配送&nbsp;&nbsp;&nbsp;包邮 ')
				}else if(data.spmktmailfee[0].rule==1){
					$("#spmktmailfee").html('<span class="font_12" >'+data.spmktmailfee[0].price+'</span>元起配送&nbsp;&nbsp;&nbsp;配送费用：￥<span class="font_12" >'+postage+'</span>&nbsp;&nbsp;&nbsp;满<span class="font_12">'+data.spmktmailfee[0].amount+'</span>kg包邮')
				}else if(data.spmktmailfee[0].rule==2){
					$("#spmktmailfee").html('<span class="font_12" >'+data.spmktmailfee[0].price+'</span>元起配送&nbsp;&nbsp;&nbsp;配送费用：￥<span class="font_12" >'+postage+'</span>&nbsp;&nbsp;&nbsp;满<span class="font_12">'+data.spmktmailfee[0].amount+'</span>元金额包邮')
				}else if(data.spmktmailfee[0].rule==3){
					$("#spmktmailfee").html('<span class="font_12" >'+data.spmktmailfee[0].price+'</span>元起配送&nbsp;&nbsp;&nbsp;配送费用：￥<span class="font_12" >'+postage+'</span> ')
				}
				//商家资质
				if(data.spmktInfo.qualification == null) {
					qualification = "商家尚未获取营业执照"
				} else {
					var strqualification = "";
					for(i = 0; i < data.spmktInfo.qualification.length; i++) {
						strqualification += '<img src="' + data.spmktInfo.qualification[i].img + '" />'
					}
					qualification = strqualification
				}
				$("#store_qualification").text(qualification);
			} else {
				alert("数据获取失败，请联系平台客户")
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
//星级
function xin() {
	var xin = parseFloat($("#storefront_xin").text()) * 10;
	var wid = 0

	if(xin >= 40) {
		wid = (xin - 40) / 10 * 15
		$(".index_i_grade").eq(4).css("width", wid + "px");
	} else if(xin < 40 && xin >= 30) {
		alert(1)
		wid = (xin - 30) / 10 * 15
		$(".index_i_grade").eq(4).css("width", "0px");
		$(".index_i_grade").eq(3).css("width", wid + "px");
	} else if(xin < 30 && xin >= 20) {

		wid = (xin - 20) / 10 * 15
		$(".index_i_grade").eq(4).css("width", "0px");
		$(".index_i_grade").eq(3).css("width", "0px");
		$(".index_i_grade").eq(2).css("width", wid + "px")
	} else if(xin < 20 && xin >= 10) {
		wid = (xin - 10) / 10 * 15
		$(".index_i_grade").eq(4).css("width", "0px");
		$(".index_i_grade").eq(3).css("width", "0px");
		$(".index_i_grade").eq(2).css("width", "0px");
		$(".index_i_grade").eq(1).css("width", wid + "px")
	} else if(xin < 10 && xin >= 0) {
		wid = (xin) / 10 * 15
		$(".index_i_grade").eq(4).css("width", "0px");
		$(".index_i_grade").eq(3).css("width", "0px");
		$(".index_i_grade").eq(2).css("width", "0px");
		$(".index_i_grade").eq(1).css("width", "0px");
		$(".index_i_grade").eq(0).css("width", wid + "px")
	}
}

function report() {
	window.location.href = 'store_report.html?id=' + getQueryString("id")
}