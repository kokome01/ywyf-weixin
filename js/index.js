$(document).ready(function() {
	//修改网页meta关键字
	/*var title = '院外药'
	var meatkey = '人胎盘片,院外药,处方外配,处方,网上药房';
	var meatdes = '院外药为你提供人胎盘片，处方外配服务';
	metaDo(title,meatkey,meatdes)*/
	//ajax
	$(".ad").css("width", document.body.clientWidth)
	$(".ad_b").css("height",document.body.clientWidth/2.09)
	$.ajax({
		url: web_url + '/ywyf-weixin/getIndex', //地址
		dataType: "json",
		type: "post",
		timeout: 50000,
		xhrFields: {
			withCredentials: true
		}, //跨域产生问题（跨域请求设置withCredentials）登录，退出登录
		success: function(data) {
			console.log(data.type1.length)
			console.log(JSON.stringify(data));
			var strimg1 = "" //轮播图
			var strimg2 = "" //推荐列表
			var strtype1 = "" //中西药品
			var strtype2 = ""
			var strtype3 = ""
			var strtype4 = ""
			var strtype5 = ""
			var strtype6 = ""
			var strnew = ""
			var html_q1 = ""
			var ad_type	= ""
			//轮播图
			if(data.banners1!=null){
				for(i = 0; i < data.banners1.length; i++) {
					if(data.banners1[i].type==0){	//通知
						ad_type = "person/blog.html?id="+data.banners1[i].linkId
					}else if(data.banners1[i].type==1){		//产品
						ad_type = "other/introduction.html?id="+data.banners1[i].linkId
					}else if(data.banners1[i].type==2){		//医院
						ad_type = "other/drugstores_home.html?id="+ data.banners1[i].linkId
					}else if(data.banners1[i].type==3){		//活动
						ad_type = "activity/activity"+data.banners1[i].linkId+".html"
					}
					var url1 = data.banners1[i].url
					var url2 = url1.substr(39,5)
					strimg1 += '<li onclick="window.location.href='+"'"+ad_type+"'"+'"><img src="' +
						data.banners1[i].pic +
						'" class="ad" /></li>'
				}
				$(".ad_ul").empty().append(strimg1);
			}
			
			//幻灯片图片自适应
			$(".ad").css("width", document.body.clientWidth)
			$(".ad_b").css("height",document.body.clientWidth/2.09)
			//轮播图今日推荐
			if(data.commend!=null){
				for(i = 0; i < data.commend.length; i++) {
					strimg2 += '<li onclick="window.location.href='+"'other/introduction.html?id="
						+data.commend[i].id+
						"'"+'"><div class="activity_b_list"><img src="' +
						data.commend[i].pic +
						'"/><p>' +
						data.commend[i].name +
						'</p></div></li>'
				}
				$(".activity_b_ul").empty().append(strimg2)
			}
			//今日头条
			if(data.articles!=null){
				for(i = 0; i < data.articles.length; i++) {
					strnew += '<div class="hot_new_b new_b' +
						i +
						'" onclick="window.location.href=' + "'person/blog.html?id=" +data.articles[i].id+"'"+ '"><span>' +
						data.articles[i].title +
						'</span></div>'
				}
				$(".hot_new_box1").empty().append(strnew)
			}
			//商品列表
			//中医西药
			if(data.type1!=null){
				for(i = 0; i < data.type1.length; i++) {
					if(data.type1.length==1){
						html_q1 = '<div class="ware_list"><img src="img/2017.jpg"/><p><b></b></p><span><span></span></span><p ><span style="color: #FF0000;">￥<b >0.00</b></span><span class="ware_list_w"><label></label></span></p></div>'
					}else{
						html_q1 = ""
					}
					strtype1 += '<div class="ware_list" onclick="window.location.href='+"'other/introduction.html?id="
					+data.type1[i].id+
					"'"+'"><img src="'
					+data.type1[i].pic +
						'"/><p><b>' +
						data.type1[i].name +
						'</b></p><span><span></span></span><p ><span style="color: #FF0000;">￥<b >' +
						data.type1[i].price +
						'</b></span></p></div>'+html_q1
				}
				$(".ware_body1").empty().append(strtype1);
			}
			
			//养身 保健
			if(data.type2!=null){
				for(i = 0; i < data.type2.length; i++) {
					if(data.type2.length==1){
						html_q1 = '<div class="ware_list"><img src="img/2017.jpg"/><p><b></b></p><span><span></span></span><p ><span style="color: #FF0000;">￥<b >0.00</b></span><span class="ware_list_w"><label></label></span></p></div>'
					}else{
						html_q1 = ""
					}
					strtype2 += '<div class="ware_list" onclick="window.location.href='+"'other/introduction.html?id="
					+data.type2[i].id+
					"'"+'"><img src="'
					+data.type2[i].pic +
						'"/><p><b>' +
						data.type2[i].name +
						'</b></p><span><span></span></span><p ><span style="color: #FF0000;">￥<b >' +
						data.type2[i].price +
						'</b></span></p></div>'+html_q1
				}
				$(".ware_body2").empty().append(strtype2);
			}
			
			//医疗器械
			if(data.type3!=null){
				for(i = 0; i < data.type3.length; i++) {
					if(data.type3.length==1){
						html_q1 = '<div class="ware_list"><img src="img/2017.jpg"/><p><b></b></p><span><span></span></span><p ><span style="color: #FF0000;">￥<b >0.00</b></span><span class="ware_list_w"><label></label></span></p></div>'
					}else{
						html_q1 = ""
					}
					strtype3 += '<div class="ware_list" onclick="window.location.href='+"'other/introduction.html?id="
					+data.type3[i].id+
					"'"+'"><img src="'
					+data.type3[i].pic +
						'"/><p><b>' +
						data.type3[i].name +
						'</b></p><span><span></span></span><p ><span style="color: #FF0000;">￥<b >' +
						data.type3[i].price +
						'</b></span></p></div>'+html_q1
				}
				$(".ware_body3").empty().append(strtype3);
			}
			
			//计生用品
			if(data.type9!=null){
				for(i = 0; i < data.type9.length; i++) {
					if(data.type9.length==1){
						html_q1 = '<div class="ware_list"><img src="img/2017.jpg"/><p><b></b></p><span><span></span></span><p ><span style="color: #FF0000;">￥<b >0.00</b></span><span class="ware_list_w"><label></label></span></p></div>'
					}else{
						html_q1 = ""
					}
					strtype4 += '<div class="ware_list" onclick="window.location.href='+"'other/introduction.html?id="
					+data.type9[i].id+
					"'"+'"><img src="'
					+data.type9[i].pic +
						'"/><p><b>' +
						data.type9[i].name +
						'</b></p><span><span></span></span><p ><span style="color: #FF0000;">￥<b >' +
						data.type9[i].price +
						'</b></span></p></div>'+html_q1
				}
				$(".ware_body4").empty().append(strtype4)
			}
			
			//中药饮片
			if(data.type10!=null){
				for(i = 0; i < data.type10.length; i++) {
					if(data.type10.length==1){
						html_q1 = '<div class="ware_list"><img src="img/2017.jpg"/><p><b></b></p><span><span></span></span><p ><span style="color: #FF0000;">￥<b >0.00</b></span><span class="ware_list_w"><label></label></span></p></div>'
					}else{
						html_q1 = ""
					}
					strtype5 += '<div class="ware_list" onclick="window.location.href='+"'other/introduction.html?id="
					+data.type10[i].id+
					"'"+'"><img src="'
					+data.type10[i].pic +
						'"/><p><b>' +
						data.type10[i].name +
						'</b></p><span><span></span></span><p ><span style="color: #FF0000;">￥<b >' +
						data.type10[i].price +
						'</b></span></p></div>'+html_q1
				}
				$(".ware_body5").empty().append(strtype5)
			}
			
			//医学护肤
			if(data.type11!=null){
				if(data.type11.length==1){
					html_q1 = '<div class="ware_list"><img src="img/2017.jpg"/><p><b></b></p><span><span></span></span><p ><span style="color: #FF0000;">￥<b >0.00</b></span><span class="ware_list_w"><label></label></span></p></div>'
				}else{
					html_q1 = ""
				}
				for(i = 0; i < data.type11.length; i++) {
					strtype6 += '<div class="ware_list" onclick="window.location.href='+"'other/introduction.html?id="
					+data.type11[i].id+
					"'"+'"><img src="'
					+data.type11[i].pic +
						'"/><p><b>' +
						data.type11[i].name +
						'</b></p><span><span></span></span><p ><span style="color: #FF0000;">￥<b >' +
						data.type11[i].price +
						'</b></span></p></div>'+html_q1
				}
				$(".ware_body6").empty().append(strtype6)
			}
			

			//成功后执行滚动
			reco();
			news();
			slide();
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			getcode()
		},
	})
	
	$.ajax({
			url: 'http://www.51ywyf.com/ywyf-weixin/departmentActivity/list?pageNo=1&hospitalId=&departmentId=', //地址web_url + 
			dataType: "json",
			type: "post",
			timeout: 50000,
			xhrFields: {
				withCredentials: true
			}, //跨域产生问题（跨域请求设置withCredentials）登录，退出登录
			success: function(data) {
				console.log(JSON.stringify(data)) //打印data
				var data = data.data
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
					//
					acthtml += '<li class="item_other" onclick="item(' 
					+data.list[i].id +
					')"><p class="item_other_p">'
					+data.list[i].title+
					'</p><img class="item_other_img" onerror="javascript:this.src=' + "'img/ad1.jpg'" + '" src="'
					+data.list[i].cover+
					'"/></li>'
					itemNum++;
					if(itemNum > 3) {
						break;
					}
				}
				$("#item_ul").empty().append(acthtml)
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				getcode()
			},
		})
});


