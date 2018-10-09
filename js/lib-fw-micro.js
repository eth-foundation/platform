function $ ( s )  {
	return document.querySelector(s);
}
function _$ ( s )  {
	return document.querySelectorAll(s);
}
function $$(n, isArray){
	function d(a){
		if(a instanceof Array){
			return "Array";
		}
		return typeof a;
	}
	if(n instanceof Node) return n;

	if(d(n) == 'Array'){
		n = n.filter(a=>a!=null);
		var out = isArray? []: $div();
		
		for (var i = 0; i < n.length; i++) {
			if(isArray){
				out.push($$(n[i]))
			}else{
				out.add($$(n[i]))
			}
		}
		return out;
	}
	if(d(n) == 'object'){
		var out = [];
		for(var item in n) {
			
			if(item.indexOf('_') != -1){
				var ar = item.split('_'),
					obj = { tag: ar[0], className: ar[1], id: ar[2] },
					fn_tag = (obj.tag == "")? $div: eval('$' + obj.tag), el, arrEvents = {};

				if(d(n[item]) == 'object'){ // search EVENTS
					console.log(item, n[item])
					for(var evtItem in n[item]) {
						if(fn_tag()[evtItem] === null && typeof n[item][evtItem] === 'function'){
							arrEvents[evtItem] = n[item][evtItem];
							delete n[item][evtItem];
						}
					}
					console.log('after: ', item, n[item])
				}

				if(obj.tag == 'input'){
					el = fn_tag().attr('placeholder', n[item]);
					if(ar[3]){
						el.attr('type', ar[3])
					}
				}else if (obj.tag == 'img') {
					el = fn_tag().attr('src', n[item]);
					
				}else{
					if(obj.tag == 'select'){
						var _c = $$(n[item], true);
						if(d(_c) == "Array"){
							try{
								el = fn_tag(_c.map(a=>a[0]));
							}catch(err){
								
								el = fn_tag(_c);
							}
						}else{
							el = fn_tag(_c);
						}
					}else{
						el = fn_tag($$(n[item], true));
					}
				}
				if(obj.id){
					el.attr(obj.tag == 'label'? 'for': 'id', obj.id);
				}
				if(obj.className) {
					el.addClass( obj.className );
				}       
				if(Object.keys(arrEvents).length > 0){
					el.events(arrEvents);
				}

				out.push(el)
				
				
			//	out.push(el);
			}else{
				// TODO: use template if it is was define
				try {
					// statements
					out.push($$[item] != null && item != 'name'? $$[item](n[item]) : $div($$(n[item])).addClass(item));
				} catch(e) {
					// statements
					console.log(item, "\n", $$[item], "\n", n[item], "\n", e);
				}
			}
		}

		return out.length == 1? out[0]: out;
	}
	return n+'';
}
$$.defineTemplate = function(nametamplate, fnConstructor) {
	$$[nametamplate] = fnConstructor;
}
var StorageRemout = window.location.href.indexOf("file:///") == -1? '/storage/': 'http://www.g6t.cz/storage/';

