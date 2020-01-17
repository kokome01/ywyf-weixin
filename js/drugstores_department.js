$(document).ready(function() {
	console.log(sessionStorage.dep_inf.hosName)
	$.ajax({
		url: 'http://www.51ywyf.com/ywyf-weixin/department/info?id=' + getQueryString("dep"), //地址web_url + 
		dataType: "json",
		type: "post",
		timeout: 50000,
		xhrFields: {
			withCredentials: true
		}, //跨域产生问题（跨域请求设置withCredentials）登录，退出登录
		success: function(data) {
			console.log(JSON.stringify(data)) //打印data
			//科室详情
			$("#dep_name").text(data.department.department);
			if(data.department.hospital!=null){
				$("#dep_hos").text(data.department.hospital);
			}else{
				$("#dep_hos").text("暂未填写");
			}
			
			if(data.department.tel != null) {
				$("#dep_tel").text(data.department.tel);
			} else {
				$("#dep_tel").text("暂未填写");
			}
			//科室医生
			var dochtml = "";
			var dep_inf = JSON.parse(sessionStorage.dep_inf);
			for(i=0;i<dep_inf.doc.doctors.length;i++){
				dochtml += '<li class="doc_li"><div><img class="doc_img" src="'
				+dep_inf.doc.doctors[i].pic+
				'"/><p class="doc_name"><span class="doc_name">'
				+dep_inf.doc.doctors[i].name+
				'</span>医生</p></div></li>'
			}
			$("#doc_ul").empty().append(dochtml)
			if($(".doc_li").length >= 1) {
				$("#doc_zero").hide();
			}
			//科室介绍
			if(data.department.description == null) {
				$("#introduce_text").text('暂无科室介绍');
			} else {
				$("#introduce_text").text(data.department.description);
			}

		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			getcode()
		},
	})
	$.ajax({
			url: 'http://www.51ywyf.com/ywyf-weixin/departmentActivity/list?pageNo=1&hospitalId='+getQueryString("hos")+'&departmentId='+getQueryString("dep"), //地址web_url + 
			dataType: "json",
			type: "post",
			timeout: 50000,
			xhrFields: {
				withCredentials: true
			}, //跨域产生问题（跨域请求设置withCredentials）登录，退出登录
			success: function(data) {
				console.log(JSON.stringify(data)) //打印data
				var data = data.data
				if(data.list.length>0){
					$("#item_relax").attr("onclick","item("+data.list[0].id+")")
					$("#item_img").attr("src",data.list[0].cover)
					$("#item_name").text(data.list[0].title)
					
					var acthtml = '';
					var itemNum = 0;
					var title = ""
					for(i = 1; i < data.list.length; i++) {
						//项目介绍
						if(data.list[i].description!=null){
							if(data.list[i].description.length > 20) {
								title = data.list[i].description.substring(0, 20) + '...';
							}
						}else{
							title = "暂无介绍"
						}
						//医生
						acthtml += '<li class="item_other" onclick="item(' 
						+data.list[i].id +
						')"><p class="item_other_p">'
						+data.list[i].title+
						'</p><img class="item_other_img" onerror="javascript:this.src=' + "'../img/ad1.jpg'" + '" src="'
						+data.list[i].cover+
						'"/></li>'
						
						itemNum++;
						if(itemNum > 3) {
							break;
						}
					}
					$("#item_ul").empty().append(acthtml);
					
				}
				if(data.list.length<1){
					$("#item_index").hide();
					$("#item_zero").show();
				}else{
					$("#item_index").show();
					$("#item_zero").hide();
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				getcode()
			},
		})
})
window.onload = function() {
	//项目
	var len2 = '';
	var text2 = '';
	for(i = 0; i < $(".item_li").length; i++) {
		if($(".item_li").eq(i).find(".item_content").text().length > 40) {
			text2 = $(".item_li").eq(i).find(".item_content").text().substring(0, 40) + '...';
			$(".item_content").eq(i).text(text2)
		}
	}
}

function back() {
	window.location.href = 'drugstores_home.html?id=' + getQueryString("hos");
}
//跳转到项目详情
function item(id) {
	window.location.href = 'drugstores_activity.html?act=' + id + '&hos=' + getQueryString("id");
}
//显示科室详情
function introduceShow(){
	if($("#introduce_text").hasClass("introduce_text_hide")){
		$("#introduce_text").removeClass("introduce_text_hide")
		$("#introduce_text_hide").text("点击收起")
	}else{
		$("#introduce_text").addClass("introduce_text_hide")
		$("#introduce_text_hide").text("查看详情")
	}
}
