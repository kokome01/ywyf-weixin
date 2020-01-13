//ajax
$(document).ready(function() {
	if(getQueryString("id") != undefined && getQueryString("id") != "undefined") {
		$.ajax({
			url: web_url + '/ywyf-weixin/hospital/hospitalInfo?id=' + getQueryString("id"), //地址
			dataType: "json",
			type: "post",
			xhrFields: {
				withCredentials: true
			},
			timeout: 50000,
			success: function(data) {
				//console.log(JSON.stringify(data));
				$("#hospital_name").text(data.hospital.hosName);
				$("#hospital_tel").text(data.hospital.tel);
				$("#hospital_address").text(data.hospital.address);
				$("#hospital_img").attr("src", data.hospital.pic)
				if(data.hospital.content == null) {
					$("#hospital_content").text("暂无详细的医院介绍");
				} else {
					$("#hospital_content").html(data.hospital.content)
				}
				//便民药店
				if(data.pharmacies.length != 0) {
					$(".hospital_pharmacy").attr("onclick", "drugstore_on(" + data.pharmacies[0].id + ")")
				} else {
					$(".hospital_pharmacy").attr("onclick", "alert('尚未关联附近药房')")
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				//alert(XMLHttpRequest.status);
				//alert(XMLHttpRequest.readyState);
				//alert(textStatus);
				console.log("网络请求失败，请联系网站管理员!");
			},
		})
		$.ajax({
			url: web_url + '/ywyf-weixin/department/list.do?hos_id=' + getQueryString("id"), //地址
			dataType: "json",
			type: "post",
			xhrFields: {
				withCredentials: true
			},
			timeout: 50000,
			success: function(data) {
				console.log(JSON.stringify(data));
				sessionStorage.home_inf = JSON.stringify(data)
				/*科室*/
				if(data.department.length != 0) { //判断是否存在科室
					$(".medicine_zero").css("display", "none");
					//医生中的科室
					var strhtml1 = "";
					if(data.department.length < 4) {
						for(i = 0; i < data.department.length; i++) {
							strhtml1 += ' <li class="office_li" onclick="introduce(this,' + (i + 1) + ')">' + data.department[i].department + '</li>'
						}
						for(i = 0; i < 4 - data.department.length; i++) {
							strhtml1 += ' <li class="office_li office_li_hide" >0</li>'
						}
					} else if(data.department.length >= 4) {
						for(i = 0; i < 4; i++) {
							strhtml1 += ' <li class="office_li" onclick="introduce(this,' + (i + 1) + ')">' + data.department[i].department + '</li>'
						}
					}
					$(".office_ul").empty().append(strhtml1);
					$(".office_ul").find(".office_li").eq(0).addClass("office_li_on")
					//pop
					var strhtml2 = "";
					for(i = 0; i < data.department.length; i++) {
						strhtml2 += '<li class="department_li" onclick="department_li(this,' + (i + 1) + ')">' + data.department[i].department + '</li>'
					}
					$(".department_ul").append(strhtml2);
					//科室
					var strhtml5 = "";
					var imgb = null;
					var depName = "";
					for(i = 0; i < data.department.length; i++) {
						//展示不同的图文
						if(data.department[i].department == '皮肤科') {
							imgb = 1;
						} else if(data.department[i].department == '妇科') {
							imgb = 2;
						} else if(data.department[i].department == '产科' || data.department[i].department == '妇产科' || data.department[i].department == '儿科') {
							imgb = 3;
						} else if(data.department[i].department == '美容科') {
							imgb = 4;
						} else {
							imgb = 0;
						}
						//当科室字数超过两个
						if(data.department[i].department.length > 3) {
							depName = data.department[i].department.substring(0, 2) + '科'
						} else {
							depName = data.department[i].department
						}
						strhtml5 += '<li class="department_min_li" onclick="department_detailed(' + data.department[i].id + ')"><span class="department_min_span department_min_img' + imgb + '"><label>' + depName + '</label></span></li>'
						//当科室大于等于4个时
						if(i > 4) {
							break;
						}
					}
					for(i = 0; i < 4 - data.department.length; i++) {
						strhtml5 += '<li class="department_min_li office_li_hide"><span class="department_min_span department_min_img0"><label>0/label></span></li>'
					}
					$(".department_min_ul").empty().append(strhtml5);
				} else {
					$(".medicine_zero").css("display", "block");
				}
				/*医生*/
				var strhtml3 = "";
				var strhtml4 = "";
				for(i = 0; i < data.department.length; i++) {
					if(data.department[i].doctors.length < 4) { //判断是否小于四个
						for(j = 0; j < data.department[i].doctors.length; j++) {
							strhtml3 += '<li class="medicine_li" dep="'+data.department[i].department+'" onclick="docInf(this)"  key="' +
								(i + 1) +
								'" doc="' + j + '"><img class="i_medicine i_cosmetology"  src="' +
								data.department[i].doctors[j].pic +
								'"></img><p>' +
								data.department[i].doctors[j].name +
								' 医生</p></li>'
						}
						for(j = 0; j < 4 - data.department[i].doctors.length; j++) {
							strhtml3 += '<li class="medicine_li office_li_hide" onclick="docInf(this)" key="' +
								(i + 1) +
								'" ><img class="i_medicine i_cosmetology"  src="' +
								0 +
								'"></img><p>' +
								0 +
								' 医生</p></li>'
						}
					} else {
						for(j = 0; j < 4; j++) {
							strhtml3 += '<li class="medicine_li" dep="'+data.department[i].department+'" onclick="docInf(this)" key="' +
								(i + 1) +
								'" doc="' + j + '"><img class="i_medicine i_cosmetology"  src="' +
								data.department[i].doctors[j].pic +
								'"></img><p>' +
								data.department[i].doctors[j].name +
								' 医生</p></li>'
						}
					}
					for(j = 0; j < data.department[i].doctors.length; j++) {
						strhtml4 += '<li class="doctor_li" onclick="docInf(this)" key="' +
							(i + 1) +
							'" doc="' + j + '"><img src="' +
							data.department[i].doctors[j].pic +
							'" class="doctor_img"/><div class="doctor_content"><p class="doctor_name">' +
							data.department[i].doctors[j].name +
							' 医生</p></div></li>'
					}
				}
				$(".medicine_ul").empty().append(strhtml3);
				$(".doctor_ul").empty().append(strhtml4);

				//隐藏不属于第一个科室的医生
				for(i = 0; i < $(".medicine_li").length; i++) {
					if($(".medicine_li").eq(i).attr("key") != 1) {
						$(".medicine_li").eq(i).addClass("doc_hide")
					}
				}

				if(data.department.length == 0 || data.department[0].doctors.length != 0) { //判断是否存在医生
					$(".doc_zero").css("display", "none");
				} else if(data.department[0].doctors.length == 0) {
					$(".doc_zero").css("display", "block");
					$(".zero_img").hide();
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				//alert(XMLHttpRequest.status);
				//alert(XMLHttpRequest.readyState);
				//alert(textStatus);
				console.log("网络请求失败，请联系网站管理员!");
			},
		})
		$.ajax({
			url: 'http://www.mryisheng.com/ywyf-weixin/departmentActivity/list?pageNo=1&hospitalId='+getQueryString("id")+'&departmentId=', //地址web_url + 
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
						//
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
	} else {
		window.location.href = '../other/drugstores_hospital.html'
	}
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
//1跳转到医院餐厅 0跳转到便利店
function store_index(type) {
	if(type == 0) {
		alert("超市尚未开放")
	} else if(type == 1) {
		alert("餐厅尚未开放")
		//window.location.href='../store/store_index.html'
		//sessionStorage.storeIndex = type
	}
}
//便民药店展开
function drugstore_toggle() {
	$(".hospital_medicine").toggle(500)
}
//药店点击
function drugstore_on(id) {
	window.location.href = 'drugstores_info.html?info=' + id
}
//pop显示
function pop_show() {
	$("#black_pop").show();
	$("#pop_box").show();
	$(".department_pop").animate({
		right: "0px"
	});
}

//pop隐藏
function pop_hide() {
	$("#black_pop").hide();
	$("#pop_box").hide();
	$(".department_pop").animate({
		right: "-300px"
	});
}
/*外部医生中科室选择*/
function introduce(ob, num) {
	$(".office_li").removeClass("office_li_on")
	$(ob).addClass("office_li_on")
	var docnum = 0;
	for(i = 0; i < $(".medicine_li").length; i++) {
		if($(".medicine_li").eq(i).attr("key") != num) {
			$(".medicine_li").eq(i).addClass("doc_hide")
		} else {
			$(".medicine_li").eq(i).removeClass("doc_hide");
			if($(".medicine_li").eq(i).hasClass("office_li_hide")) {
				docnum++
			}
		}
	}
	//判断医生是否存在
	if(docnum == 4) {
		$(".doc_zero").show()
	} else {
		$(".doc_zero").hide()
	}
}
//pop科室选择
function department_li(ob, num) {
	$(".department_li").removeClass("department_li_on")
	$(ob).addClass("department_li_on")

	var doctorNum = 0;
	for(i = 0; i < $(".doctor_li").length; i++) {
		if($(".doctor_li").eq(i).attr("key") == num || num == 0) {
			$(".doctor_li").eq(i).show();
			doctorNum++
		} else {
			$(".doctor_li").eq(i).hide();
		}
	}
	if(doctorNum <= 0) {
		$(".zero_img").show()
	} else {
		$(".zero_img").hide()
	}
}
//跳转到医生信息
function docInf(ob) {
	console.log(sessionStorage.home_inf)
	var data = JSON.parse(sessionStorage.home_inf);
	var i = $(ob).attr("key") - 1;
	var j = $(ob).attr("doc")
	var inf = {
		img: data.department[i].doctors[j].pic,
		name: data.department[i].doctors[j].name,
		work: data.department[i].doctors[j].type,
		sex: data.department[i].doctors[j].sex,
		hos: $("#hospital_name").text(),
		department: $(ob).attr("dep")
	}
	sessionStorage.doc_inf = JSON.stringify(inf)
	window.location.href = 'drugstores_home_doc.html?id=' + getQueryString("id");
}
//点击查看医院详细
function introduce_hos() {
	if($("#introduce_but").attr("int") == 0) {
		$(".introduce_txt").removeClass("introduce_hide");
		$("#introduce_but").attr("int", "1").text("点击收起")
	} else {
		$(".introduce_txt").addClass("introduce_hide");
		$("#introduce_but").attr("int", "0").text("查看详情")
	}
}
//跳转到科室详情
function department_detailed(id) {
	window.location.href = 'drugstores_department.html?dep=' + id + '&hos=' + getQueryString("id");
}
//跳转到科室项目
function item(id) {
	window.location.href = 'drugstores_activity.html?act=' + id + '&hos=' + getQueryString("id");
}
//跳转到科室项目列表
function item_most(){
	if($("#item_name").text()!=0){
		window.location.href = 'drugstores_activity_list.html?hos=' + getQueryString("id");
	}
}
