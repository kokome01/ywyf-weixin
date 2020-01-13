$(document).ready(function() {
	var search = sessionStorage.mainSearch;
	//判断是否从分类页跳转过来的
	if(getQueryString("cla") != null) { //分类过来
		data = "pageNo=" + "1" + "&disId=" + getQueryString("cla");
		$(".choice_pop_lei").eq(3).attr("cid",getQueryString("cla"));
		//$(".choice_pop_lei").eq(3).attr("cid",cla);
	}else if(getQueryString("type") != null){
		data = "pageNo=" + "1" + "&typeId=" + getQueryString("type")  //+"&keyword=" + getQueryString("val")+"&phId="+getQueryString("phId");
		$(".choice_pop_lei").eq(1).attr("cid",getQueryString("type"));
	}else{	//搜索页过来
		data = "pageNo=" + "1" + "&keyword=" + search;
	}
	//console.log(data)
	//ajax
	$.ajax({
		url: web_url + '/ywyf-weixin/product/search', //地址
		dataType: "json",
		type: "post",
		xhrFields: {
			withCredentials: true
		},
		timeout: 50000,
		data: data,
		beforeSend: function(XMLHttpRequest) {
			loding1("A3")
		},
		success: function(data) {
			console.log(JSON.stringify(data))
			//搜索商品
			
			if(data.pagination.list.length == 0) {
				var typess = "";
				if(getQueryString("type")==1){
					typess = "中西医药"
				}else if(getQueryString("type")==2){
					typess = "养生保健"
				}else if(getQueryString("type")==3){
					typess = "医疗器械"
				}else if(getQueryString("type")==9){
					typess = "计生用品"
				}else if(getQueryString("type")==10){
					typess = "中药饮片"
				}else if(getQueryString("type")==11){
					typess = "医学护肤"
				}
				if(getQueryString("phId")!=null||getQueryString("phId")!=undefined){
					strhtml = '<li> <div class="non_cue"> <img src="../img/nono.png" /> <p>很抱歉，您寻找的商品本药房不存在，可能已下架或者被转移。</p> <p>建议你:</p> <p>1.看看输入的文字是否有误</p> <p>2.致电客服：0571-8257-6221</p> </div> </li>'
				}else if(getQueryString("type")!=null||getQueryString("type")!=undefined){
					strhtml = '<li> <div class="non_cue"> <img src="../img/nono.png" /> <p>很抱歉，您查看的"<span class="non_cue_name">' + typess + '</span>"类型产品为空，可能已下架或者被转移。</p> <p>建议你:</p> <p>1.看看输入的文字是否有误</p> <p>2.致电客服：0571-8257-6221</p> </div> </li>'
				}else{
					strhtml = '<li> <div class="non_cue"> <img src="../img/nono.png" /> <p>很抱歉，您查看的"<span class="non_cue_name">' + sessionStorage.mainSearch + '</span>"类型产品为空，可能已下架或者被转移。</p> <p>建议你:</p> <p>1.看看输入的文字是否有误</p> <p>2.致电客服：0571-8257-6221</p> </div> </li>'
				}
					
				$(".choice_body ul").empty().append(strhtml);
			} else {
				var strhtml = ""
				for(i = 0; i < data.pagination.list.length; i++) {
					if(data.pagination.list[i].isCommend=="false"){
						strhtml += '<li class="choice_li" onclick="window.location.href=' + "'introduction.html?id=" + data.pagination.list[i].id + "'" + '"><img src="' +
							data.pagination.list[i].pic +
							'"/><div class="choice_p"><p>' +
							data.pagination.list[i].name +
							'</p><p></p><p><span>￥</span><span >' +
							data.pagination.list[i].price +
							'</span></p></div></li>'
					}else if(data.pagination.list[i].isCommend=="true"){
						strhtml += '<li class="choice_li" onclick="window.location.href=' + "'introduction.html?id=" + data.pagination.list[i].id + "'" + '"><img src="' +
							data.pagination.list[i].pic +
							'"/><div class="choice_p"><p>' +
							data.pagination.list[i].name +
							'</p><p></p><p><span>￥</span><span >' +
							data.pagination.list[i].price +
							'</span></p></div></li>'
					}else{
						console.log(data.pagination.list[i].isCommend)
					}
					
				}
				$(".choice_body ul").empty().append(strhtml);
			}
			//加载筛选内容
			var choice1 = ""
			for(i = 0; i < data.brands.length; i++) {
				choice1 += '<li class="choice_pop_li choice_pop_gou choice_pop_li1" onclick="pop_gou(this)" gou="0" cid="' + data.brands[i].id + '"><span>' +
					data.brands[i].brandName +
					'</span><img src=""/></li>'
			}
			for(i = 0; i < data.proTypes.length; i++) {
				choice1 += '<li class="choice_pop_li choice_pop_gou choice_pop_li2" onclick="pop_gou(this)" gou="0" cid="' + data.proTypes[i].id + '"><span>' +
					data.proTypes[i].typeName +
					'</span><img src=""/></li>'
			}
			for(i = 0; i < data.funTypes.length; i++) {
				choice1 += '<li class="choice_pop_li choice_pop_gou choice_pop_li3" onclick="pop_gou(this)" gou="0" cid="' + data.funTypes[i].id + '"><span>' +
					data.funTypes[i].name +
					'</span><img src=""/></li>'
			}
			for(i = 0; i < data.diseases.length; i++) {
				choice1 += '<li class="choice_pop_li choice_pop_gou choice_pop_li4" onclick="pop_gou(this)" gou="0" cid="' + data.diseases[i].id + '"><span>' +
					data.diseases[i].name +
					'</span><img src=""/></li>'
			}
			$(".choice_pop2 ul").empty().append(choice1);
			pop_first()
		},
		complete: function(XMLHttpRequest, textStatus) {
			loding2()
			// alert('远程调用成功，状态文本值：'+textStatus);
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			//alert(XMLHttpRequest.status);
			//alert(XMLHttpRequest.readyState);
			//alert(textStatus);
			console.log("网络请求失败，请联系网站管理员!");
			getcode()
		},
	})
	//下拉
	scroll(search, "", "", "", "", "",getQueryString("phId"))
	//筛选高度固定
	$(".choice_pop2 ul").height($(document).height())
})
//下拉加载
function scroll(sea, brand, type, dis, fun, price,ph) {
	var page = 1;
	$(".head_l").attr("page",page)
	var cla_i = "";
	var type_i = "";
	var sea_i = "";
	$(window).scroll(function() {
		if($(window).scrollTop() + $(window).height() + 5 > $(document).height()) {
			//页数
			$(".head_l").attr("page",parseInt($(".head_l").attr("page")) +1)
			//判断是否从分类页跳转过来的
			if($(".choice_pop_lei").eq(3).attr("cid") != null&&$(".choice_pop_lei").eq(3).attr("cid") != "") { //分类过来
				cla_i =  $(".choice_pop_lei").eq(3).attr("cid")
			}else if($(".choice_pop_lei").eq(1).attr("cid") != null&&$(".choice_pop_lei").eq(1).attr("cid") != ""){
				type_i = $(".choice_pop_lei").eq(1).attr("cid")
			}else{	//搜索页过来
				sea_i = sessionStorage.mainSearch;
			}
			choice_ajax(0,parseInt($(".head_l").attr("page")), sessionStorage.mainSearch, $(".choice_pop_lei").eq(0).attr("cid"), $(".choice_pop_lei").eq(1).attr("cid"), $(".choice_pop_lei").eq(3).attr("cid"), $(".choice_pop_lei").eq(2).attr("cid"), price,ph)
		}
	});
}
//ajax
function choice_ajax(no,page, sea, brand, type, dis, fun, price,ph) {//是1否0为第一次加载，页数，搜索内容，品牌，产品类型，适应范围，对应症，价格优先，药房id
	var ph_val = ""
	if(ph==null){
		ph_val = ""
	}else{
		ph_val = ph
	}
	console.log("pageNo=" + page + "&keyword=" + sea + "&brandId=" + brand + "&typeId=" + type + "&disId=" + dis + "&funId=" + fun + "&priceType=" + price +"&phId="+ph_val)
	//ajax
	$.ajax({
		url: web_url + '/ywyf-weixin/product/search', //地址
		dataType: "json",
		type: "post",
		xhrFields: {
			withCredentials: true
		},
		timeout: 50000,
		data: "pageNo=" + page + "&keyword=" + sea + "&brandId=" + brand + "&typeId=" + type + "&disId=" + dis + "&funId=" + fun + "&priceType=" + price +"&phId="+ph_val,
		success: function(data) {
			//console.log(JSON.stringify(data))
			//搜索商品
			if(data.pagination.list.length == 0) {
				if(page==1){
					
					if(ph_val!=null||ph_val!=undefined){
						strhtml = '<li> <div class="non_cue"> <img src="../img/nono.png" /> <p>很抱歉，您寻找的商品本药房不存在，可能已下架或者被转移。</p> <p>建议你:</p> <p>1.看看输入的文字是否有误</p> <p>2.致电客服：0571-8257-6221</p> </div> </li>'
					}else{
						strhtml = '<li> <div class="non_cue"> <img src="../img/nono.png" /> <p>很抱歉，您搜索的“<span class="non_cue_name">' + sessionStorage.mainSearch + '</span>“商品不存在，可能已下架或者被转移。</p> <p>建议你:</p> <p>1.看看输入的文字是否有误</p> <p>2.致电客服：0571-8257-6221</p> </div> </li>'
					}
					
					$(".choice_body ul").empty().append(strhtml);
				}
			} else {
				var strhtml = ""
				for(i = 0; i < data.pagination.list.length; i++) {
					strhtml += '<li class="choice_li" onclick="window.location.href=' + "'introduction.html?id=" + data.pagination.list[i].id + "'" + '"><img src="' +
						data.pagination.list[i].pic +
						'"/><div class="choice_p"><p>' +
						data.pagination.list[i].name +
						'</p><p></p><p><span>￥</span><span >' +
						data.pagination.list[i].price +
						'</span></p></div></li>'
				}
				if(no==1){
					$(".choice_body ul").empty().append(strhtml);
				}else{
					$(".choice_body ul").append(strhtml);
				}
				
			}

		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			getcode()
		},
	})
}
/*点击综合排序*/
function choice_head(ob) {
	$(".choice_head").find("div").removeClass("choice_xu");
	$(".sharp_down").css("display", "block").attr("src", "../img/down2.png");
	$(".sharp_up").css("display", "block").attr("src", "../img/up2.png");
	$(ob).addClass("choice_xu");
	choice_ajax(1,1, "", $(".choice_pop_lei").eq(0).attr("cid"), $(".choice_pop_lei").eq(1).attr("cid"), $(".choice_pop_lei").eq(3).attr("cid"), $(".choice_pop_lei").eq(2).attr("cid"), "",getQueryString("phId"))
}
/*点击价格优先*/
function price() {
	$(".choice_head").find("div").removeClass("choice_xu");
	$(".choice_sharp").addClass("choice_xu");
	if($(".choice_sharp").attr("uname") == 1) {
		$(".sharp_down").css("display", "block").attr("src", "../img/down3.png");
		$(".sharp_up").css("display", "none");
		//
		$(".choice_sharp").attr("uname", "2");
		$(".choice_body ul").empty()
		choice_ajax(1,1, "", $(".choice_pop_lei").eq(0).attr("cid"), $(".choice_pop_lei").eq(1).attr("cid"), $(".choice_pop_lei").eq(3).attr("cid"), $(".choice_pop_lei").eq(2).attr("cid"), 1,getQueryString("phId"))
	} else if($(".choice_sharp").attr("uname") == 2) {
		$(".sharp_up").css("display", "block").attr("src", "../img/up3.png");
		$(".sharp_down").css("display", "none");
		$(".choice_sharp").attr("uname", "1");
		//
		$(".choice_body ul").empty()
		choice_ajax(1,1,"", $(".choice_pop_lei").eq(0).attr("cid"), $(".choice_pop_lei").eq(1).attr("cid"), $(".choice_pop_lei").eq(3).attr("cid"),$(".choice_pop_lei").eq(2).attr("cid") , 2,getQueryString("phId"))
	}

}
/*点击筛选*/
function screen() {
	$(".choice_black").css("display", "block");
	$(".choice_pop1").animate({
		right: "0px"
	});
}
/*取消一级pop*/
function pop_del1() {
	$(".choice_black").css("display", "none");
	$(".choice_pop1").animate({
		right: "-300px"
	});
}
/*取消二级pop*/
function pop_del2() {
	$(".choice_pop1").animate({
		right: "0px"
	});
	$(".choice_pop2").animate({
		right: "-300px"
	});
}
/*第一级分类筛选*/
function pop_filter(ob, num) {
	$(".choice_pop_lei").attr("uname", "0")
	$(ob).attr("uname", "1")
	$(".choice_pop1").animate({
		right: "-300px"
	});
	$(".choice_pop2").animate({
		right: "0px"
	});
	if(num == 1) {
		$("#choice_pop_h_name").text("品牌");
		$(".choice_pop_gou").css("display", "none");
		$(".choice_pop_li1").css("display", "block");
	} else if(num == 2) {
		$("#choice_pop_h_name").text("产品类型")
		$(".choice_pop_gou").css("display", "none");
		$(".choice_pop_li2").css("display", "block");
	} else if(num == 3) {
		$("#choice_pop_h_name").text("适应范围")
		$(".choice_pop_gou").css("display", "none");
		$(".choice_pop_li3").css("display", "block");
	} else if(num == 4) {
		$("#choice_pop_h_name").text("对应征")
		$(".choice_pop_gou").css("display", "none");
		$(".choice_pop_li4").css("display", "block");
	}
	if($(ob).attr("cid")!=""){
		for(i=0;i<$(".choice_pop_li"+num).length;i++){
			if($(ob).attr("cid") == $(".choice_pop_li"+num).eq(i).attr("cid")){
				$(".choice_pop_li"+num).eq(i)
				$(".choice_pop_li"+num).eq(i).find("img").attr("src", "../img/gou3.png")
				$(".choice_pop_li"+num).eq(i).attr("gou", "1")
			}
		}
	}
	
}
/*确定第一级筛选*/
function pop_but() {
	$(".choice_black").css("display", "none");
	$(".choice_pop1").animate({
		right: "-300px"
	});
	//取值
	var brand = $(".choice_pop_lei").eq(0).attr("cid");
	var type = $(".choice_pop_lei").eq(1).attr("cid");
	var dis = $(".choice_pop_lei").eq(3).attr("cid");
	var fun = $(".choice_pop_lei").eq(2).attr("cid");
	//ajax
	$(".choice_body ul").empty()
	choice_ajax(1,1, "", brand, type, dis, fun, "",getQueryString("phId"))
	sessionStorage.mainSearch = "";
	//把页数化为1
	$(".head_l").attr("page",1)
}
/*确定第二级筛选确定*/
function pop_make() {
	var txt = ""
	var val = 0;
	var cid = 0;
	for(i = 0; i < $(".choice_pop_gou").length; i++) {
		if($(".choice_pop_gou").eq(i).attr("gou") == 1) {
			txt = $(".choice_pop_gou").eq(i).find("span").text();
			cid = $(".choice_pop_gou").eq(i).attr("cid");
			val = 1
		}
	}
	if(cid == 0) {
		cid = ""
	}
	for(i = 0; i < $(".choice_pop_lei").length; i++) {
		if($(".choice_pop_lei").eq(i).attr("uname") == 1) {
			$(".choice_pop_lei").eq(i).find(".choice_pop_i").text(txt);
			$(".choice_pop_lei").eq(i).attr("cid", cid)
			pop_del2()
		}
	}
}
/*第二级选择*/
function pop_gou(ob) {
	if($(ob).attr("gou") == 1) {
		$(".choice_pop_gou").attr("gou", "0")
		$(".choice_pop_gou").find("img").attr("src", "")
	} else {
		$(".choice_pop_gou").attr("gou", "0")
		$(".choice_pop_gou").find("img").attr("src", "")
		$(ob).find("img").attr("src", "../img/gou3.png")
		$(ob).attr("gou", "1")
	}
}
/*重置*/
function chong() {
	$(".choice_pop_i").text("");
	$(".choice_pop_lei").attr("cid", "");
}

