//取消收藏
function collection_cancel(ob) {
	var mymessage = confirm("确认取消收藏？");
	if(mymessage == true) {
		console.log(1)
		$.ajax({
			url: web_url + '/ywyf-weixin/spmkt/favorite?spmktId=' + $(ob).parents(".collection_li").attr("spmktId"), //地址
			dataType: "json",
			type: "post",
			xhrFields: {
				withCredentials: true
			},
			timeout: 50000,
			success: function(data) {
				console.log(JSON.stringify(data));
				if(data.msg == "请登录") {
					alert("你尚未登录")
					window.location.href = '../other/login.html'
				} else {

					window.location.reload();
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
}
$(document).ready(function() {
	ajax()
})
//ajax
function ajax() {
	$.ajax({
		url: web_url + '/ywyf-weixin/spmkt/myFavorite', //地址
		dataType: "json",
		type: "post",
		xhrFields: {
			withCredentials: true
		},
		timeout: 50000,
		success: function(data) {
			console.log(JSON.stringify(data))
			if(data.msg == "请登录") {
				alert("你尚未登录")
				window.location.href = '../other/login.html'
			} else {
				var strhtml = "";
				var sales = "";
				var cover = "";
				var postage = ""
				for(i = 0; i < data.myFavorites.length; i++) {
					//销售单数
					if(data.myFavorites[i].sales == null) {
						sales = 0
					} else {
						sales = data.myFavorites[i].sales
					}
					//起配送
					if(data.myFavorites[i].cover == null) {
						cover = 0
					} else {
						cover = data.myFavorites[i].cover
					}
					//配送费
					if(data.myFavorites[i].postage == null) {
						postage = 0;
					} else {
						postage = data.myFavorites[i].postage
					}
					strhtml += '<li class="collection_li" spmktId="' + data.myFavorites[i].id + '"><img src="' +
						data.myFavorites[i].images +
						'" onerror="javascript:this.src=' + "'../img/TB.jpg'" + '"/><div class="collection_text"><p class="collection_name">' +
						data.myFavorites[i].name +
						'<span class="collection_cancel" onclick="collection_cancel(this)">取消收藏</span></p><p class="collection_t">月销售<span class="collection_sell">' +
						sales +
						'</span>单</p><p class="collection_t">店家地址：<span>' + data.myFavorites[i].address + '</span></p><p class="collection_t">配送费￥<span class="collection_money">' +
						postage +
						'</span></p></div><a class="collection_storefront" href="store_store.html?id=' +
						data.myFavorites[i].id +
						'"></a></li>'
				}
				$(".body").empty().append(strhtml)
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