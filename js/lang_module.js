/*  MULTILANGUAGE MODULE  */
function TRANSLATE () {}
(function(t){
	var assineDomArray = []
	var lang = $.loadAndСache('lang/lang.json').data;
	t.currentLeng = lang.___index[0];
	/* init lang */
	t.getLangText = function(index) {
		var subindex = index.split(":")[1];
		index = index.split(":")[0];
		if(!lang[index]){
			console.warn(`WARNING: lang[${t.currentLeng}]:{{${index}}} is not define`);
			return index;
		}
		if(lang[index] instanceof Array){
			return lang[index][lang.___index.indexOf(t.currentLeng)] || lang[index][0];
		}else if(lang[index] instanceof Object){
			var _langItem = lang[index][t.currentLeng] || lang[index]['en'] || `{{lang:${index}}}`;
			if(_langItem instanceof Object){
				if(!_langItem.linkToFile){
					throw `lang[${index}][${t.currentLeng}].linkToFile not define`;
				}else {
					var data = $.loadAndСache(_langItem.linkToFile).data;
					var o = data.split(/<lang:([A_Za-z0-9]+)\/>/ig).reduce((a,b,k,ar)=>{
						k % 2 || k < 1? null: a[ar[k-1]] = b;
						return a;
					},{});
					if(Object.keys(o).length == 0) {
						return data;
					}
					console.log('subindex ==> ', subindex || Object.keys(o)[0])
					if(!o[subindex || Object.keys(o)[0]]){
						console.warn(`WARNING: lang[${t.currentLeng}]:{{${index}:${subindex}} is not define`);
					}
					return o[subindex || Object.keys(o)[0]] || `{{lang:${index}:${subindex}}}`;
				
				}
			}else{
				return _langItem;
			}
		}
	};
	window._ = function (index) {
		var d = $span();
		d.langIndex = index;
		d.value = t.getLangText(index);
		assineDomArray.push(d);
		return d;
	};

	for(var _key in lang){
		if(_key === '___index') continue;
		(k => {
			//console.log('lang init:',k);
			Object.defineProperty(window._, k, {
				get(){
					return window._(k)
				}
			})
		})(_key);
	}

	t.setLang = function(strlang) {
		if(t.currentLeng == strlang) return;
		console.log("TRANSLATE.setLang::", strlang)
		if(lang.___index.indexOf(strlang) == -1){
			strlang = lang.___index[0];
		}
		t.currentLeng = strlang;
		assineDomArray.map(d => {
			d.value = t.getLangText(d.langIndex);
			return d;
		})
	}
	//t.setLang(t.currentLeng);
})(TRANSLATE);