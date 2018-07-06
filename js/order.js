window.onload=function(){
			}
			//头部分类点击
			function list(ob){
				$(".order_head_i").removeClass("order_head_but");
				$(ob).addClass("order_head_but")
			}
			//点击删除订单
			function del(ob){
				$(".black").css("display","block");
				$(ob).parents(".order_li").addClass("order_li_del");
				$(".cue_text").text("你确认要删除订单");
			}
			//确认删除
			function cue_but(){
				//
				$(".order_li_del").remove()
				$(".black").css("display","none");
				manufactor()
				//
				$(".order_take_y").text("已收货").removeClass("order_take_y");
				
			}
			//取消删除
			function cue_del(){
				$(".black").css("display","none");
				$(".order_li_del").removeClass("order_li_del");
				//
				$(".order_take_y").removeClass("order_take_y");
			}
			//判断商城是否存在
			function manufactor(){
				for(i=0;i<$(".order_list").length;i++){
					if($(".order_list").eq(i).find(".order_li").length==0){
						$(".order_list").eq(i).remove()
					}
				}
			}
			//提醒发货
			function warn(ob){
				if($(ob).find("b").text()=="提醒发货"){
					$(ob).find("b").text("已经提醒")
				}
				else{
					$(ob).find("label").fadeIn(500).delay(1).fadeOut(500);
				}
			}
			//确认收货
			function take(ob){
				$(".black").css("display","block");
				$(ob).addClass("order_take_y");
				$(".cue_text").text("你确认收货");
			}