$(document).ready(function() {
	ajax(0, "/ywyf-weixin/user/myProduct")
	//下拉加载
	var page = 1;
	$(window).scroll(function() {
		if($(window).scrollTop() + $(window).height() + 5 > $(document).height()) {
			page += 1
			if($(".collection_h_on").text() == "商品") {
				ajax(1, "/ywyf-weixin/user/myProduct")
			} else {
				ajax(1, "/ywyf-weixin/user/myPharmacy")
			}
		}
	});
})
//收藏列表
function collection(ob) {
	$(".collection_h").removeClass("collection_h_on");
	$(ob).addClass("collection_h_on");
	if($(ob).text() == "商品") {
		ajax(0, "/ywyf-weixin/user/myProduct")
	} else {
		ajax(0, "/ywyf-weixin/user/myPharmacy")
	}
}

//ajax
function ajax(no, urls) {
	var strhtml = ""
	$.ajax({
		url: web_url + urls, //地址
		dataType: "json",
		type: "post",
		timeout: 50000,
		xhrFields: {
			withCredentials: true
		},
		success: function(data) {
			console.log(JSON.stringify(data))
			if(data.msg == "请登录") {
				console.log("请登录");
				/*window.location.href = '../other/login.html'*/
			} else {
				//成功
				if(urls == "/ywyf-weixin/user/myProduct") { //商品
					for(i = 0; i < data.favoriteProduct.length; i++) {
						strhtml += '<li class="collection_li" oid="' +
							data.favoriteProduct[i].id +
							'" ><div class="collection_hover" onclick="intro(' +
							data.favoriteProduct[i].isShow +
							',' +
							data.favoriteProduct[i].isDel +
							',' +
							data.favoriteProduct[i].id +
							',1)"></div><img src="' +
							data.favoriteProduct[i].pic +
							'" /><div class="collection_li_text"><p class="collection_li_name">' +
							data.favoriteProduct[i].name +
							'</p><span class="collection_li_del" onclick="collection_del(this)">取消收藏</span></div></li>'
					}
				} else {
					for(i = 0; i < data.pharmacies.length; i++) { //药房
						strhtml += '<li class="collection_li" oid="' +
							data.pharmacies[i].id +
							'" ><div class="collection_hover" onclick="intro(' +
							data.pharmacies[i].isShow +
							',' +
							data.pharmacies[i].isDel +
							',' +
							data.pharmacies[i].id +
							',2)"></div><img src="' +
							data.pharmacies[i].pic +
							'" /><div class="collection_li_text"><p class="collection_li_name">' +
							data.pharmacies[i].pharmacyName +
							'</p><span class="collection_li_del" onclick="collection_dely(this)">取消收藏</span></div></li>'
					}
				}

				if(no == 0) { //第一次加载
					$(".collection_list ul").empty().append(strhtml)
				} else {
					$(".collection_list ul").empty().append(strhtml)
				}
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
//商品取消收藏
function collection_del(ob) {
	//ajax
	$.ajax({
		url: web_url + "/ywyf-weixin/product/favorite", //地址
		dataType: "json",
		type: "post",
		xhrFields: {
			withCredentials: true
		},
		timeout: 50000,
		data: "proid=" + $(ob).parents(".collection_li").attr("oid") + "&isFavorite=1",
		success: function(data) {
			//console.log(JSON.stringify(data))
			if(data.msg == "请登录") {
				/*//alert("请登录");
				window.location.href = '../other/login.html'*/
			} else {
				//成功
				window.location.reload()
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			getcode()
		},
	})
}
//药房取消收藏
function collection_dely(ob) {
	var isFavorite = ""
	$.ajax({
		url: web_url + '/ywyf-weixin/hospital/favorite?phId=' + $(ob).parents(".collection_li").attr("oid") + '&isFavorite=1', //地址
		dataType: "json",
		type: "post",
		xhrFields: {
			withCredentials: true
		},
		timeout: 50000,
		success: function(data) {
			console.log(JSON.stringify(data))
			if(data.status == 1) {
				window.location.reload()
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
//跳转到产品详细页
function intro(show,del, oid, zhi) {
	if(zhi == 1) {
		if(!del) {
			window.location.href = '../other/introduction.html?id=' + oid
		} else {
			alert("你收藏的商品已经下架")
		}

	} else {

		if(show) {
			window.location.href = '../other/drugstores_info.html?info=' + oid
		} else {
			alert("你收藏的药房已经关闭运营")
		}

	}

}