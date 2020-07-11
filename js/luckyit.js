const luckyit = {}

luckyit.json = function(src, obj){
	return new Promise((resolve, reject) => {
		const el = document.createElement('iframe')
		obj ? src += '?' + Object.keys(obj).map(key => key + '=' + obj[key]) .join('&;') : '',
		el.src = src
		el.style.display = 'none'
		window.document.body.appendChild(el)
		el.onload = function() {
			const body = el.contentWindow.document.body
			const data = body.children[0].textContent
			try{
				resolve(JSON.parse(data))
			}catch(e){
				//TODO handle the exception
				resolve(data)
			}
			el.remove()
		}
	})
}


// module.export = luckyit
// export default luckyit