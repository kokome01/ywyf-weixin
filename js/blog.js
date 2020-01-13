function getQueryString(name) { 
		        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
		        var r = window.location.search.substr(1).match(reg); 
		        if (r != null) return unescape(r[2]); 
		        return null; 
		    } 
			$(document).ready(function() {
				console.log(getQueryString("id")) 
				var strhtml = "",
					xid = ""
				$.ajax({
					url: web_url+'/ywyf-weixin/text/list.do', //地址
					dataType: "json",
					type: "post",
					timeout: 50000,
					xhrFields: {
						withCredentials: true
					}, //跨域产生问题（跨域请求设置withCredentials）登录，退出登录
					success: function(data) {
						console.log(JSON.stringify(data))  //打印data
						//window.location.reload()  	    //刷新当前页面
						for(i=0;i<data.pagination.list.length;i++){
							//图片
							if(data.pagination.list[i].pic==null){
								blog = "../img/mo1.jpg"
							}
							else{
								blog = data.pagination.list[i].pic
							}
							//当前的新闻
							if(getQueryString("id")==data.pagination.list[i].id){
								xid = i
							}
							//热门话题
							 strhtml+= '<li onclick="window.location.href=' + "'blog.html?id=" +data.pagination.list[i].id+"'"+ '"><div class="foot_li"><div><p class="blog_f_subject">'
									+data.pagination.list[i].title+
									'</p><p><span class="blog_f_name">官方</span><span class="blog_f_time">'
									+formatDateTime(data.pagination.list[i].addtime*1000)+
									'</span></p></div><img src="'
									+blog+
									'" /></div></li>'
						}
						$(".foot ul").empty().append(strhtml)
						$(".body>.h1").text(data.pagination.list[xid].title)
						$(".blog_time>span").text(formatDateTime(data.pagination.list[xid].addtime*1000))
						if(data.pagination.list[xid].content==null){
							$(".blog_text").text(data.pagination.list[xid].title)
						}else{
							$(".blog_text").text(data.pagination.list[xid].content)
						}
					},
					error: function(XMLHttpRequest, textStatus, errorThrown) {
						getcode()
					},
				})
			})
			function formatDateTime(inputTime) { var date = new Date(inputTime); var y = date.getFullYear(); var m = date.getMonth() + 1; m = m < 10 ? ('0' + m) : m; var d = date.getDate(); d = d < 10 ? ('0' + d) : d; var h = date.getHours(); h = h < 10 ? ('0' + h) : h; var minute = date.getMinutes(); var second = date.getSeconds(); minute = minute < 10 ? ('0' + minute) : minute; second = second < 10 ? ('0' + second) : second; return y + '-' + m + '-' + d+' '+h+':'+minute+':'+second; }
			