require([
	'lang_module',
	'lib/ethers',
	'eth-api',
	'view'

].map(s => `/js/${s}.js`) ).then(init);

var domPrice = $div();



function init() {
	View.instance();
    View.detectPage();

}
var _updateTableHistory;
function PageHome(){

	var _addresHistory = $div();
	var _tableLastTransactions = $div();

	/*
		ethApi.history("0x1f88f786928cdac22042cba3ff8b4e1b33f03e64", function(data){
			console.log('data: ', data);
			_tableLastTransactions.cls().add($$(data.map(a=>({from:a.from}))));
		},function(err){
			_tableLastTransactions.cls().add($$({h1_: 'error address'}))
		})
	*/
	var ethPrice = 1,
		CONTRACT_CREATED_BLOCK = 5457166;
	domPrice.value = `ETH Price: . . . / 1 usd`;

	/*
		TEST PROVIDER IS ROPSTEN
	*/
	ethApi.setProvider('ropstan');

	setInterval(function(){
		ethApi.getPrice(function(e){
			domPrice.value = `ETH Price: ${e} / 1 usd`;
			ethPrice = e;
			//updateTableHistory('0x1f88f786928CDac22042cBA3fF8b4e1B33f03E64')
		});
	}, 2000);
	_updateTableHistory = updateTableHistory;
    setTimeout(() => {
    	updateTableHistory('0x1f88f786928CDac22042cBA3fF8b4e1B33f03E64');
	}, 0);
	function updateTableHistory(addr){
		_tableLastTransactions.cls().add($$(['Loading . . . ']));

		//var addr = "0x1f88f786928cdac22042cba3ff8b4e1b33f03e64";
		if(!_addresHistory.addrArray) _addresHistory.addrArray = [];
		if(_addresHistory.addrArray.indexOf(addr) === -1) {
			_addresHistory.addrArray.push(addr);
			_addresHistory.add($$([$button(addr).eclick(e=>updateTableHistory(addr))]));
		}
		ethApi.history(addr, function(h){

			var arr1 = Array.from(h);
			var arr2 = [];

			// view.log('show wallet history', addr);
			
			console.log('transactions', h);
			
			var _maxBlock = h.map(a=>a.blockNumber).reduce((a, b)=> Math.max(a,b));
			var _minBlock = h.map(a=>a.blockNumber).reduce((a, b)=> Math.min(a,b));

			ethApi.provider.getLogs({
				fromBlock: _minBlock,
				toBlock: _maxBlock,
				address: addr,
			}).then(function(a) {

				arr2 = Array.from(a);
				
				console.log('==================== compared Array ===========')
				var _arrFullData = arr1.map(a => Object.assign({}, a, arr2.filter(b => a.hash == b.transactionHash)[0]));
				var _arrCource = _arrFullData.map(data => ({
					from: data.from,
					to: data.to,
					type: data.data.length != 130? ' - ': ethers.utils.toUtf8String('0x' + data.data.split('0x')[1].slice(64).split('0000')[0]),
					tokens_value: data.data.length != 130? 0: ethers.utils.bigNumberify('0x' + data.data.split('0x')[1].slice(0, 64)).toNumber(),
					eth_value: data.value.toString() * 1,
					date: (new Date(data.timestamp*1000)).toLocaleString()
				})).map(a => {
					a.price = a.tokens_value / a.eth_value;
					return a;
				});

				var _arrClearPrice = _arrCource.map(a=>a.price)
					.filter((a, k)=> !isNaN(a) && a != Infinity && a != 0)
					.map(a=>({
						sell: (a == 1 ? 0.95 : a).toFixed(4), 
						buy: ((a == 1 ? 0.95 : a) / 0.95).toFixed(4)
					}))
					.sort((a,b)=> a.buy < b.buy);
				console.log('fullData: ', _arrFullData);
				console.log('Filter data: ', _arrCource);
				console.log('Cource: ', _arrClearPrice);

				// view.page.loading.show(false);

				_tableLastTransactions.cls().add($$(h.filter((a, k) => k <= 100).map(a => ({ item:{
					tx: a.transactionIndex,
					fromto: [
						['TX: ', a.hash],
						$div('from: ' + a.from, {
							style: a.from.toLowerCase() === addr.toLowerCase() ? '': 'color: #f00;cursor: pointer;',
							class: 'row-lonk'
						}).eclick(e => {
								if(a.from.toLowerCase() === addr.toLowerCase()) return;
								console.log(a.from);
								updateTableHistory(a.from)
							}),
							{'span_row-arrow':''},
							a.to == null? $span('[Contract create]'): $div('to: ' + a.to)
							.attr('style',  a.to.toLowerCase() === addr.toLowerCase() ? '': 'color: #f00;cursor: pointer;')
							.addClass('row-lonk')
							.events({onclick: function(e){
								if(a.to.toLowerCase() === addr.toLowerCase()) return;
								updateTableHistory(a.to)
							}})
					],
					value: [a.value === 0? '-' :[
						[ethers.utils.formatEther(a.value) + " ETH"],
						{strong_: (ethPrice * ethers.utils.formatEther(a.value)).toLocaleString() + " USD" }
						
					]],
					//data: a.data,
					status: a.from.toLowerCase() === addr.toLowerCase()? $span('OUT'): $span('IN'),
					time: (new Date(a.timestamp*1000)).toLocaleString(),
					'': $button('details').events({onclick: function(evt){
						alertWindow(_('Details'), JSON.stringify(a))
					}})
				}}))).addClass('astable'));

				// view.page.add($table.from(_arrCource))
				
				// view.page.add($table.from( _arrClearPrice ))
				/*
				
				*/
			});
		}, function (e) {
			alert('alert error', e);
			console.log('alert error', e);
		})
	}
	return $$([
		{h1_:_('Title')},
		[_('next page'), $a(_('link'),{href: '#sigin'} )],
		_addresHistory,
		$hr(),
		_tableLastTransactions
	]);
}
function PageSign(){
	var _details = $div();
	var _inputPK = $input({
		value: 'B9927CCB3314E01C7460029F0C14B7FC43137DF5D129CF0D626B0958D91B0A45',
		id: 'inpPK',

	});

	return $$([
		{h1_: [_('Sign In Page')]},
		[
			//{input__inpPK:'Entar private key'},
            _inputPK,
			$button(_('Sign In')).events({onclick: e=> {
				//alertWindow(null, inpPK+ 'ggg')
				_details.cls().add($$({h3_: 'weiting ...'}))
				getBalance('0x' + inpPK, d => {
					_details.cls().add($$({
						address:['address: ', d.addr],
						ballance:['ballance: ', d.balance, " ETH"],
						txCount:['txCount: ', d.transactionCount],
						intarface: [
							{button_:'send money'},
							{button_:'make deposit DT5'},
							{button_:'make deposit DT10'},
							{button_:'make deposit DT15'},
							$button('my transaction history').eclick(e => _updateTableHistory(d.addr)),
						]
					}))
					
				})
			}}),
			$hr(),
			_details
		]
		
	]);
}
function alertWindow(title, text, buttons){
	var wind_ = window.wind_ = $$({
		hiddenLayer: {
			windowslayer:{
				title: title || _('Alert'),
				contant: text || "",
				buttons: buttons || $button(_('close')).events({
					onclick: e => cloaseWindow()
				})
			}
		}
	});
	$('body').add(wind_)
}
function cloaseWindow(){
	function hidden(){
		console.log(`$('body .hiddenLayer').remove()`);
		$('body .hiddenLayer').remove()
	}
	var el = $('body .hiddenLayer');

	// el.addEventListener("animationend", hidden, false);

	el.addEventListener("animationend", hidden, false);
	el.addEventListener("animationend", hidden, false);
	el.addEventListener("webkitAnimationEnd", hidden, false);
	el.addEventListener("oanimationend", hidden, false);
	el.addEventListener("MSAnimationEnd", hidden, false);
	

	el.addClass('animout');
}


