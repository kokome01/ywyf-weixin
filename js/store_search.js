//判断搜索是否有文字
function search_list() {
	var val = $("#home_text").val()
	if(val == "") {
		$(".search_li_box").hide()
		$(".search_ul").empty();
	} else {
		$(".search_ul").empty();
		$(".search_li_box").show();
		$.ajax({
			url: web_url + '/ywyf-weixin/spmkt/searchProductOrSpmkt?keyword=' + $("#home_text").val() + '&spmktId=1&pageNo=1&city=&type=1', //地址
			dataType: "json",
			type: "post",
			xhrFields: {
				withCredentials: true
			},
			timeout: 50000,
			success: function(data) {
				console.log(JSON.stringify(data));
				//搜索商品
				var strhtml = "";
				for(i = 0; i < data.product.list.length; i++) {
					strhtml += '<li class="search_li" onclick="drugstrores_li(this)"><span>' +
						data.product.list[i].pname +
						'</span><img src="../img/right (1).png" /></li>'
				}
				$(".search_ul").empty().append(strhtml);

			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				getcode()
			},
		})
	}
}
//点击搜索
function search_button() {
	val = $("#home_text").val();
	//ajax
	sessionStorage.storeSearch = val;
	window.location.href = 'store_choice.html'
}
//点击相关产品
function drugstrores_li(ob) {
	//ajax
	sessionStorage.storeSearch = $(ob).find("span").text();
	window.location.href = 'store_choice.html'
}