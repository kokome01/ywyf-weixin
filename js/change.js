//点击删除订单
function del(ob) {
	$(".black").css("display", "block");
	$(".cue").css("display", "block")
	$(ob).parents(".order_li").addClass("order_li_del");
	$(".cue_text").text("你确认要删除订单");
}
//确认删除
function cue_but() {
	$(".order_li_del").remove()
	$(".black").css("display", "none");
	$(".cue").css("display", "none");
}
//取消删除
function cue_del() {
	$(".black").css("display", "none");
	$(".cue").css("display", "none");
	$(".order_li_del").removeClass("order_li_del");
}
//填写快递单号
function express() {
	$(".black").css("display", "block");
	$(".express").css("display", "block");
	$(ob).parents(".order_li").addClass("order_li_express");
}
//确认填写快递单号
function express_but() {
	$(".order_li_express").remove()
	$(".black").css("display", "none");
	$(".express").css("display", "none");
	//ajax
}
//取消填写快递单号
function express_del() {
	$(".black").css("display", "none");
	$(".express").css("display", "none");
	$(".order_li_del").removeClass("order_li_express");
}