////////////////////////////////////////
function getBalance(privateKey, fn){
	//var privateKey = '0x0123456789012345678901234567890123456789012345678901234567890123';
	var wallet = new ethers.Wallet(privateKey);
	wallet.provider = ethApi.provider;// ethers.providers.getDefaultProvider();
	var balancePromise = wallet.getBalance();
	balancePromise.then(function(balance) {
	    console.log(ethers.utils.formatEther(balance));
		var transactionCountPromise = wallet.getTransactionCount();
		transactionCountPromise.then(function(transactionCount) {
		    console.log(transactionCount);
		    if(fn) fn({
		    	addr: wallet.address,
		    	balance: ethers.utils.formatEther(balance),
		    	transactionCount: transactionCount

		    })
		});
	
	});
}
function sendTransaction(privateKey, toAddress, valueEth , fn){
	//var ethers = require('ethers');
	var Wallet = ethers.Wallet;
	var utils = ethers.utils;
	

	// var privateKey = "0x0123456789012345678901234567890123456789012345678901234567890123";
	var wallet = new Wallet(privateKey);

	console.log('Address: ' + wallet.address);
	// "Address: 0x14791697260E4c9A71f18484C9f997B308e59325".

	var transaction = {
	    nonce: 0,
	    gasLimit: 21000,
	    gasPrice: utils.bigNumberify("20000000000"),

	    to: toAddress, // "0x88a5C2d9919e46F883EB62F7b8Dd9d0CC45bc290",

	    value: utils.parseEther(valueEth + '' /* "1.0" */),
	    data: "0x",

	    // This ensures the transaction cannot be replayed on different networks
	    chainId: ethApi.provider.chainId

	};

	var signedTransaction = wallet.sign(transaction);

	console.log(signedTransaction);
	// "0xf86c808504a817c8008252089488a5c2d9919e46f883eb62f7b8dd9d0cc45bc2" +
	//   "90880de0b6b3a7640000801ca0d7b10eee694f7fd9acaa0baf51e91da5c3d324" +
	//   "f67ad827fbe4410a32967cbc32a06ffb0b4ac0855f146ff82bef010f6f2729b4" +
	//   "24c57b3be967e2074220fca13e79"

	// This can now be sent to the Ethereum network
	
	ethApi.provider.sendTransaction(signedTransaction).then(function(hash) {
	    console.log('Hash: ' + hash);
	    // Hash:
	});
}

