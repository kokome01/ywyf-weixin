var times = null;
var ra = 0;
times = setInterval(function() {
	ra = ra + 5
	$(".wer").css("-webkit-transform", "rotate(" + ra + "deg)")
}, 100);