Object.defineProperty(this, '_storage', {
	get(){
		return $.loadjson(StorageRemout).data;
	},
	set(val){
		$.loadjson(StorageRemout, val)
	}
})
$.storage = function (obj, _var, target){
	function f(param, obj){
		return $.loadjson(StorageRemout+param, obj);
	}
	var __target = target;

	var add = function(data){
		var _history = f(__target).data;
		_history.push(data);
		f(__target, _history);
	}

	Object.defineProperty(obj, _var, {
		get(){
			return f(__target).data;
		},
		set(val){
			add(val);
		},
		clear: function(){
			return f(__target, []);
		}
	})
}
$.__loadAndСache = [];
$.loadAndСache = function(src, obj){
	if(!$.__loadAndСache[src.hash()]) 
		$.__loadAndСache[src.hash()] = $.loadjson(src, obj);
	return $.__loadAndСache[src.hash()];
}
$.loadjson = function(src, obj) {

	if(!$('head meta[http-equiv="Access-Control-Allow-Origin"]') ){
		$('head').add($meta({'http-equiv': 'Access-Control-Allow-Origin', content: '*'}));
	}

	var isPost = obj != null;
	var xhr = new XMLHttpRequest();
	if(isPost) { /* POST */
		console.log("== POST ==")
		xhr.open('POST', src, false);
		// xhr.withCredentials = true;
		xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
		xhr.send(JSON.stringify(obj) );
	}else { /* GET */
		console.log("== GET ==")
		// xhr.withCredentials = true;
		xhr.open('GET', src, false);
		xhr.send();


	}
	// console.log("xhr.responseText = ", xhr.responseText);
	try {
		return {
			status: xhr.status,
			data: JSON.parse(xhr.responseText) 
		}
		
	} catch (e) {
		console.error(e);
		return {
			status: xhr.status,
			data: xhr.responseText
		}
	}
}
$.render = function(dom){
	document.body.add(dom);
};
$.write = function(_selector, _dom) {
	if(_dom == null) {
		window.document.write(_selector.outerHTML);
		return;
	}
	setTimeout(function(){
		$(_selector).cls().add(_dom);
	}, 0);
};

