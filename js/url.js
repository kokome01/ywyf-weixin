var web_url = 'http://www.51ywyf.com'
//url
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]);
    return null;
}
//微信跳转到getcode
function getcode(){
	//console.log(XMLHttpRequest.status);
	//console.log(XMLHttpRequest.readyState);
	//console.log(textStatus);
	console.log("网络请求失败，请联系网站管理员!");
	//window.location.href=web_url+"/ywyf-weixin/getCode";
}
var times = null;
//loding开始
function loding1(img){
	var strhtml = '<div class="loading"><img src="../img/'+img+'.jpg" style="width: 100%;position: fixed;top: 0px;z-index: 200;"/></div>';
	$("body").prepend(strhtml);
	//
	/*var ra = 0;
	var strhtml = '<div class="loading" style="padding:20px;padding-top: 100px;top:0px;background-color: #fff;position:fixed;width: 100%;height: 100%;z-index: 5000;text-align: center;"><img src="../img/LOGING.png" class="loading_img" style="width:60px;animation: spin 800ms infinite linear;-webkit-animation: spin 800ms infinite linear;"/></div>'
	$("body").prepend(strhtml)
	$(".loading").css("display","block");
	
	times = setInterval(function() {
		ra = ra + 30
		$(".loading_img").css("-webkit-transform", "rotate(" + ra + "deg)")
	}, 100);*/
}
//loding结束
function loding2(){
	$(".loading").empty()
	//
	/*clearInterval(times);
	$(".loading").css("display","none");*/
}
//修改网页meta关键字
function metaDo(title,keywords,description){
	document.title = title;
	var obj1=document.getElementsByTagName("meta")[1];
	var obj2=document.getElementsByTagName("meta")[2];
	obj1.content= keywords;
	obj2.content= description;
}
