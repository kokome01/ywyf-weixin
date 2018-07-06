$(document).ready(function() {
	var str = "",
		isRead ="",
		newi = 0
	
	//加载地址列表
	$.ajax({
		url: 'http://192.168.0.102/ywyf-weixin/user/msgList', //地址
		dataType: "json",
		type: "post",
		timeout: 50000,
		xhrFields: {
			withCredentials: true
		},
		success: function(data) {
			if(data.status == 1) {
				//console.log(JSON.stringify(data))
				$(".body ul").empty();
				for(i = 0; i < data.msgs.length; i++) {
					if(data.msgs[i].isRead==0){
						isRead = "未读";
						newi = 0;
					}
					else{
						isRead = "已读"
						newi = 1;
					}
					str += '<li class="new_li" new="'
							+data.msgs[i].isRead+
							'" untf="0"  id="'
							+data.msgs[i].id+
							'"><div class="new_list" onclick="read_top(this)"><p><span class="new_i">官方</span><b class="new_name">'
							+data.msgs[i].title+
							'</b><label class="new_time">'
							+formatDateTime(data.msgs[i].addtime)+
							'</label><span class="new_r">'
							+isRead+
							'</span></p><p class="new_val new_hide">'
							+data.msgs[i].msg+
							'</p></div><img src="../img/ca1.png" class="new_del" onclick="del(this)" /></li>'
				}
				$(".body ul").append(str);
				//判断是否已读
				isread()
			} else {
				alert("请登录");
				window.location.href = '../other/login.html'
			}

		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			/*alert(XMLHttpRequest.status);
			alert(XMLHttpRequest.readyState);
			alert(textStatus);*/
			console.log("网络请求失败，请联系网站管理员!");
		},
	})
	//加载默认地址

})
//时间戳
function formatDateTime(inputTime) { var date = new Date(inputTime); var y = date.getFullYear(); var m = date.getMonth() + 1; m = m < 10 ? ('0' + m) : m; var d = date.getDate(); d = d < 10 ? ('0' + d) : d; var h = date.getHours(); h = h < 10 ? ('0' + h) : h; var minute = date.getMinutes(); var second = date.getSeconds(); minute = minute < 10 ? ('0' + minute) : minute; second = second < 10 ? ('0' + second) : second; return y + '-' + m + '-' + d+' '+h+':'+minute+':'+second; }
//
function del(ob) {
	
	$(ob).parent(".new_li").addClass("del_shop_list");
	$(".black").show();
}
//进行展开
function read_top(ob) {
	if($(ob).attr("untf") == 0) {
		//ajax
		$.ajax({
			url: 'http://192.168.0.102/ywyf-weixin/user/modifyMsgStatus', //地址
			dataType: "json",
			type: "post",
			timeout: 50000,
			xhrFields: {
				withCredentials: true
			},
			data:'msgId='+$(ob).parents("li").attr("id"),
			success: function(data) {
				window.location.reload();
				//console.log(JSON.stringify(data));
				//判断是否已读
				isread()
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				/*alert(XMLHttpRequest.status);
				alert(XMLHttpRequest.readyState);
				alert(textStatus);*/
				console.log("网络请求失败，请联系网站管理员!");
			},
		})
		$(ob).attr("untf", "1");
		$(ob).find(".new_val").removeClass("new_hide");

	} else {
		$(ob).find(".new_val").addClass("new_hide");
		$(ob).attr("untf", "0");

	}
	
}
/*判断是否已读*/
function isread(){
	for(i = 0; i < $(".new_li").length; i++) {
		if($(".new_li").eq(i).attr("new") == 0) {
			$(".new_li").eq(i).find(".new_r").text("未读").removeClass("onread")

		} else {
			$(".new_li").eq(i).find(".new_r").text("已读").addClass("onread")
		}
	}
}
/*cue_but*/
function cue_but() {
	$(".black").hide();
	//ajax
	$.ajax({
		url: 'http://192.168.0.102/ywyf-weixin/user/delMsg', //地址
		dataType: "json",
		type: "post",
		timeout: 50000,
		xhrFields: {
			withCredentials: true
		},
		data:'msgId='+$(".del_shop_list").attr("id"),
		success: function(data) {
			window.location.reload()
			//console.log(JSON.stringify(data))
			//删除
			$(".del_shop_list").remove();
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			/*alert(XMLHttpRequest.status);
			alert(XMLHttpRequest.readyState);
			alert(textStatus);*/
			console.log("网络请求失败，请联系网站管理员!");
		},
	})
}
/*cue_del*/
function cue_del() {
	$(".shop_list_l").removeClass("del_shop_list");
	$(".shop_list").removeClass("del_shop_list");
	$(".black").hide();
}