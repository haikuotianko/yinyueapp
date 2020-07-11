
$(function(){
	
	// 手机状态栏，预留高度24px
	var Android_task = $('.Android_task');
	
	// 头部元素
	var head = $('.head');
	
	// 导航栏
	var nav = $('.nav');
	
	// 专辑
	var Album = $('.Album');
	
	// 歌单
	var songSheet = $('.songSheet');
	
	
	
	// 初始化=============================================
	// 导航条样式
	navstyle();
	
	// 专辑数据加载
	Albumget();
	
	// 推荐歌单数据加载
	songAheetget();	
	
	// 初始化==========================================end
	
	// 推荐歌单请求
	function songAheetget(){
		luckyit.json(agent + Recommend_songs).then(res => {
			songAheetshow(res.result);
		})
		// $.ajax({
		// 	type: 'GET',
		// 	// 代理服务器 + 推荐歌单
		// 	url: agent + Recommend_songs,
		// 	success: function(result){
		// 		// console.log(result);
		// 		songAheetshow(result.result);
		// 	},
		// 	error: function (err) {
		// 	  //请求失败
		// 	  console.log('err ==> ', err);
		// 	}
		// })
	}
	
	// 显示推荐歌单内容
	function songAheetshow(obj){
		
		var ul = songSheet.find('ul');
		ul.html('');
		for(var i in obj){
			var li = $('<li></li>');
			// var name = obj[i].name;
			// if(name.length > 8){
			// 	name = '<marquee>' + name + '</marquee>';
			// }
			var str = `
				<div class="ss-box">
					<div class="ss-ba img-Load" style="background-image: url(${obj[i].picUrl})">
						<div class="people">
							<div class="people-text">
								${parseInt(obj[i].playCount / 10000)}万
							</div>
						</div>
					</div>
					<div class="ss-text two-text">
						${obj[i].name}
					</div>
				</div>`;
			li.data('id',obj[i].id);
			li.html(str);
			ul.append(li);
		}
		// li点击事件
		ul.on('click','li',function(){
			var _this = $(this);
			var wtop = _this.offset().top - $(window).scrollTop();
			page({
				audioId : $('#audio').data('id'),
				pa : 'Album',
				id : _this.data('id'),
				left : _this.offset().left,
				top : wtop,
				width : _this.width(),
				height : _this.height(),
				opacity : '0.1',
				borderRadius : '.15rem',
				
			});
			audio_this = _this;
			_this.animate({
				opacity:0,
			},transition * trtime)
		})
		
	}
	
	
	// 专辑数据请求
	function Albumget(){
		luckyit.json(agent + Latest_album).then(res => {
			Albumshow(res.albums);
		})
		// $.ajax({
		// 	type: 'GET',
		// 	// 代理服务器 + 最新专辑
		// 	url: agent + Latest_album,
		// 	success: function(result){
		// 		// console.log(result);
		// 		Albumshow(result.albums);
		// 	},
		// 	error: function (err) {
		// 	  //请求失败
		// 	  console.log('err ==> ', err);
		// 	}
		// })
	}
	
	// 遍历最新专辑
	function Albumshow(obj){
		var ul = Album.find('ul');
		ul.html('');
		for(var i in obj){
			var li = $('<li></li>');
			var name = obj[i].name;
			// if(name.length > 8){
			// 	name = '<marquee>' + name + '</marquee>';
			// }
			var str = `
				<div class="ab_box">
					<div class="ab_singer one-text">${obj[i].artist.name}</div>
					<div class="ab_ba">
						<img class="img-auto" src="./images/Album.png" >
						<div class="ab_img img-Load">
							<img class="img-auto" src="${obj[i].picUrl}" >
						</div>
					</div>
					<div class="ab_name one-text">${name}</div>
				</div>`;
			li.data('id',obj[i].id);
			li.html(str);
			ul.prepend(li);
		}
		// li点击事件
		ul.on('click','li',function(){
			var _this = $(this);
			var wtop = _this.offset().top - $(window).scrollTop();
			page({
				audioId : $('#audio').data('id'),
				pa : 'Album',
				id : _this.data('id'),
				left : _this.offset().left,
				top : wtop,
				width : _this.width(),
				height : _this.height(),
				opacity : '0.1',
				borderRadius : '.15rem',
				
			});
			audio_this = _this;
			_this.animate({
				opacity:0,
			},transition * trtime)
		})
		
	}
	
	// 展开二级页面
	function page(obj){
		
		var iframe = $('<iframe id="iframe" frameborder="0" scrolling="yes" seamless="seamless" ></iframe>');
		iframe.prop('src','./wed/' + obj.pa + '.html?' + JSON.stringify(obj));
		$('body').prepend(iframe);
		$('body').css("overflow-y","hidden");
		iframe.css({
			position : 'fixed',
			zIndex : 100,
			left : obj.left,
			top : obj.top,
			width : obj.width,
			height : obj.height,
			opacity : '0.1',
			borderRadius : obj.borderRadius,
		}).animate({
			left : 0,
			top : 0,
			width : '100%',
			height : '100%',
			opacity : '1',
			'border-radius' : '0rem',
		},transition * trtime)
	}
	
	function navstyle(){
		// nav 宽度判断开关--等于当前状态时，拦截触发
		var navIsbut = true;
		// 导航条样式
		antiShake(document,'scroll',function(){
			var height = Android_task.height();
			var top = nav.position().top - 1;
			if(top > height){
				if(navIsbut){
					nav.animate({
						width : '100%',
					},transition * trtime).find('.nav_img').animate({
						width : '40%',
					},transition * trtime)
					navIsbut = false;
				}
			}else{
				if(!navIsbut){
					nav.animate({
						width : '90%'
					},transition * trtime).find('.nav_img').animate({
						width : '50%',
					},transition * trtime)
					navIsbut = true;
				}
			}
			
		},200)
	}
	
	
	// 个人中心
	$('.Personal').on('click',function(){
		$('.Pl_wicket').css({
			display : 'block',
		})
		$('.Set_up').stop().animate({
			left : '0',
		},transition * trtime)
		$('body').css("overflow-y", "hidden");
		$('.set_time>input[name="'+trtime+'"]').addClass('active').siblings().removeClass('active');
	})
	
	$('.Pl_wicket').on('click',function(){
		
		$('.Set_up').stop().animate({
			left : '-50%',
		},transition * trtime,function(){
			$('.Pl_wicket').css({
				display : 'none',
			})
		})
		$('body').css("overflow-y", "auto");
	})
	
	$('.Set_up').on('click',function(e){
		e.stopPropagation();
		
	})
	
	$('.set_time>input').on('click',function(){
		let _this = $(this);
		trtime = _this.prop('name');
		_this.addClass('active').siblings().removeClass('active');
		//JSON.stringify(data);把对象转为字符串
		localStorage.setItem('Transition_time', JSON.stringify(trtime));
	})
	
})