function non_choice() {
	strhtml = '<li> <div class="non_cue"> <img src="../img/nono.png" /> <p>很抱歉，您搜索的“<span class="non_cue_name">■■■■</span>“商品不存在，可能已下架或者被转移。</p> <p>建议你:</p> <p>1.看看输入的文字是否有误</p> <p>2.致电客服：0571-8257-6221</p> </div> </li>'
	$(".choice_body ul").empty().append(strhtml);
}
//在添加初始分类进来的筛选赋值
function pop_first(){
	if($(".choice_pop_lei").eq(3).attr("cid") != null&&$(".choice_pop_lei").eq(3).attr("cid") != "") { //分类过来
		for(i = 0; i < $(".choice_pop_li4").length; i++){
			if($(".choice_pop_li4").eq(i).attr("cid")==$(".choice_pop_lei").eq(3).attr("cid")){
				$(".choice_pop_li4").eq(i).attr("gou",1);
				$(".choice_pop_li4").eq(i).find("img").attr("src", "../img/gou3.png")
			}
		}
		var txt = ""
		var val = 0;
		var cid = 0;
		for(i = 0; i < $(".choice_pop_li4").length; i++) {
			if($(".choice_pop_li4").eq(i).attr("gou") == 1) {
				txt = $(".choice_pop_li4").eq(i).find("span").text();
				cid = $(".choice_pop_li4").eq(i).attr("cid");
				val = 1
			}
		}
		if(cid == 0) {
			cid = ""
		}
		$(".choice_pop_lei").eq(3).find(".choice_pop_i").text(txt);
	}else if($(".choice_pop_lei").eq(1).attr("cid") != null&&$(".choice_pop_lei").eq(1).attr("cid") != ""){
		for(i = 0; i < $(".choice_pop_li2").length; i++){
			if($(".choice_pop_li2").eq(i).attr("cid")==$(".choice_pop_lei").eq(1).attr("cid")){
				$(".choice_pop_li2").eq(i).attr("gou",1);
				$(".choice_pop_li2").eq(i).find("img").attr("src", "../img/gou3.png")
			}
		}
		var txt = ""
		var val = 0;
		var cid = 0;
		for(i = 0; i < $(".choice_pop_li2").length; i++) {
			if($(".choice_pop_li2").eq(i).attr("gou") == 1) {
				txt = $(".choice_pop_li2").eq(i).find("span").text();
				cid = $(".choice_pop_li2").eq(i).attr("cid");
				val = 1
			}
		}
		if(cid == 0) {
			cid = ""
		}
		$(".choice_pop_lei").eq(1).find(".choice_pop_i").text(txt);
	}
	
	
}