$(window).resize(function() { /*浏览器可视区域变化*/
	//幻灯片图片自适应
	$(".ad").css("width", document.body.clientWidth)
	$(".ad_b").css("height",document.body.clientWidth/2.09)
});

/*运动图片*/
function slide() {
	//轮播图
	var times1 = null;
	var num = $(".ad_ul").find("li").length
	var numq = (num + 2) * document.body.clientWidth
	$(".ad_ul").css("width", "" + numq + "+px")
	////加入尾图片
	strhtml = '<li onclick="'+$(".ad_ul").find("li").eq(0).attr("onclick")+'">' + $(".ad_ul").find("li").eq(0).html() + "</li>"
	$(".ad_ul").append(strhtml)

	var wi = document.body.clientWidth //图片的宽度
	var dir = (-1) * wi
	var times = null;
	$(".ad_ul").css("left", "" + (dir) * (num) + "px")
	var lef = (dir) * (num - 1)
	////图片点
	$(".ad_spot_b").empty()
	var spothtml = ""
	var sp = 0
	for(i = 0; i < num; i++) {
		spothtml += '<li><div class="ad_spot" ></div></li>'
	}
	$(".ad_spot_b").append(spothtml)
	$(".ad_spot_b").find(".ad_spot").removeClass("ad_spot1")
	$(".ad_spot_b li").eq(sp).find(".ad_spot").addClass("ad_spot1")

	times = setInterval(function() {
		if(lef < 10) {
			$(".ad_ul").animate({
				left: "" + (lef) + "px"
			});
			lef = lef - dir
			//判断点是否到最后一位
			sp = sp + 1
			if(sp == num) {
				sp = 0
			}
		} else {
			$(".ad_ul").css("left", "" + (dir) * (num) + "px")
			lef = (dir) * (num - 1)
			//点返回最后第一位
			sp = 0
		}
		//点付于class
		$(".ad_spot_b").find(".ad_spot").removeClass("ad_spot1")
		$(".ad_spot_b li").eq(sp).find(".ad_spot").addClass("ad_spot1")
	}, 2000);
}
/*新闻*/
function news() {
	var nw = 1
	times3 = null
	var len = $(".hot_new_b").length
	times3 = setInterval(function() {
		if(len == 1) {
			
		} else if(nw == len) {
			$(".hot_new_box1").find(".hot_new_b").animate({
				top: "-19px"
			});
			$(".hot_new_box1").find(".hot_new_b").eq(len - 1).animate({
				top: "0px"
			});
			nw = 1
		} else {
			$(".hot_new_box1").find(".hot_new_b").animate({
				top: "-19px"
			});
			$(".hot_new_box1").find(".hot_new_b").eq(nw - 1).animate({
				top: "0px"
			});
			nw = nw + 1
		}
	}, 3000)
}
//推荐的轮播
function reco() {
	//赋值
	var str = ""
	for(i = 0; i < 6; i++) {
		str += "<li>" + $(".activity_b_ul").find("li").eq(i).html() + "</li>"
	}
	$(".activity_b_ul").append(str)

	//轮播
	times4 = null
	var ran = -110
	var min = (8 + 1) * (-110) //8个
	times4 = setInterval(function() {
		if(ran <= min) {
			ran = 0
			$(".activity_b_ul").css("left", "0px");
			ran = ran - 110
			$(".activity_b_ul").animate({
				left: "" + ran + "px"
			});
			ran = ran - 110
		} else {
			$(".activity_b_ul").animate({
				left: "" + ran + "px"
			});
			ran = ran - 110
		}
	}, 1000)

}
//餐厅
function store_index(){
	window.location.href='store/store_index.html';
	sessionStorage.storeIndex = 1;
}
//跳转到科室项目
function item(id) {
	window.location.href = 'other/drugstores_activity.html?act=' + id + '&hos=' + getQueryString("id");
}
