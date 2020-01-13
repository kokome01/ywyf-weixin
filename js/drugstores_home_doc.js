$(document).ready(function() {
	var data = JSON.parse(sessionStorage.doc_inf)
	//头像
	$("#doc_img").attr("src",data.img)
	//名字
	$("#doc_name").text(data.name)
	//职位
	var work = "";
	if(data.work===0){
        work = "主治医生"
    }else if(data.work===1){
        work = "副主任"
    }else{
        work = "主任"
    }
	$("#doc_work").text(work)
	//性别
	var sex = "";
	if(data.sex===0){
        sex = "女"
    }else{
        sex = "男"
    }
	$("#doc_sex").text(sex)
	//医院
	$("#doc_hos").text(data.hos)
	//科室
	$("#doc_department").text(data.department)
})

function back(){
	window.location.href = 'drugstores_home.html?id='+getQueryString("id");
}
