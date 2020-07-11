$(function() {

	var content = $('.content');

	var Loading = $('.Loading');
	
	var shuju = null;
	
	

	var url = window.location.search.substring(1);
	//将recommendInfo转换为普通对象
	url = JSON.parse(decodeURIComponent(url));
	
	// console.log(url);
	dataget(url);
	
	
	// 调用懒加载
	// 节流函数--函数防抖
	// antiShake(对象，触发事件，回调函数，间隔时间)
	antiShake(document,'scroll',function(){
		
		var pad = content.find('li:last-child');
		
		var ptop = pad.offset().top;
		var pheight = pad.height();
		var htop = $('html').scrollTop();
		var wheight = $(window).height();
		
		if(ptop - wheight - pheight < htop){
			datashow(shuju);
			// console.log('懒加载数据');
		}
		
		
	},200)
	
	// 获取数据
	function dataget(obj) {
		luckyit.json(agent + Song_list_details, {id: obj.id}).then(data => {
			$('.column_text>marquee').text(data.playlist.name);
			shuju = data.playlist.tracks
			Loading.animate({
				opacity: 0
			}, transition * 2, function() {
				datashow(shuju);
				Loading.remove();
			})
		})
		// $.ajax({
		// 	type: 'GET',
		// 	// 代理服务器 + 根据id获取歌单详情
		// 	url: agent + Song_list_details,
		// 	data: {
		// 		id: obj.id,
		// 	},
		// 	success: function(data) {
				

		// 		$('.column_text>marquee').text(data.playlist.name);
		// 		shuju = data.playlist.tracks
		// 		Loading.animate({
		// 			opacity: 0
		// 		}, transition * 2, function() {
		// 			datashow(shuju);
		// 			Loading.remove();
		// 		})

		// 	},
		// 	error: function(err) {
		// 		//请求失败
		// 		console.log('err ==> ', err);
		// 	}
		// })

	}

	// 显示数据
	var showa = 0;

	function datashow(data) {
		if (showa > data.length) {
			return;
		}
		var shu = showa + Lazy_loading > data.length ? data.length : showa + Lazy_loading;
		// 深拷贝数组
		var obj = $.extend(true, [], data);
		obj = obj.splice(showa, shu);
		
		showa += Lazy_loading;
		var ul = content.find('ul');
		
		for (var i in obj) {
			var li = $('<li></li>');
			li.addClass('clearfix').data('id', obj[i].id);
			if(obj[i].id == url.audioId){
				li.addClass('active');
			}
			var ar = [];
			var dt = timeset(obj[i].dt).dt;
			for (var j in obj[i].ar) {
				ar.push(obj[i].ar[j].name);
			}

			var str =`
						<div class="ct_left fl clearfix">
							<div class="ct_img fl"><img class="img-auto" src="${obj[i].al.picUrl}" ></div>
							<div class="information fl">
								<div class="Song one-text">${obj[i].name}</div>
								<div class="name one-text">${ar.join('/')}</div>
							</div>
						</div>
						<div class="ct_right fr">
							<div class="date">${dt}</div>
						</div>`;
			li.data('id', obj[i].id);
			li.html(str);
			ul.append(li);
		}
		
		ul.on('click','li',function(){
			// console.log($(this).data('id'));
			var _this = $(this);
			// 传参给父页面
			window.parent.postMessage(JSON.stringify({
				imgurl : _this.find('.ct_img>img').prop('src'),
				Song : _this.find('.Song').text(),
				name : _this.find('.name').text(),
				date : _this.find('.date').text(),
				id : $(this).data('id'),
				but : true,
			}), '*');
			
			_this.addClass('active').siblings().removeClass('active');
			
		})
		
		if (showa > data.length) {
			content.append($('<p style="font-size: .12rem; color:#666; text-align: center; margin-top: .2rem;">我也是有底线的</p>'));
		}
	}

	// 关闭当前页面
	$('.Return').on('click', function() {
		var obj = url;
		obj.but = false;
		obj.id = null;
		
		// 传参给父页面
		window.parent.postMessage(JSON.stringify(obj), '*');

	})

	// function toParent() {
	// 	// 自定义对象
	// 	var obj = {
	// 		value: '我是子页面传过来的参数'
	// 	};
	// 	// 传参给父页面
	// 	window.parent.postMessage(JSON.stringify(obj), '*');
	// }



})
