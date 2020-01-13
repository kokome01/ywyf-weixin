$(document).ready(function() {
	//本地缓存
	native0()
	//合计
	total()
})
//本地导入数据
function native0() {
	//console.log(localStorage.json_shop)
	$(".body").empty()
	if(localStorage.json_shop != undefined && localStorage.json_shop != "undefined") {
		var data = JSON.parse(localStorage.json_shop);
		var strhrml1 = "";
		var strhtml2 = "";
		var rule = "";
		for(i = 0; i < data.store.length; i++) {
			if(data.store[i].baoyou[0].rule == 0) {
				rule = "包邮"
			} else if(data.store[i].baoyou[0].rule == 1) {
				rule = "满重包邮"
			} else if(data.store[i].baoyou[0].rule == 2) {
				rule = "满额包邮"
			} else if(data.store[i].baoyou[0].rule == 3) {
				rule = "固定邮费"
			}
			strhtml2 = ""
			for(j = 0; j < data.store[i].commodity.length; j++) {
				strhtml2 += '<li class="shop_commodity_li" weight="' +
					data.store[i].commodity[j].weight +
					'" commid="' +
					data.store[i].commodity[j].id +
					'" ><img src="' +
					data.store[i].commodity[j].img +
					'"/><div class="shop_commodity_text"><p><span class="shop_commodity_name">' +
					data.store[i].commodity[j].name +
					'</span><span class="shop_red shop_commodity_price">' +
					data.store[i].commodity[j].price +
					'</span><span class="shop_red">￥</span></p><p><span>x</span><span class="shop_commodity_num">' +
					data.store[i].commodity[j].num +
					'</span></p></div></li>'
			}
			strhrml1 += '<li class="shop_li" storeid="' + data.store[i].id + '"><div class="shop_li_head"><span class="shop_li_name">' +
				data.store[i].name +
				'</span><span class="store_img shop_i_right"></span><span class="store_img shop_i_del" onclick="del(this)"></span></div><ul class="shop_commodity_ul">' +
				strhtml2 +
				'</ul><div class="shop_other"><p><b>配送方式</b><span class="shop_rule">' +
				rule +
				'</span></p></div><div class="shop_other"><p><b>配送</b><span class="shop_red shop_dispatching">' +
				data.store[i].baoyou[0].postage +
				'</span><span class="shop_red">￥</span></p></div><div class="shop_other shop_settle"><p><span class="shop_settle_but" onclick="settle_but(this)">' +
				"去结算" +
				'</span><span class="shop_red shop_total" >18.90</span><span class="shop_red">￥</span><b>合计</b></p></div></li>'
		}
		$(".body").empty().append(strhrml1)
	}
	if($(".body").html()==""){
		$(".body").html('<div class="payment_zero"></div>')
	}
}
//删除
function del(ob) {
	
	var data = JSON.parse(localStorage.json_shop);
	var mymessage = confirm("确认删除？");
	if(mymessage == true) {
		//$(ob).parents(".shop_li").remove();
		//删除本地缓存 
		for(i = 0; i < data.store.length; i++) {
			console.log($(ob).parents(".shop_li").attr("storeid"));
			if(data.store[i].id == $(ob).parents(".shop_li").attr("storeid")) {
				data.store.splice(i, 1)
			}
		}
	}
	localStorage.json_shop = JSON.stringify(data)
	window.location.reload()
}
//合计
function total() {
	for(i = 0; i < $(".shop_li").length; i++) {
		var total1 = parseFloat(0);
		var total2 = parseFloat(0);
		for(j = 0; j < $(".shop_commodity_ul").eq(i).find("li").length; j++) {
			var va = $(".shop_commodity_ul").eq(i).find("li").eq(j)
			total1 += parseFloat(va.find(".shop_commodity_price").text()) * parseFloat(va.find(".shop_commodity_num").text())
		}
		total2 = parseFloat($(".shop_dispatching").eq(i).text())
		$(".shop_total").eq(i).text((total1 + total2).toFixed(2))
	}
	//console.log(localStorage.json_shop)
}
//结算
function settle_but(ob) {
	window.location.href = 'store_settling.html?spmktId='+$(ob).parents(".shop_li").attr("storeid")
}
//设置
function set_up() {
	$("#set_up").slideToggle();
}
//清空
function kong(){
	localStorage.json_shop = undefined;
	window.location.reload()
}
