function assess(ob){
				if($(ob).attr("hid")==0){
					$(ob).attr("hid","1").find(".assess_val").removeClass("assess_hide")
				}
				else{
					$(ob).attr("hid","0").find(".assess_val").addClass("assess_hide")
				}
			}