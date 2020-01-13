$(document).ready(function() {
	//加载地址列表
	var str = ""
	var uname = 0
	$.ajax({
		url: web_url+'/ywyf-weixin/user/mailList', //地址
		dataType: "json",
		type: "post",
		timeout: 50000,
		xhrFields: {
			withCredentials: true
		},
		beforeSend:function(XMLHttpRequest){
			loding1("A1")
		},
		success: function(data) {
			if(data.status == 1) {
				console.log(JSON.stringify(data))
				$(".body1 ul").empty()
				for(i = 0; i < data.mailLists.length; i++) {
					if(data.mailLists[i].isDefault) {
						uname = 1
					} else {
						uname = 0
					}
					str += '<li id="' +
						data.mailLists[i].id +
						'"><div class="address_list" uname="' +
						uname +
						'" edit="0"><img src="../img/address.png" /><div class="address_list_b"><p><span class="address_name">' +
						data.mailLists[i].name +
						'</span><span class="address_phone">' +
						data.mailLists[i].tel +
						'</span></p><span class="address_di">' +
						data.mailLists[i].address +
						'</span></p></div><div class="address_list_f"><span class="address_gou"></span><span onclick="mo_set(this)">默认地址</span><img src="../img/del.png" /><span onclick="del(this)">删除</span><img src="../img/editor.png" /><span onclick="edit(this)">编辑</span></div></div></li>'
				}
				$(".body1 ul").append(str);
				//判断是否新增，新增表示吧默认设置为最后一个，并且跳转到pay.html页面
				if(getQueryString("new") == 1) {
					var len = $(".body1").find("li").length - 1;
					$.ajax({
						url: web_url + '/ywyf-weixin/user/setDefault', //地址
						dataType: "json",
						type: "post",
						timeout: 50000,
						xhrFields: {
							withCredentials: true
						},
						data: 'mailId=' + $(".body1").find("li").eq(len).attr("id"),
						success: function(data) {
							//console.log(JSON.stringify(data))
							window.location.href = "pay.html"
						},
						error: function(XMLHttpRequest, textStatus, errorThrown) {
							console.log("网络请求失败，请联系网站管理员!");
						},
					})
				}else{
					console.log("不是新增")
				}
				//设置默认
				mo()
			} else {
				
			}

		},
		complete:function(XMLHttpRequest,textStatus){
			loding2()
            // alert('远程调用成功，状态文本值：'+textStatus);
        },
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			console.log("网络请求失败，请联系网站管理员!");
		},
	})
	//加载默认地址
	
})
window.onload = function() {
	//默认地址
	mo()
}
/*默认地址*/
function mo() {

	for(i = 0; i < $(".address_list").length; i++) {
		if($(".address_list").eq(i).attr("uname") == "1") {
			$(".address_list").eq(i).find(".address_gou").css("background-image", "url(../img/gou2.png)")
			$(".address_list").eq(i).find(".address_list_f").find("span").eq(1).css("color", "#cc0000");
		} else {
			$(".address_list").eq(i).find(".address_gou").css("background-image", "url(../img/gou1.png)")
			$(".address_list").eq(i).find(".address_list_f").find("span").eq(1).css("color", "#666");
		}
	}
}
//点击删除订单
function del(ob) {
	$(".black").css("display", "block");
	$(ob).parents("li").addClass("order_li_del");
	$(".cue_text").text("你确认要删除订单");
}
//确认删除
function cue_but() {
	var but = 0
	if($(".order_li_del").find(".address_list").attr("uname") == 1) {
		but = 1;
	}
	//ajax
	$.ajax({
		url: web_url+'/ywyf-weixin/user/delMailAddr', //地址
		dataType: "json",
		type: "post",
		timeout: 50000,
		xhrFields: {
			withCredentials: true
		},
		data: 'mid=' + $(".order_li_del").attr("id") + '&returnUrl=',
		success: function(data) {
			window.location.reload()
			//console.log(JSON.stringify(data))
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			console.log("网络请求失败，请联系网站管理员!");
		},
	})
	//刷新页面
	$(".order_li_del").remove()
	//
	$(".black").css("display", "none");
	if(but == 1) {
		$(".address_list").eq(0).find(".address_gou").css("background-image", "url(../img/gou2.png)")
		$(".address_list").eq(0).find(".address_list_f").find("span").eq(1).css("color", "#cc0000");
	}
}
//取消删除
function cue_del() {
	$(".black").css("display", "none");
	$(".order_li_del").removeClass("order_li_del");
}
/*编辑*/
function edit(ob) {
	//添加数据
	$(".address_list").attr("edit", "0"); //清空
	$(ob).parents(".address_list").attr("edit", "1"); //判断地址进行编辑
	$(".body1").hide();
	$(".body2").show().attr("new", "1"); //判断是否是新增还是编辑 0为清空  1为编辑 2为新增
	$(".back").attr({
		"href": "#",
		"onclick": "back()"
	})
	//修改确认按钮
	$(".register_on").attr("onclick","edit_on()")
	//取值
	var name = $(ob).parents(".address_list").find(".address_name").text();
	var photo = $(ob).parents(".address_list").find(".address_phone").text();
	var di = $(ob).parents(".address_list").find(".address_di").text();

	//赋值
	$("#collect_name").val(name);
	$("#collect_photo").val(photo);
	$("#collect_address").val(di);
	$(".foot_but ").html("<span>确认编辑</span>").attr("onclick", "edit_on()")

}
/*确认编辑*/
function edit_on() {
	//取值
	var name = $("#collect_name").val();
	var photo = $("#collect_photo").val();
	var di = $("#collect_address").val();
	var id = 0
	for(i = 0; i < $(".address_list").length; i++) {
		if($(".address_list").eq(i).attr("edit") == 1) {
			id = $(".address_list").eq(i).parents("li").attr("id")
		}
	}
	//赋值
	$.ajax({
		url: web_url+'/ywyf-weixin/user/mailSOU', //地址
		dataType: "json",
		type: "post",
		timeout: 50000,
		xhrFields: {
			withCredentials: true
		},
		data: 'name=' + $("#collect_name").val() + '&tel=' + $("#collect_photo").val() + '&address=' + $("#collect_address").val() + '&mailId=' + id,
		success: function(data) {
			window.location.reload();
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			console.log("网络请求失败，请联系网站管理员!");
		},
	})
	//清空数据
	$(".address_list").attr("edit", "0");
	$(".body1").show();
	$(".body2").hide().attr("new", "0"); //判断是否是新增还是编辑  0为清空 1为编辑 2为新增
	$(".foot_but ").html("<span>新增地址</span>").attr("onclick", "add()")
	//清空
	$("#collect_name").val("")
	$("#collect_photo").val("")
	$("#collect_address").val("")
}
/*新增地址*/
function add() {
	if($(".body1 ul").find("li").length < 6) {
		$(".body1").hide();
		$(".body2").show().attr("new", "2");
		$(".foot_but ").html("<span>确认新增</span>").attr("onclick", "add_on()");
		$(".back").attr({
			"href": "#",
			"onclick": "back()"
		});
		//清空新增
		$("#collect_name").val("");
		$("#collect_photo").val("");
		$("#collect_address").val("");
		//修改确认按钮
		$(".register_on").attr("onclick","add_on()")
	} else {
		$(".cue_box").show()
		$(".cue_box span").text("地址最多为6个");
		$(".cue_box").fadeOut()
	}
}
/*确认新增*/
function add_on() {
	//取值
	var name = $("#collect_name").val();
	var photo = $("#collect_photo").val();
	var di = $("#collect_address").val();
	var strhtml = ""
	//判断是否为空
	if(name == "") {
		$(".cue_box").show()
		$(".cue_box span").text("收货者名字为空");
		$(".cue_box").fadeOut()
	} else if(photo == "") {
		$(".cue_box").show()
		$(".cue_box span").text("手机号码为空");
		$(".cue_box").fadeOut()
	} else if(di == "") {
		$(".cue_box").show()
		$(".cue_box span").text("所在地址为空");
		$(".cue_box").fadeOut()
	} else {
		$(".body1").show();
		$(".body2").hide().attr("new", "0"); //判断是否是新增还是编辑  0为清空 1为编辑 2为新增
		//新增
		var strhtml = ""
		$.ajax({
			url: web_url+'/ywyf-weixin/user/mailSOU', //地址
			dataType: "json",
			type: "post",
			timeout: 50000,
			xhrFields: {
				withCredentials: true
			},
			data: 'name=' + $("#collect_name").val() + '&tel=' + $("#collect_photo").val() + '&address=' + $("#collect_address").val() + '&mailId=0',
			success: function(data) {
				//console.log(JSON.stringify(data))
				window.location.reload()
				//清空
				$("#collect_name").val("");
				$("#collect_photo").val("");
				$("#collect_address").val("")
				//
				$(".foot_but ").html("<span>新增地址</span>").attr("onclick", "add()");
				//修改确认按钮
				$(".register_on").attr("onclick","address_butt()")
				//设置为默认
				window.location.href = "adddress.html?new=1"
				
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				console.log("网络请求失败，请联系网站管理员!");
			},
		})

	}
}
/*设置默认地址*/
function mo_set(ob) {
	$(".address_list").attr("uname", "0"); //0为非默认 1为设置为默认
	$(ob).parents(".address_list").attr("uname", "1");
	//ajax
	//console.log('mailId=' +$(ob).parents("li").attr("id"))
	$.ajax({
		url: web_url+'/ywyf-weixin/user/setDefault', //地址
		dataType: "json",
		type: "post",
		timeout: 50000,
		xhrFields: {
			withCredentials: true
		},
		data: 'mailId=' + $(ob).parents("li").attr("id"),
		success: function(data) {
			//console.log(JSON.stringify(data))
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			console.log("网络请求失败，请联系网站管理员!");
		},
	})
	//
	mo()
}
/*返回地址管理*/
function back() {
	$(".body1").show();
	$(".body2").hide().attr("new", "0"); //判断是否是新增还是编辑  0为清空 1为编辑 2为新增
	$(".address_list").attr("edit", "0");
	$(".foot_but ").html("<span>新增地址</span>").attr("onclick", "add()")
	setTimeout('$(".back").attr({"href":"javascript:history.back(-1)","onclick":""})', 200);
	setTimeout('$(".register_on").attr({"href":"#","onclick":"address_butt()"})', 200);
}
//确认
function address_butt(){
	var addressId = "";
	var addressName = "";
	var addressAddress = "";
	var addressTel = "";
	if(getQueryString("html")==1){
		var set_address = {};
		for(i=0;i<$(".address_list").length;i++){
			if($(".address_list").eq(i).attr("uname")==1){
				addressId = $(".address_list").eq(i).parents("li").attr("id");
				addressName = $(".address_list").eq(i).parents("li").find(".address_name").text();
				addressAddress = $(".address_list").eq(i).parents("li").find(".address_di").text();
				addressTel = $(".address_list").eq(i).parents("li").find(".address_phone").text();
			}
		}
		set_address.addressId = addressId;
		set_address.addressName = addressName;
		set_address.addressAddress = addressAddress;
		set_address.addressTel = addressTel;
		
		sessionStorage.set_address = JSON.stringify(set_address)
		//console.log(sessionStorage.set_address)
		window.location.href='../store/store_settling.html?spmktId='+getQueryString("spmktId")
	}else{
		history.back(-1)
	}
}
