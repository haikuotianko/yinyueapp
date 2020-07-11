//监听主线传递过来的消息
onmessage = function(e) {
	// 获取传过来的值
	var data = e.data;
	console.log(data);
	postMessage(data);
}