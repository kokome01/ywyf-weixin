$(document).ready(function() {
	var search = getQueryString("search");
	if(search == 1) {
		mode(1, 'hospital()')
	} else if(search == 2) {
		mode(2, 'drugstrores()')
	}
})
//展开列表
function search_mode() {
	$(".search_mode_list").slideToggle();
}

function mode(num, onc) {
	$(".search_mode").attr("mode", num);
	$(".search_mode_list").find("li").removeClass("search_mode_list_o");
	$(".search_mode_list ul").find("li").eq(num).addClass("search_mode_list_o");
	$(".search_mode_list").slideToggle();
	$("#search_mode_name").text($(".search_mode_list ul").find("li").eq(num).text());
	$(".search_text").attr("onclick", onc)
}
//判断搜索是否有文字
function search_list() {
	var urls = "";
	var val = $("#home_text").val();
	var mode = $(".search_mode").attr("mode");
	if(val == "") {
		$(".search_li_box").hide()
		$(".search_ul").empty();
	} else {
		$(".search_ul").empty();
		$(".search_li_box").show();
		if(mode == 0) {
			urls = '/ywyf-weixin/product/search';
		} else if(mode == 1) {
			urls = '/ywyf-weixin/hospital/hospital';
		} else if(mode == 2) {
			urls = '/ywyf-weixin/hospital/pharmacy';
		}
		$.ajax({
			url: web_url + urls, //地址
			dataType: "json",
			type: "post",
			xhrFields: {
				withCredentials: true
			},
			timeout: 50000,
			data: "pageNo=" + "1" + "&keyword=" + val,
			success: function(data) {
				console.log(JSON.stringify(data));
				//搜索商品
				var strhtml = "";
				if(mode == 0) {
					for(i = 0; i < data.pagination.list.length; i++) {
						strhtml += '<li class="search_li" onclick="search_li(this)"><span>' +
							data.pagination.list[i].name +
							'</span><img src="../img/right (1).png" /></li>'
					}
				} else if(mode == 1) {
					for(i = 0; i < data.hospital.list.length; i++) {
						strhtml += '<li class="search_li" onclick="hospital_list(this)"><span>' +
							data.hospital.list[i].hosName +
							'</span><img src="../img/right (1).png" /></li>'
					}
				} else if(mode == 2) {
					for(i = 0; i < data.hospital.list.length; i++) {
						strhtml += '<li class="search_li" onclick="drugstrores_li(this)"><span>' +
							data.hospital.list[i].pharmacyName +
							'</span><img src="../img/right (1).png" /></li>'
					}
				}
				$(".search_ul").empty().append(strhtml);

			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				getcode()
			},
		})
	}
}

function search_button() {
	val = $("#home_text").val();
	//ajax
	sessionStorage.mainSearch = val;
	window.location.href = 'choice.html'
}

function search_li(ob) {
	//ajax
	sessionStorage.mainSearch = $(ob).find("span").text();
	console.log(sessionStorage.mainSearch)
	window.location.href = 'choice.html'
}

function hospital() {
	sessionStorage.mainSearch = $("#home_text").val();
	window.location.href = 'drugstores_hospital.html'
}

function hospital_list(ob) {
	sessionStorage.mainSearch = $(ob).find("span").text();
	window.location.href = 'drugstores_hospital.html'
}

function drugstrores() {
	sessionStorage.mainSearch = $("#home_text").val();
	window.location.href = 'drugstores_list.html'
}

function drugstrores_li(ob) {
	sessionStorage.mainSearch = $(ob).find("span").text();
	window.location.href = 'drugstores_list.html'
}