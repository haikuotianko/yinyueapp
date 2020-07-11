$(function() {

	// 播放器控件
	var audio = $('#audio');


	var audioplay = $('.audioplay');

	// 播放器头像
	var Songurl = $('.minPlayer>.mp_img>span');

	var Loading = $('.Loading');

	// 播放器界面（大）
	var maxPlayer = $('.maxPlayer');

	// 播放到进度条
	var progress = $('.progress');

	// 小圆点--小滑块
	var slider = $('.slider');
	
	// 当前播放歌曲id
	var audioId = null;
	
	// 歌词
	var Lyriclise = $('.Lyriclise');

	// 音乐总时长
	var duration = 0;

	// 当前播放进度--实时播放(秒)
	var audiotims = 0;

	// 音乐进度条开关
	var but_music = true;

	// 歌词数组列表
	var Lyriclist = null;

	// 音乐播放列表
	var Music_play = Music_playlist;
	
	Initialization();
	// 初始显示
	function Initialization(initis){
		if(Music_play[0] != undefined){
			let obj = Music_play[0];
			if(initis){
				// 获取音乐
				audioget(obj.id);
				// 获取歌词
				audioLyricsget(obj.id);
			}
			
			// 播放器显示（小）
			audioshow(obj);
			// 播放器显示（大）
			audioshowmax(obj);
			
		}
	}
	
	// 播放暂停按钮2 触发按钮1事件
	$('.audioplay-two').on('click',function(){
		audioplay.trigger('click');
	})
	

	// 播放暂停按钮
	audioplay.on('click', function(e) {
		e.stopPropagation();
		if (Music_play[0] == undefined) {
			console.log('当前播放列表没有歌曲，随机播放!');
			Loading.show(transition * trtime);
			return Recommended();
		}else if(!audioId){
			Initialization(true);
		}

		if ($(this).prop('name') != 1) {
			// 播放
			audio[0].play();
			// audio.trigger("click");//模拟执行audio的事件 
		} else {
			// 暂停pause();
			audio[0].pause();
			
		}

	})
	
	// 下一首按钮2 触发按钮1事件
	$('.Next-fn-two').on('click',function(){
		$('.Next-fn').trigger('click');
	})
	
	// 下一首按钮
	$('.Next-fn').on('click',function(e){
		e.stopPropagation();
		if(Music_play[0] == undefined || audioId == null){
			
			return audioplay.trigger('click');
		}
		let shu = 0;
		let index = $('.Pattern').data('Patt');
		if(index != '1' || index == undefined){
			for(let i in Music_play){
				// console.log(Music_play[i])
				if(Music_play[i].id == audioId){
					shu = ++i >= Music_play.length ? 0 : i;
					break;
				}
			}
		}else{
			
			shu = Math.floor(Math.random() * Music_play.length);
			if(Music_play[shu].id == audioId && Music_play.length > 1){
				console.log('随机到当前歌曲，启用递归');
				return $(this).trigger('click');
			}
		}
		
		let obj = Music_play[shu];
		// console.log(shu,obj)
		// 获取音乐
		audioget(obj.id);
		// 获取歌词
		audioLyricsget(obj.id);
		// 播放器显示（小）
		audioshow(obj);
		// 播放器显示（大）
		audioshowmax(obj);
		
		
	})
	
	// 上一首按钮
	$('.Last_one').on('click',function(){
		if(Music_play[0] == undefined || audioId == null){
			return audioplay.trigger('click');
		}
		
		let shu = 0;
		for(let i in Music_play){
			// console.log(Music_play[i])
			if(Music_play[i].id == audioId){
				shu = --i < 0 ? Music_play.length - 1 : i
				break;
			}
		}
		let obj = Music_play[shu];
		// console.log(shu,obj)
		// 获取音乐
		audioget(obj.id);
		// 获取歌词
		audioLyricsget(obj.id);
		// 播放器显示（小）
		audioshow(obj);
		// 播放器显示（大）
		audioshowmax(obj);
		
	})
	
	let imgarr = ['List_loop','Random','Single'];
	let imgarrIs = 0;
	$('.Pattern').on('click',function(){
		imgarrIs++;
		imgarrIs = imgarrIs >= imgarr.length ? 0 : imgarrIs;
		$(this).find('img').prop('src','./icons/' + imgarr[imgarrIs] + '.png');
		$(this).data('Patt',imgarrIs);
	})	
	
	// 音频播放完成事件
	audio.on('ended',function(){
		let index = $('.Pattern').data('Patt');
		if(index == '2'){
			//重新加载
			audio[0].load();
			
			//播放
			audio[0].play();
		}else{
			$('.Next-fn').trigger('click');
		}
	})
	
	//音频播放事件 onplay
	audio.on('play', function() {
		audioplay.prop('name', 1);
		audioplay.find('img').prop('src', './icons/suspend.png');
		$('.audioplay-two').find('img').prop('src', './icons/suspend.png');
		// animation-play-state: paused | running;
		Songurl.css({
			'animation-play-state': 'running',
		})


		// console.log('音频已经开始播放');
	})


	//音频停止事件 onpause
	audio.on('pause', function() {
		audioplay.prop('name', 0);
		audioplay.find('img').prop('src', './icons/play.png');
		$('.audioplay-two').find('img').prop('src', './icons/play.png');
		Songurl.css({
			'animation-play-state': 'paused',
		})
		console.log('音频已经停止，广告环节');
	})

	//音频可以播放时事件 oncanplay
	audio.on('canplay', function() {
		Loading.hide(transition * trtime);
		audio[0].play();
		//获取音频总时长
		duration = this.duration;
		var time = addZero(duration / 60) + ':' + addZero(duration % 60);
		// console.log(duration)
		$('.time2').text(time);
	})

	//监听音频实时播放事件 ontimeupdate
	audio.on('timeupdate', function() {

		if (audiotims != parseInt(this.currentTime)) {
			audiotims = parseInt(this.currentTime);
			var percent = this.currentTime / duration;

			var left = ($('.axis').width() - slider.outerWidth()) * percent;
			var count = audio[0].currentTime;
			var time = addZero(count / 60) + ':' + addZero(count % 60);

			
				
			
			// 获取已缓冲部分的 TimeRanges 对象
			var timeRanges = audio[0].buffered;
			if(timeRanges.length > 0){
				// 获取以缓存的时间
				var timeBuffered = timeRanges.end(timeRanges.length - 1);
				// 获取缓存进度，值为0到1
				var bufferPercent = timeBuffered / audio[0].duration;
				// ...... 
				// 之后将bufferPercent按照自己需要的方式进行处理即可
				// 处理的时候要注意浮点数精度造成的误差。
				
				$('.Load').css('width', bufferPercent * $('.axis').width());
			}
			
			
			// 拦截判断
			if (!but_music) {
				return;
			}
			
			$('.time1').text(time);
			progres(left);

			audioLyricsmove(time);
		}
	})

	// 播放为空时，获取推荐音乐
	function Recommended() {
		luckyit.json(agent + New_music).then(obj => {
			for(let i in obj.result){
				var ar = [];
				var dt = obj.result[i].song.artists;
				for (var j in dt) {
					ar.push(dt[j].name);
				}
				Music_play.push({
					id: obj.result[i].id,
					name: obj.result[i].name,
					imgurl: obj.result[i].song.album.picUrl,
					Song: ar.join('/'),
					date : timeset(obj.result[i].song.duration).dt,
				})
			}
			//JSON.stringify(data);把对象转为字符串
			localStorage.setItem('Music_playlis_storage', JSON.stringify(Music_play));
			let r = Math.floor(Math.random() * Music_play.length);
			let shuju = {
				id: Music_play[r].id,
				name: Music_play[r].name,
				imgurl: Music_play[r].imgurl,
				Song: Music_play[r].Song,
				date : Music_play[r].date,
			}
			// 清空歌词列表
			Lyriclise.html('');
			audioget(shuju.id);
			// 获取歌词
			audioLyricsget(shuju.id);
			audioshow(shuju);
			audioshowmax(shuju);
			
			
		})
		// $.ajax({
		// 	type: 'GET',
		// 	// 代理服务器 + 推荐新音乐
		// 	url: agent + New_music,
		// 	success: function(obj) {
				
		// 		for(let i in obj.result){
		// 			var ar = [];
		// 			var dt = obj.result[i].song.artists;
		// 			for (var j in dt) {
		// 				ar.push(dt[j].name);
		// 			}
		// 			Music_play.push({
		// 				id: obj.result[i].id,
		// 				name: obj.result[i].name,
		// 				imgurl: obj.result[i].song.album.picUrl,
		// 				Song: ar.join('/'),
		// 				date : timeset(obj.result[i].song.duration).dt,
		// 			})
		// 		}
		// 		//JSON.stringify(data);把对象转为字符串
		// 		localStorage.setItem('Music_playlis_storage', JSON.stringify(Music_play));
		// 		let r = Math.floor(Math.random() * Music_play.length);
		// 		let shuju = {
		// 			id: Music_play[r].id,
		// 			name: Music_play[r].name,
		// 			imgurl: Music_play[r].imgurl,
		// 			Song: Music_play[r].Song,
		// 			date : Music_play[r].date,
		// 		}
		// 		// 清空歌词列表
		// 		Lyriclise.html('');
		// 		audioget(shuju.id);
		// 		// 获取歌词
		// 		audioLyricsget(shuju.id);
		// 		audioshow(shuju);
		// 		audioshowmax(shuju);
				
				
				
		// 	},
		// 	error: function(err) {
		// 		//请求失败
		// 		console.log('err ==> ', err);
		// 	}
		// })
	}

	// 根据歌曲的id获取音频
	function audioget(id) {
		luckyit.json(agent + Get_audio_url,{id}).then(obj => {
			console.log(obj)
			// console.log(obj.data[0].url);
			if(obj.data[0].url == null){
				alert("获取歌曲音频失败,请更换其他歌曲!");
			}
			audioId = id;
			audio.data('id', audioId);
			$('#audio').prop('src', obj.data[0].url);
			audioplay.find('img').prop('src', './icons/suspend.png');
		})
		// $.ajax({
		// 	type: 'GET',
		// 	// 代理服务器 + 根据歌曲的id获取音频
		// 	url: agent + Get_audio_url,
		// 	data: {
		// 		id: id,
		// 	},
		// 	success: function(obj) {
		// 		console.log(obj)
		// 		// console.log(obj.data[0].url);
		// 		if(obj.data[0].url == null){
		// 			alert("获取歌曲音频失败,请更换其他歌曲!");
		// 		}
		// 		audioId = id;
		// 		audio.data('id', audioId);
		// 		$('#audio').prop('src', obj.data[0].url);
		// 		audioplay.find('img').prop('src', './icons/suspend.png');
		// 	},
		// 	error: function(err) {
		// 		//请求失败
		// 		console.log('err ==> ', err);
		// 	}
		// })
	}




	// 显示头像，歌名，歌手(小)
	function audioshow(obj) {
		// 添加到播放列表
		Music_playadd(obj);
		Songurl.find('img').prop('src', obj.imgurl);
		$('.Song_name').text(obj.Song);
		$('.singer').text(obj.name);
		
		$('.Load').css('width', 0);
	}

	// 歌名，歌手，背景(大)
	function audioshowmax(obj) {
		$('.Song-ba').css({
			backgroundImage: 'url(' + obj.imgurl + ')',
		})
		$('.maxPlayer-song-name').text(obj.Song);
		$('.maxPlayer-song-singer').text(obj.name);

	}
	// 添加到播放列表
	function Music_playadd(obj) {
		// 判断是否存在
		for (let i in Music_play) {
			if (Music_play[i].id == obj.id) {
				return;
			}
		}
		Music_play.push(obj);
		// console.log(Music_play)
		//将数据缓存在浏览器的本地存储 localStorage
		//JSON.stringify(data);把对象转为字符串
		localStorage.setItem('Music_playlis_storage', JSON.stringify(Music_play));
	}

	// 根据歌曲的id获取歌词
	function audioLyricsget(id) {
		luckyit.json(agent + Music_Lyrics,{id}).then(obj => {
			if (obj.lrc && obj.lrc.lyric != undefined) {
				
				audioLyricsshow(obj.lrc.lyric);
			}
		})
		// $.ajax({
		// 	type: 'GET',
		// 	// 代理服务器 + 根据歌曲的id获取歌词
		// 	url: agent + Music_Lyrics,
		// 	data: {
		// 		id: id,
		// 	},
		// 	success: function(obj) {
		// 		if (obj.lrc && obj.lrc.lyric != undefined) {
					
		// 			audioLyricsshow(obj.lrc.lyric);
		// 		}

		// 	},
		// 	error: function(err) {
		// 		//请求失败
		// 		console.log('err ==> ', err);
		// 	}
		// })
	}

	// 处理歌词
	function audioLyricsshow(data) {
		Lyriclise.html('');
		let lrc = data.split(/[\n\r]/);
		//去除最后一个空值
		lrc.splice(-1, 1);
		// console.log(lrc);
		let obj = {};
		for (let i = 0; i < lrc.length; i++) {

			let lrcLyrics = lrc[i].split(/\]/);
			let lrcItem = lrcLyrics[0].substr(1).split(/\./);

			let second = lrcItem[0];
			let tims = lrcItem[1];
			// console.log(second)
			let Lyrics = lrcLyrics[1];
			lrcLyrics = lrcLyrics[0].substr(1);
			obj[second] = {
				lrcLyrics,
				tims,
				Lyrics,
				i,
			}

			var ps = $('<p data="' + second + ':' + tims + '"></p>');
			ps.text(Lyrics);
			if (i == 0) {
				ps.addClass('active');
			}
			Lyriclise.append(ps);

		}
		Lyriclist = obj;
		// console.log(obj);

	}

	// 歌词移动
	function audioLyricsmove(time) {

		if (Lyriclist != null && Lyriclist[time] != undefined && Lyriclist[time].Lyrics.trim() != '') {
			let pse = Lyriclise.find('p').eq(Lyriclist[time].i);
			// console.log(pse[0])

			Lyriclise.stop().animate({
				top: -pse.position().top + $('.Lyric').height() / 2 - pse.height() / 2,
			}, 300, function() {
				pse.addClass('active').siblings().removeClass('active');
			})

		}

	}

	// 接收子页面参数
	window.addEventListener('message', function(result) {
		// 审批返回数据，页面调条数
		var data = JSON.parse(result.data);
		// 弹出框-展示子页面传过来的参数
		// console.log(data);

		if (data.id != null) {
			// console.log(audioId,data.id)
			if (audioId == data.id) {
				// 调用暂停/播放按钮事件
				audioplay.trigger('click');
				return;
			}
			Loading.show(transition * trtime);
			// 获取音乐
			audioget(data.id);
			// 获取歌词
			audioLyricsget(data.id);
			// 播放器显示（小）
			audioshow(data);
			// 播放器显示（大）
			audioshowmax(data);
		}

		// 关闭窗口
		if (!data.but) {
			var iframe = $('#iframe');
			
			(function($this){
				 iframe.animate({
					left: data.left,
					top: data.top,
					width: data.width,
					height: data.height,
					opacity: data.opacity,
					borderRadius: data.borderRadius,
				}, transition * trtime, function() {
					iframe.remove();
					$this.animate({
						opacity: 1
					}, transition * trtime);
					$('body').css("overflow-y", "auto");
				})
			})(audio_this)

		}
	})

	$('.minPlayer').on('click', function() {
		maxPlayer.animate({
			top: 0,
		}, transition * trtime)
		$('body').css("overflow-y", "hidden");
	})

	$('.Return').on('click', function() {

		maxPlayer.animate({
			top: '100%',
		}, transition * trtime)
		$('body').css("overflow-y", "auto");
	})

	$('.download').on('click', function() {
		if (!audioId) {
			return;
		}
		console.log('下载');
		// 下载服务器的MP3文件
		const downloadMp3 = (filePath) => {
			fetch(filePath).then(res => res.blob()).then(blob => {
				const a = document.createElement('a');
				document.body.appendChild(a)
				a.style.display = 'none'
				// 使用获取到的blob对象创建的url
				const url = window.URL.createObjectURL(blob);
				a.href = url;
				// 指定下载的文件名
				let name = $('.maxPlayer-song-name').text() + '-' + $('.maxPlayer-song-singer').text();
				a.download = name + '.mp3';
				a.click();
				document.body.removeChild(a)
				// 移除blob对象的url
				window.URL.revokeObjectURL(url);
			});
		}
		downloadMp3(audio.prop('src'));
	})



	// touchstart
	$('.axis').on('touchstart', function(e) {
		// console.log('鼠标按下');
		but_music = false;
		var _this = $(this);
		var width = _this.width() - slider.outerWidth();

		//touchmove 手指移动时
		$('.axis').on('touchmove', function(event) {
			let x = event.changedTouches[0].clientX - slider.outerWidth() / 2;
			x = x < 0 ? 0 : x > width ? width : x;
			progres(x);

			let time = x / width * duration;
			time = addZero(time / 60) + ':' + addZero(time % 60);
			$('.time1').text(time);
			audioLyricsmove(time);
		})
		let x0 = e.changedTouches[0].pageX - slider.outerWidth() / 2;
		x0 = x0 < 0 ? 0 : x0 > width ? width : x0;
		progres(x0);

		// 清除掉文字选中效果
		window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();

		//mouseup
		$(document).on('touchend', function() {
			$('.axis').off('touchmove');
			$(document).off('touchend');
			// console.log('放开鼠标');
			var Calculation = slider.position().left / ($('.axis').width() - slider.outerWidth()) * duration;
			// console.log(Calculation);
			audio[0].currentTime = Calculation;
			but_music = true;
		})
	})

	// 音乐进度条
	function progres(left) {
		slider.css({
			left: left
		})

		progress.css({
			width: left + slider.outerWidth() / 2
		})
	}

	// 播放列表按钮
	$('.History').on('click', function(e) {
		e.stopPropagation();
		$('.Playlist').css({
			display: 'block',
		}).find('.Record').animate({
			height: '70%'
		}, transition * trtime)
		$('body').css("overflow-y", "hidden");
		Playlistshow();
	})

	function Playlistshow() {
		let ul = $('.Record>ul');
		ul.html('');
		for (let i in Music_play) {

			let str =
				`<div class="ct_left fl clearfix">
					<div class="ct_img fl"><img class="img-auto" src="${Music_play[i].imgurl}" ></div>
					<div class="information fl">
						<div class="History-singer one-text">${Music_play[i].Song}</div>
							<div class="name one-text">${Music_play[i].name}</div>
					</div>
				</div>
				<div class="ct_right fr clearfix">
						<div class="date fl">${Music_play[i].date}</div>
						<div class="Trash fr"><img class="img-auto" src="./icons/Trash.png" ></div>
				</div>`;

			let lis = $('<li class="clearfix"></li>');
			lis.html(str);
			lis.data('id', Music_play[i].id);
			if (Music_play[i].id == audioId) {
				lis.addClass('active');
			}
			ul.append(lis);
			
			lis.on('click',function(){
				
				let obj = Music_play[$(this).index()];
				$(this).addClass('active').siblings().removeClass('active');
				if (audioId == obj.id) {
					// 调用暂停/播放按钮事件
					audioplay.trigger('click');
					return;
				}
				
				audioget(obj.id);
				// 获取歌词
				audioLyricsget(obj.id);
				
				audioshow(obj);
				audioshowmax(obj);
				
				
			})
			lis.find('.Trash').on('click',function(e){
				e.stopPropagation();
				let _this = $(this).parents('li');
				let index = _this.index();
				Music_play.splice(index,1);
				_this.remove();
				// console.log(Music_play);
				//JSON.stringify(data);把对象转为字符串
				localStorage.setItem('Music_playlis_storage', JSON.stringify(Music_play));
			})
		}
		
		
		

	}
	
	// 清空播放列表按钮
	$('.allTrash').on('click',function(e){
		e.stopPropagation();
		if(confirm('你是否确认清空播放列表!')){
			console.log('清空列表');
			Music_play = [];
			$('.Record>ul').html('');
			//JSON.stringify(data);把对象转为字符串
			localStorage.setItem('Music_playlis_storage', JSON.stringify(Music_play));
		}
		
	})
	
	// 隐藏播放列表
	$('.Playlist').on('click', function() {
		let _this = $(this);
		_this.find('.Record').animate({
			height: '0'
		}, transition * trtime, function() {
			_this.css({
				display: 'none',
			})
		})
		$('body').css("overflow-y", "auto");
	})

	// 拦截播放隐藏列表
	$('.Record').on('click', function(e) {
		e.stopPropagation();
	})
	
	
	// 搜索框
	let seek = $('.Seek');
	
	seek.on('focus',function(){
		if(seek.val().trim() != ''){
			$('.search-result').slideDown(transition * trtime);
		}
	})
	
	
	seek.on('blur',function(){
		
		$('.search-result').slideUp(transition * trtime + 100);
		
	})
	
	// 搜索框 -- 节流 -- 1000毫秒
	antiShake(seek,'input',function(){
		
		if(seek.val().trim() != ''){
			seekget(seek.val())
		}else{
			$('.search-result').slideUp(transition * trtime);
		}
		
		
	},1000)
	
	function seekget(valtext){
		luckyit.json(agent + search_sousuo, {keywords: valtext}).then(obj => {
			// console.log(obj.result.songs);
			seekshow(obj.result.songs);
			$('.search-result').slideDown(transition * trtime);
		})
		// $.ajax({
		// 	type: 'GET',
		// 	url: agent + search_sousuo,
		// 	data: {
		// 		keywords: valtext,
		// 	},
		// 	success: function(obj) {
		// 		// console.log(obj.result.songs);
		// 		seekshow(obj.result.songs);
		// 		$('.search-result').slideDown(transition * trtime);
		// 	},
		// 	error: function(err) {
		// 		//请求失败
		// 		console.log('err ==> ', err);
		// 	}
		// })
	}
	
	function seekshow(data){
		let ul = $('.search-result>ul');
		ul.html('');
		
		for(let i in data){
			let lis = $('<li class="clearfix"></li>');
			lis.data('id',data[i].id);
			let geshou = "";
			for(let j = 0; j < data[i].artists.length; j++){
				if(j == 0){
					geshou += data[i].artists[j].name;
				}else{
					geshou += '/' + data[i].artists[j].name;
				}
			}
			
			let str = `
				<div class="result_ge fl one-text">${data[i].name}</div>
				<div class="result_name fl one-text">${geshou}</div>
				`
			lis.html(str);
			ul.append(lis);
			
			lis.on('click',function(e){
				// console.log(this)
				e.stopPropagation();
				audioId = $(this).data('id');
				// 获取歌曲详情
				audioimgget(audioId);
				
			})
		}
	}
	
	
	function audioimgget(ids){
		luckyit.json(agent + Song_details, {ids}).then(obj => {
			obj = obj.songs[0];
			let geshou = "";
			for(let j = 0; j < obj.ar.length; j++){
				if(j == 0){
					geshou += obj.ar[j].name;
				}else{
					geshou += '/' + obj.ar[j].name;
				}
			}
			
			let data = {
				id: obj.id,
				name: obj.name,
				imgurl: obj.al.picUrl,
				Song: geshou,
				date : timeset(obj.dt).dt,
			}
			// console.log(data);
			// 获取音乐
			audioget(data.id);
			// 获取歌词
			audioLyricsget(data.id);
			// 播放器显示（小）
			audioshow(data);
			// 播放器显示（大）
			audioshowmax(data);
			
		})
		// $.ajax({
		// 	type: 'GET',
		// 	// 代理服务器 + 根据id获取歌曲详情
		// 	url: agent + Song_details,
		// 	data: {
		// 		ids,
		// 	},
		// 	success: function(obj) {
		// 		// console.log(obj.songs[0])
		// 		// console.log(obj.data[0].url);
		// 		obj = obj.songs[0];
		// 		let geshou = "";
		// 		for(let j = 0; j < obj.ar.length; j++){
		// 			if(j == 0){
		// 				geshou += obj.ar[j].name;
		// 			}else{
		// 				geshou += '/' + obj.ar[j].name;
		// 			}
		// 		}
				
		// 		let data = {
		// 			id: obj.id,
		// 			name: obj.name,
		// 			imgurl: obj.al.picUrl,
		// 			Song: geshou,
		// 			date : timeset(obj.dt).dt,
		// 		}
		// 		// console.log(data);
		// 		// 获取音乐
		// 		audioget(data.id);
		// 		// 获取歌词
		// 		audioLyricsget(data.id);
		// 		// 播放器显示（小）
		// 		audioshow(data);
		// 		// 播放器显示（大）
		// 		audioshowmax(data);
				
		// 	},
		// 	error: function(err) {
		// 		//请求失败
		// 		console.log('err ==> ', err);
		// 	}
		// })
	}

})
