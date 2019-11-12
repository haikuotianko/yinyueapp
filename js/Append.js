
	// 毫秒转分钟：秒
	function timeset(Millisecond){
		
		var t = Millisecond / 1000;
		var d = addZero(t / 60);
		var m = addZero(t % 60);
		
		return {
			t : Millisecond,
			d : d,
			m : m,
			dt : d + ':' + m,
		}
	}

	// 数字美化 - 不足10补零
	function addZero(digit){
		digit = parseInt(digit);
		return digit < 10 ? '0' + digit : digit;
	}


	// 节流函数--函数防抖
	// antiShake(对象，触发事件，回调函数，间隔时间)
	function antiShake(obj,trigger, fn, shi) {
		var timers = [];
		$(obj).on(trigger, function() {
			var tim = setTimeout(function() {
				for (var i = 1; i < timers.length; i++) {
					clearTimeout(timers[i]);
				}
				timers = [];
				return fn();
			}, shi)
			timers.push(tim);
		})
	}
		

