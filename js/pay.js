window.onload = function() {
	//暂无存货
	non_stock()
	//产家小计
	subtotal()
	//产品金额
	grand_total()
	//实际付款
	payment()
}
/*暂无存货*/
function non_stock() {
	for(i = 0; i < $(".pay_list_b").length; i++) {
		if($(".pay_list_b").eq(i).find(".non_stock").text() == "") {
			$(".pay_list_b").eq(i).find(".non_stock").css("display", "none");
		}
	}
}
/*产家小计*/
function subtotal() {
	for(j = 0; j < $(".pay_list").length; j++) {
		var num0 = 0;
		var num1 = 0;
		var num2 = 0;
		for(i = 0; i < $(".pay_list").eq(j).find(".pay_list_b").length; i++) {
			num1 = parseFloat($(".pay_list").eq(j).find(".pay_list_b").eq(i).find(".pay_price").text());
			num2 = parseFloat($(".pay_list").eq(j).find(".pay_list_b").eq(i).find(".quantity").text());
			num0 += num1 * num2
		}
		$(".pay_list").eq(j).find(".small_plan").text(num0.toFixed(2))
	}
}
/*产品金额*/
function grand_total() {
	var num4 = 0;
	var num5 = 0;
	//商品
	for(i = 0; i < $(".pay_list").length; i++) {
		num4 += parseFloat($(".pay_list").eq(i).find(".small_plan").text());
	}
	$(".grand_total").text(num4.toFixed(2))
	//快递
	for(i = 0; i < $(".pay_list").length; i++) {
		num5 += parseFloat($(".pay_list").eq(i).find(".express_sm").text());
	}
	$(".express_big").text(num5.toFixed(2))
}
/*实际付款*/
function payment() {
	$(".payment_num").text(parseFloat($(".grand_total").text()) + parseFloat($(".express_big").text()))
}