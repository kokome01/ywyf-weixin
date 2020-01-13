$(document).ready(function() {
	console.log(getQueryString("act"))
	if(getQueryString("act")==null||getQueryString("hos")==null){
		window.location.href = 'drugstores_activity_list.html?act='+getQueryString("act")+'&hos='+getQueryString("hos");
	}else{
		$.ajax({
			url: 'http://www.mryisheng.com/ywyf-weixin/departmentActivity/info?id='+getQueryString("act"), //地址web_url + 
			dataType: "json",
			type: "post",
			timeout: 50000,
			xhrFields: {
				withCredentials: true
			}, //跨域产生问题（跨域请求设置withCredentials）登录，退出登录
			success: function(data) {
				console.log(JSON.stringify(data)) //打印data
				var data = data.data
				$("#act_title").text(data.title);
				$("#act_content").html(data.description);
				//替换图片路径
				var leng = $("#act_content").find("img").length
				for(i = 0; i < leng; i++) {
					var src = $("#act_content").find("img").eq(i).attr("src").replace('/photo/upload/', "http://www.51ywyf.com/photo/upload/")
					$("#act_content").find("img").eq(i).attr("src",src)
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				getcode()
			},
		})
	}
	
})
window.onload = function() {
	
}