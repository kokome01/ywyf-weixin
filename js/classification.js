window.onload = function() {
	deploy()
}
//分类第一级点击
function class_but(ob, pid) {
	if(pid!=0)
	{
		$(".class_r_li").css("display","none");
		//var ida="#"+pid;
		$(".class_r_li[x="+pid+"]").css("display","inline-block");
	}
	else
	{
		$(".class_r_li").css("display","inline-block");
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
/*ajax*/
$(document).ready(function() {
	var cla1 = '<li ><div class="class_list class_on" onclick="class_but(this,8)">全部</div></li>'
	var cla2 = ""
	var cla3 = ""
	$.ajax({
		url: "http://192.168.0.102/ywyf-weixin//product/typesList", //地址
		dataType: "json",
		type: "post",
		timeout: 5000,
		success: function(data) {
			$(".class_left ul").empty();
			for(i = 0; i < data.data.length; i++) {
				cla1 += '<li ><div class="class_list" onclick="class_but(this,' + i + ')">' +
					data.data[i].typeName +
					'</div></li>'
			}
			$(".class_left ul").append(cla1);
			for(i = 0; i < data.data.length; i++) {
				for(l = 0; l < data.data[i].funTypes.length; l++) {
					for(j = 0; j < data.data[i].funTypes[l].diseases.length; j++) {
						cla3 += '<li onclick="window.location.href=' + "shop.html" + '"><span>' +
							data.data[i].funTypes[l].diseases[j].name +
							'</span></li>'
					}

					cla2 += '<li class="class_r_li"><div class=""><div class="class_r_head">' +
						data.data[i].funTypes[l].name +
						'</div><div class="class_r_body"><ul>' +
						cla3 +
						'</ul></div></div></li>	'
				}
			}
			$(".class_right>ul").append(cla2);
			deploy();
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			/*alert(XMLHttpRequest.status);
			alert(XMLHttpRequest.readyState);
			alert(textStatus);*/
		},

	})
})