(function(n){
	n.remove = function (){
		this.parentNode.removeChild(this);
	};
	n.replaceDOM = function ( DOMelementTo ){
		this.parentNode.insertBefore(DOMelementTo, this);
		this.parentNode.removeChild(this);
	};
	n.cls = function (child) {
		this.innerHTML = '';
		return this;
	};
	n.add = function (child) {
		if (child instanceof Node) {
			this.appendChild(child);
			this[this.children.length] = child;
		}else{
			if(typeof child === 'string' || typeof child === 'number') {
				this.appendChild(document.createTextNode(child+''));
				return;
			}
			for (var item in child) {
				if(child[item] instanceof Node){
					this[this.children.length] = child[item]
					this.appendChild(child[item]);
				}else{
					this.appendChild(document.createTextNode(child[item]));
				}
			}
		}

		return this;
	};
	
	//n.parent = n.parentElement;
	Object.defineProperty(n, 'parent', {
		get: function () {
			return this.parentElement;
		},
		set: function (val) {
			throw 'ERROR';
		}
	})
	/*n.parent = function () {
		return this.parentElement;
	}*/

	n.events = function () {
		var arr = Array.from(arguments);
		for (var i = 0; i < arr.length; i++) {
			for(var item in arr[i]){
				this[item] = arr[i][item];
			}
		}
		return this;
	};
	n.eclick = function(fn){
		return this.events({onclick: fn});
	};
	n.addClass = function (className) {
		if(className && className != '') {
			var _list = className.split(' ');
			for (var i = 0; i < _list.length; i++) {
				this.classList.add(_list[i]);
			}
		}
		return this;
	};
	n.removeClass = function (className) {
		this.classList.remove(className);
		return this;
	};
	n.attr = function (attrName, value) {
		this.setAttribute(attrName, value);
		return this;
	}
	n.model = function(fn){
		var _f = function(){
			fn(this.value);
			//__el.value = pass.value;
		};
		this.events({
			onchange: _f,
			onkeydown: _f,
			onkeyup: _f
		});
		return this;
	}
	Object.defineProperty(n, 'value', {
		get(){
			return this.text();
		},
		set (val) {
			this.text(val);
		}
	});
	n.text = function (str) {
		if (this.tagName === 'INPUT') {
			if (str == null) {
				return this.value;
			} else {
				this.value = str;
				return this;
			}
		}else{
			if (str == null) {
				return this.innerHTML;
			} else {
				this.innerHTML = str;
				return this;
			}
		}
	};
	// n.__css
	n.css = function(val) {
		this.attr('style', JSON.stringify(val).replace(/[\}\{\"]/g, '').replace(/[,]/g, '; '))
		return this;
	}
	/*
	Object.defineProperty(n, 'css', {
		get() {
			return this._css;
		},
		set(val){
			this._css = val;
			this.attr('style', JSON.stringify(val).replace(/[\}\{\"]/g, '').replace(/[,]/g, '; '))
		}
	})
	*/
	n.toString = function() {
		return this.value;
	}
	/*n.id = function (id) {
		return this.attr('id', id);
	}*/
})(Node.prototype);

(function(){
	function div (config, tag, attr) {
		if (typeof config === 'string' || typeof config === 'number') {
			return div([document.createTextNode(config+'')], tag, attr);
		}

		var el = document.createElement(tag || 'div');

		if (attr && typeof attr === 'object') {
			for(var atr in attr){
				el.setAttribute(atr, attr[atr]);
			}
		}
		if (config instanceof Node) {
			el.appendChild(config)
		}else{
			for (var item in config) {
				if(config[item] instanceof Node){
					el[item] = config[item];
					el.appendChild(config[item])
				}
			}
		}
		return el;
	}
	var arrTags = ("a abbr acronym address applet area article aside audio b base" +
		" basefont bdi bdo big blockquote br button canvas caption center cite" +
		" code col colgroup command datalist dd del details dfn dir div dl dt em embed" +
		" fieldset figcaption figure font footer form frame frameset h1 h2 h3 h4 h5 h6" +
		" head header hgroup hr html i iframe img input ins kbd keygen label legend li" +
		" link map mark menu meta meter nav noframes noscript object ol optgroup option" +
		" output p param pre progress q rp rt ruby s samp script section select small source" +
		" span strike strong style sub summary sup table tbody td textarea tfoot th" +
		" thead time title tr track tt u ul var video wbr").split(' ');
	for (var i = 0; i < arrTags.length; i++) {
		switch (arrTags[i]) {
			case "meta":
			case "link":
			case "script":
			case "img":
			case "iframe":
			case "input":
				window["$" + arrTags[i]] = (function(tag){
					return function(attr) {
						return div(null, tag, attr);
					}
				})(arrTags[i]);

				// window["$" + arrTags[i]] = (tag => attr => div(null, tag, attr))(arrTags[i]);

				break;
			case "a":
				window["$" + arrTags[i]] = function(paramA, paramB) {
					var _a = document.createElement('a');
					//_a.innerHTML = paramA instanceof Node? paramA.outerHTML: paramA +"";
					if(paramA instanceof Node){
						_a.appendChild(paramA)
					}else {
						_a.innerHTML = paramA + "";
					}
					if(paramB){
						for(var item in paramB){
							_a[item] = paramB[item];
						}
					}
					return _a;
				}

				break;
			case "table":
				window["$" + arrTags[i]] = function(paramA, paramB) {
					if(!paramA) return $(null, 'table');
					var d = div(null, 'table'), tbody, tr;
					
					if(paramA.caption) d.add($caption(paramA.caption))

					if(paramA.head) {
						d.add($thead(tr = $tr()));
						for (var j = 0; j < paramA.head.length; j++) {
							tr.add($th(paramA.head[j]))	
						}
					}

					if(paramA.foot) {

						d.add($tfoot(tr = $tr()));
						for (var j = 0; j < paramA.foot.length; j++) {
							tr.add($td(paramA.foot[j]))	
						}
					}
					
					if(paramB) paramA = paramB;
					
					d.add(tbody = $tbody());
					
					for (var i = 0; i < paramA.length; i++) {
						d[i] = $tr();
						tbody.add(d[i]);
						for (var j = 0; j < paramA[i].length; j++) {
							d[i][j] = $td(paramA[i][j]);
							d[i].add(d[i][j]);
						}
					}



					return d;
				}
				break;
			default:
				window["$" + arrTags[i]] = (function(tag){
					return function(content, attr) {
						return div(content, tag, attr);
					}
				})(arrTags[i])
				break;
		}
	}
	$table.from = function(arr) {
		return $table({
			head: Object.keys(arr[0])
		}, 
		arr.map(function(a) {
			return Object.values(a);
		}));
	}
})();
(function(_export){
	function __load (link, fn) {
		type = link.split(/[\.\/]/g)[link.split(/[\.\/]/g).length -1].split(/[#?]{1}/)[0];
		switch (type) {
			case "css":
				$('head').add($link({ href: link, rel:"stylesheet" }));
				fn(link)
				break;
			case "js":
				if(!!$('script[src="' + link + '"]')){
					$('script[src="' + link + '"]').addEventListener('load', function(e){
						fn(link);
					})
					return;
				}
				$('head').add($script({
					type: "text/javascript", src: link, async: false
				}).events({ onload: ( function(l){
					return function(e) { 
						return fn(l) 
					}
				})(link) }));
				break;
			default: throw new Error(link);
		}
	}
	
	function PPromise() {};

	function require() {
		console.log("++++++++++++++++++++++++++++++");
		var _arr = (arguments[0] instanceof Array)? arguments[0]: Array.from(arguments);
		console.log(_arr);
		PPromise.prototype.then = function(fn){
			if(_arr.length) {
				__load(_arr.shift(), function(result) {
					//console.log('loaded:', result);
					require.apply(this, _arr).then(fn);
				})	
			} else {
				//console.log('--done');
				fn();
			}
			return this;
		}
		return new PPromise();
	}

	_export.require = require;
})(window)
function toggleFullScreen() {
	(function(e,d){
		if (!d.fullscreenElement &&    // alternative standard method
			!d.mozFullScreenElement && !d.webkitFullscreenElement) {	// current working methods
			if (e.requestFullscreen) {
				e.requestFullscreen();
			} else if (e.mozRequestFullScreen) {
				e.mozRequestFullScreen();
			} else if (e.webkitRequestFullscreen) {
				e.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
			}
		} else {
			return;
			if (d.cancelFullScreen) {
				d.cancelFullScreen();
			} else if (d.mozCancelFullScreen) {
				d.mozCancelFullScreen();
			} else if (d.webkitCancelFullScreen) {
				d.webkitCancelFullScreen();
			}
		}
	})(document.documentElement, document)
}
String.prototype.hash = function(lenHash) {
	var str = this;
	lenHash = lenHash || 32;
	str = str || "";
	var ar = str.split('').map(function(a) {
		return a.charCodeAt(0)
	}), s2alength = ar.length || 1, i = ar.length ? ar.reduce(function(p, c) {
		return p + c
	}) : 1, s = "", A, B, k = 0, tan = Math.tan;
	while (s.length < lenHash) {
		A = ar[k++ % s2alength] || 0.5;
		B = ar[k++ % s2alength ^ lenHash] || 1.5 ^ lenHash;
		i = i + (A ^ B) % lenHash;
		// s += tan(i*B/A).toString(16).split('.')[1];
		s += tan(i * B / A).toString(16).split('.')[1].slice(0, 10);
	}
	return s.slice(0, lenHash);
}
Object.defineProperty(Object.prototype, 'setProperty',{
	get(){
		return function(name, config){
			Object.defineProperty(this, name, config);
		}
	},
	set(v){
		throw 'Error: setProperty can not be owerwrite';
	}
})
Object.defineProperty(Object.prototype, 'reduce', { 
	value: function(fn, obj) {
		for(var item in this){
			fn(this[item], item, this, obj || {});
		}
		return obj || {};
	}, 
	enumerable: false,
	writable: false
});

Object.defineProperty(Object.prototype, 'toUri', { 
	value: function(){
		return this.reduce((a,b,c,d)=>{ d.push(b+'='+a)}, []).join('&');
	}, 
	enumerable: false,
	writable: false
});


/*
Object.prototype.toUri = function(){
	return this.reduce((a,b,c,d)=>{ d.push(b+'='+a)}, []).join('&');
};
*/
var $body = $('body');