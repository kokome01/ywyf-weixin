/*点击综合排序*/
function choice_head(ob) {
	$(".choice_head").find("div").removeClass("choice_xu");
	$(".sharp_down").css("display", "block").attr("src", "../img/down2.png");
	$(".sharp_up").css("display", "block").attr("src", "../img/up2.png");
	$(ob).addClass("choice_xu");
}
/*点击价格优先*/
function price() {
	$(".choice_head").find("div").removeClass("choice_xu");
	$(".choice_sharp").addClass("choice_xu");
	if($(".choice_sharp").attr("uname") == 1) {
		$(".sharp_down").css("display", "block").attr("src", "../img/down3.png");
		$(".sharp_up").css("display", "none");
		$(".choice_sharp").attr("uname", "2");
	} else if($(".choice_sharp").attr("uname") == 2) {
		$(".sharp_up").css("display", "block").attr("src", "../img/up3.png");
		$(".sharp_down").css("display", "none");
		$(".choice_sharp").attr("uname", "1");
	}
}
/*点击筛选*/
function screen() {
	$(".choice_black").css("display", "block");
	$(".choice_pop1").animate({ right: "0px" });
}
/*取消一级pop*/
function pop_del1() {
	$(".choice_black").css("display", "none");
	$(".choice_pop1").animate({ right: "-300px" });
}
/*取消二级pop*/
function pop_del2() {
	$(".choice_pop1").animate({ right: "0px" });
	$(".choice_pop2").animate({ right: "-300px" });
}
/*第一级分类筛选*/
function pop_filter(ob) {
	$(".choice_pop_lei").attr("uname", "0")
	$(ob).attr("uname", "1")
	$(".choice_pop1").animate({ right: "-300px" });
	$(".choice_pop2").animate({ right: "0px" });
}
/*确定第一级筛选*/
function pop_but() {
	$(".choice_black").css("display", "none");
	$(".choice_pop1").animate({ right: "-300px" });
}
/*确定第二级筛选确定*/
function pop_make() {
	var txt = ""
	var val = 0
	for(i = 0; i < $(".choice_pop_gou").length; i++) {
		if($(".choice_pop_gou").eq(i).attr("gou") == 1) {
			txt = $(".choice_pop_gou").eq(i).find("span").text()
			val = 1
		}
	}
	for(i = 0; i < $(".choice_pop_lei").length; i++) {
		if($(".choice_pop_lei").eq(i).attr("uname") == 1) {
			$(".choice_pop_lei").eq(i).find(".choice_pop_i").text(txt);
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
	$(".choice_pop_i").text("")
}