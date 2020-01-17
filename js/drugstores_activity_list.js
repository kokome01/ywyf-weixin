$(document).ready(function() {
	var hos = getQueryString("hos")
	var dep = getQueryString("dep")
	console.log(hos+","+dep)
	if(dep==null){
		dep = ""
	}
	if(hos==null){
		hos = ""
	}
	$.ajax({
			url: 'http://www.51ywyf.com/ywyf-weixin/departmentActivity/list?pageNo=1&hospitalId='+hos+'&departmentId='+dep, //地址web_url + 
			dataType: "json",
			type: "post",
			timeout: 50000,
			xhrFields: {
				withCredentials: true
			}, //跨域产生问题（跨域请求设置withCredentials）登录，退出登录
			success: function(data) {
				console.log(JSON.stringify(data)) //打印data
				var data = data.data
				var strhtml = "";
				if(data.list.length == 0){
					$("#item_zero").show();
				}else{
					for(i=0;i<data.list.length;i++){
						strhtml += '<li class="item_li"><div class="item_relax"  onclick="item('
							+data.list[i].id+
							')"><img class="item_img"  src="'
							+data.list[i].cover+
							'" onerror="javascript:this.src='+"'../img/ad1.jpg'"+'"/><div class="item_abs"><p class="item_name" >'
							+data.list[i].title+
							'</p></div></div></li>'
					}
					$("#item_ul").empty().append(strhtml)
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
			console.log($(".item_li").eq(i).find(".item_content").text().length)
		}
	}
}
//跳转到项目详细
function item(id){
	window.location.href = 'drugstores_activity.html?act='+id+'&hos='+getQueryString("hos");
}
