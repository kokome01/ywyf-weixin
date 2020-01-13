$(document).ready(function() {
	$("#drugstores_search_val").val("")
	recommend_self();
})
//收藏
function collection() {
	var isFavorite = ""
	if($(".drugstores_collect_y").text() == "未收藏") {
		isFavorite = "0"
	} else {
		isFavorite = "1"
	}
	$.ajax({
		url: web_url + '/ywyf-weixin/hospital/favorite?phId=' + $(".drugstores_info").attr("ph") + '&isFavorite=' + isFavorite, //地址
		dataType: "json",
		type: "post",
		xhrFields: {
			withCredentials: true
		},
		timeout: 50000,
		success: function(data) {
			console.log(JSON.stringify(data))
			if(data.status == 1) {
				window.location.reload();
			} else {
				/*alert("请登录");
				window.location.href = '../other/login.html'*/
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
//搜索本药房商品
function search_self(zh, type) { //是否为搜索 ，产品类型
	var val = ""
	if(zh == 1) { //表示是搜索
		val = $("#drugstores_search_val").val();
	}
	sessionStorage.mainSearch = null;
	window.location.href = '../other/drugstores_drug.html?val=' + val + "&phId=" + $(".drugstores_info").attr("ph") + "&type=" + type
}
//点击地址
function address_self() {

}
//ajax加载推荐
function recommend_self() {
	$.ajax({
		url: web_url + '/ywyf-weixin/hospital/pharmacyInfo?pid=' + getQueryString("info"), //地址
		dataType: "json",
		type: "post",
		xhrFields: {
			withCredentials: true
		},
		timeout: 50000,
		success: function(data) {
			console.log(JSON.stringify(data));
			var strhtml = "";
			var	len = "";
			var manager = "";
			var tel = "";
			var hosName = "";
			var address = "";
			if(data.product.list.length >= 6) {
				len = 6
			} else {
				len = data.product.list.length
			}
			for(i = 0; i < len; i++) {
				strhtml += '<li class="drugstores_drug_li" onclick="intro('
					+data.product.list[i].id+
					')"><img src="' +
					data.product.list[i].pic +
					'" onerror="javascript:this.src=' + "'../img/2017.jpg'" + '"/><div class="drugstores_drug_text"><p class="drugstores_drug_name">' +
					data.product.list[i].name +
					'</p><p class="drugstores_drug_price">￥<span>' +
					data.product.list[i].price +
					'</span></p></div></li>'
			}
			$(".drugstores_drug_ul").empty().append(strhtml);
			//其他信息
			$(".drugstores_info").attr("ph", data.pharmacy.id) //店铺id
			$(".drugstores_info").find("img").attr("src", data.pharmacy.pic)
			$("#pharmacy_name").text(data.pharmacy.pharmacyName); //药房名称
			//药房负责人
			if(data.pharmacy.manager==null){
				manager = "尚未填写"
			}else{
				manager = data.pharmacy.manager
			}
			$("#drugstores_details_b1").text(manager); 
			//药房电话
			if(data.pharmacy.tel=="110"){
				tel = "0571 8257 6221"
			}else{
				tel = data.pharmacy.tel
			}
			$("#drugstores_details_b2").text(tel); 
			//药房关联的医院
			if(data.pharmacy.hosName==null){
				hosName = "尚未填写"
			}else{
				hosName = data.pharmacy.hosName
			}
			$("#drugstores_details_b3").text(hosName); 
			 //药房地址
			 if(data.pharmacy.address==null){
				address = "尚未填写"
			}else{
				address = data.pharmacy.address
			}
			$(".drugstores_address_t2").text(address);
			//收藏
			if(data.isFavorite == 1) {
				$(".drugstores_collect_y").text("已收藏")
				$(".drugstores_collect").text("取消收藏").css({
					"color": "#666",
					"border-color": "#666"
				})
			} else {
				$(".drugstores_collect_y").text("未收藏")
				$(".drugstores_collect").text("添加收藏").css({
					"color": "#cc0000",
					"border-color": "#cc0000"
				})
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			getcode()
		},
	})
}
//跳转到产品详细页
function intro(id) {
	window.location.href = 'introduction.html?id=' + id
}