$(document).ready(function() {
	var sea = sea = getQueryString("val"),
		type = getQueryString("type"),
		ph = getQueryString("phId");
	//第一次加载
	choice_ajax(1, 1, sea, type, ph)
	//下拉加载
	var page = 1;
	$(window).scroll(function() {
		if($(window).scrollTop() + $(window).height() + 5 > $(document).height()) {
			page += 1
			
			choice_ajax(0, page, sea, type, ph)
		}
	});
})
//ajax
function choice_ajax(no, page, sea, type, ph) { //是1否0为第一次加载，页数，搜索内容，产品类型，药房id
	//console.log(sessionStorage.mainSearch)
	var ph_val = ""
	if(ph == null) {
		ph_val = ""
	} else {
		ph_val = ph
	}
	//console.log(page)
	//console.log("pageNo=" + page + "&keyword=" + sea + "&typeId=" + type + "&phId=" + ph_val)
	//ajax
	$.ajax({
		url: web_url + '/ywyf-weixin/product/search', //地址
		dataType: "json",
		type: "post",
		xhrFields: {
			withCredentials: true
		},
		timeout: 50000,
		data: "pageNo=" + page + "&keyword=" + sea + "&typeId=" + type + "&phId=" + ph_val,
		success: function(data) {
			//搜索商品
			if(data.pagination.list.length == 0) {  //如果商品不存在
				if(page == 1) {
					if(ph_val != null || ph_val != undefined) {
						strhtml = '<li> <div class="non_cue"> <img src="../img/nono.png" /> <p>很抱歉，您寻找的商品本药房不存在，可能已下架或者被转移。</p> <p>建议你:</p> <p>1.看看输入的文字是否有误</p> <p>2.致电客服：0571-8257-6221</p> </div> </li>'
					} else {
						strhtml = '<li> <div class="non_cue"> <img src="../img/nono.png" /> <p>很抱歉，您搜索的“<span class="non_cue_name">' + sessionStorage.mainSearch + '</span>“商品不存在，可能已下架或者被转移。</p> <p>建议你:</p> <p>1.看看输入的文字是否有误</p> <p>2.致电客服：0571-8257-6221</p> </div> </li>'
					}

					$(".body>ul").empty().append(strhtml);
				}
			} else {
				var strhtml = ""
				for(i = 0; i < data.pagination.list.length; i++) {
					strhtml += '<li class="drugstores_li" onclick="intro(' +
						data.pagination.list[i].id +
						')"><div><img src="' +
						data.pagination.list[i].pic +
						'" class="drugstores_img" /><div class="drugstores_text"><p class="drugstores_name">' +
						data.pagination.list[i].name +
						'</p><p class="drugstores_address"></p><p class="drugstores_address"></p><label class="drugstores_price">￥<span>' +
						data.pagination.list[i].price +
						'</span></label></div></div></li>'
				}
				if(no == 1) {
					$(".body>ul").empty().append(strhtml);
				} else {
					$(".body>ul").append(strhtml);
				}
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
//点击头部的商品类别
function drugType(type) {
	choice_ajax(1, 1, "", type, getQueryString("phId"))
}