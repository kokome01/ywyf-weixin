$(document).ready(function() {
	$.ajax({
		url: web_url + '/ywyf-weixin/product/typesList', //地址
		dataType: "json",
		type: "post",
		timeout: 50000,
		xhrFields: {
			withCredentials: true
		}, //跨域产生问题（跨域请求设置withCredentials）登录，退出登录
		beforeSend:function(XMLHttpRequest){
			loding1("A2")
		},
		success: function(data) {
			console.log(JSON.stringify(data))
			if(data.status == 1) {
				var shtml = "<div class='class_left'>" +
					"<ul>" +
					"<li>" +
					"<div class='class_list class_on' onclick='class_but(this,0)'>" +
					"全部" +
					"</div>" +
					"</li>"
				for(var i = 0; i < data.data.length; i++) {
					shtml += "<li>" +
						"<div class='class_list class' x='" + data.data[i].id + "' onclick='class_but(this," + (i+1) + ")'>" +
						data.data[i].typeName +
						"</div>" +
						"</li>";

				}
				shtml +=
					"</ul>" +
					"</div>" +
					"<div class='class_right'>" +
					"<ul>";
				for(var j = 0; j < data.data.length; j++) {
					for(var k = 0; k < data.data[j].funTypes.length; k++) {
						shtml += "<li class='class_r_li ' id=" + data.data[j].id + " x=" + (j + 1) + ">" +
							"<div class=''>" +
							"<div class='class_r_head'>" +
							data.data[j].funTypes[k].name +
							"</div>" +
							"<div class='class_r_body'>" +
							"<ul>";
						for(var h = 0; h < data.data[j].funTypes[k].diseases.length; h++) {
							shtml += "<li onclick='search(this)' sea='"+data.data[j].funTypes[k].diseases[h].id+"'>" +
								"<span>" + data.data[j].funTypes[k].diseases[h].name + "</span>" +
								"</li>";
						}
						shtml += "</ul>" +
							"</div>" +
							"</div>" +
							"</li>";
					}
				}

				shtml += "</ul>" +
					"</div>";
			}

			$(".body").empty();
			$(shtml).appendTo($(".body"));

			//获取到index 的url值
			//console.log(GetQueryString("txt"))
			if(GetQueryString("txt") != 0 || GetQueryString("txt") != "") {
				$(".class_r_li").css("display", "none");
				$(".class_r_li[x=" + GetQueryString("txt") + "]").css("display", "inline-block");
				$(".class_list").removeClass("class_on");
				$(".class_left ul").find("li").eq(GetQueryString("txt")).find("div").addClass("class_on")
			} else {
				$(".class_r_li").css("display", "inline-block");
				$(".class_list").removeClass("class_on");
				$(".class_left ul").find("li").eq(0).find("div").addClass("class_on");
			}
			//展开收缩
			deploy();
		},
		complete:function(XMLHttpRequest,textStatus){
			loding2()
            // alert('远程调用成功，状态文本值：'+textStatus);
        },
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			getcode()
		},
	})
	//获取到url的值

	function GetQueryString(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
		var r = window.location.search.substr(1).match(reg); //获取url中"?"符后的字符串并正则匹配           
		var context = "";
		if(r != null) context = r[2];
		reg = null;
		r = null;
		return context == null || context == "" || context == "undefined" ? "" : context;
	}
	/*var storage=window.localStorage;
	storage.a=1;
	alert(storage.a)*/
})
window.onload = function() {
	deploy()
}
//分类第一级点击
function class_but(ob, pid) {
	if(pid != 0) {
		$(".class_r_li").css("display", "none");
		//var ida="#"+pid;
		$(".class_r_li[x=" + pid + "]").css("display", "inline-block");
	} else {
		$(".class_r_li").css("display", "inline-block");
	}
	$(".class_list").removeClass("class_on");
	$(ob).addClass("class_on");
	//ajax
}
/*第三类分类展开收起*/
function deploy_up(ob) {
	$(ob).parents(".class_r_body").find("li").css("display", "inline")
	for(j = 8; j < $(ob).parents(".class_r_body").find("li").length; j++) {
		$(ob).parents(".class_r_body").find("li").eq(j).css("display", "none")
	}
	$(ob).parents(".class_r_body").find(".class_down").css("display", "inline");
}
/*第三类检测是否超过六个*/
function deploy() {
	var strhtml1 = '<li onclick="deploy_up(this)" class="class_deploy class_up"><span>收起</span><img src="../img/up.png"/></li>'
	var strhtml2 = '<li onclick="deploy_dowm(this)" class="class_deploy class_down"><span>展开</span><img src="../img/down.png"/></li>'
	var leng = null
	for(i = 0; i < $(".class_r_li").length; i++) {
		var leng = $(".class_r_li").eq(i).find(".class_r_body li").length
		if(leng > 9) {
			for(j = 8; j < leng; j++) {
				$(".class_r_li").eq(i).find(".class_r_body li").eq(j).css("display", "none");
			}
			$(".class_r_li").eq(i).find(".class_r_body li").eq(7).after(strhtml2);
			$(".class_r_li").eq(i).find(".class_r_body li").eq(leng).after(strhtml1);
			$(".class_up").css("display", "none");
		}
	}
}
/*第三类分类展开展开*/
function deploy_dowm(ob) {
	$(ob).parents(".class_r_body").find("li").css("display", "inline");
	$(ob).css("display", "none");
}
function search(ob){
	window.location.href='choice.html?cla='+$(ob).attr("sea")
	sessionStorage.mainSearch = $(ob).find("span").text();
}
