var configContract = {
	ropstan: {
		DT5: "0x69320C1550bc0cd66200507b0e2515798b39B579",
		DT10: "0x5145247CBB61C124ADFff9d3c8AC06aC27e85674",
		DT15: "0xa8fd2ab2d91574ce9722b5792fad4c165f756e0b",
		FDA: "0x8e96a256227239DBe7cDE6F9C782448E3a4B9817",
	}
}


function _await(fn, isAutoUpdate, delay, formatData) {
	var o = $span('. . .'), _p = d => {
		if(formatData) d = formatData(d);
		if (o[1] && (o[1].innerText == (d.innerText ? d.innerText : d + '') || o[1].innerHTML.replace(/\&nbsp\;/g, ' ') == d.outerHTML)) 
			return;
		/*
		console.log(o[1].innerText.replace(/\&nbsp\;/g, ' ').hash() == d + '')
		console.log('update data1: ',o[1] ? o[1].innerText.hash() : 'wait..')
		console.log('update data2: ', d.hash())
		//*/
		o.cls().add($span(d).addClass('show'));
	}, _f = () => {
		if(typeof fn == 'function') {

			fn(_p);
			
		} else if( fn instanceof Promise) {
			fn.then(_p);
		} else {
			_p(fn+'');
		}
	};
	
	if( isAutoUpdate ) setInterval(_f, delay || 1000);

	_f();

	return o;
}

function go(obj) {
	return Promise.resolve(obj);
} 

require([
	'lang_module',
	'lib/ethers',
	'eth-api',
	'view2',
	'qrcode.min'
].map(s => `js/${s}.js`) ).then(()=>{

	//** 
	//**  INIT ()
	//** 

	ethApi.setProvider("ropstan");
	/*
		function getContractData2(address, fn) {
			var obj = {};
			go()
			.then(e=>ethers.providers.getDefaultProvider('mainnet').getEtherPrice())
			.then(price=>{
				obj.price = price;
				obj.contract = ethApi.getContract(address);
				return obj.contract.name()
			}).then(name=>{
				obj.name = name;
				return obj.contract.symbol();
			}).then(symbol=>{
				obj.symbol = symbol;
				return obj.contract.totalSuply();
			}).then(totalSuply=>{
				obj.totalSuply = totalSuply.toString();
				return obj.contract.decimals();
			}).then(decimals=>{
				obj.decimals = decimals;
				obj.address = obj.contract.address;
				return ethApi.getBalancePromise(obj.address)
			}).then(balanceEth=>{
				obj.balanceEth = balanceEth / Math.pow(10, 18);;
				obj.totalSuply = obj.totalSuply / Math.pow(10, obj.decimals);
				delete obj.contract;
				return obj;
			})
			.then(o => fn($$([o])))
		}

		console.log('_await data: ',_await(fn => getContractData2("0x7D9D4A32005dC67403d582f205696Dc6DfA286dE", fn)))
	*/
	var ___ethPrice___ = 0;
	ethApi.getPrice(data => ___ethPrice___ = data)
	setInterval(i => {
		ethApi.getPrice(data => ___ethPrice___ = data)
	}, 5000)

	function getContractData(network, symbol) {
		var address = configContract[network][symbol];
		
		ethApi.setProvider(network /* 'ropstan' */ );

		var contract = ethApi.getContract(address);
		
		return  {
			name: $h1(_await(contract.name(), null, null, data=>data.replace('FDBB - ', ''))),//'DT5',
			
			contractdt5ethBalance: _await(fn => ethApi.getBalancePromise(address).then(data => fn(data))
				, true, 5500, data => 'Contract balance: ' + ethers.utils.formatEther(data) + ' ETH'),

			tokenValue: _await(fn => contract[!!contract.totalSupply? 'totalSupply': 'totalSuply']().then(data => fn(data)), true, 2800, 
				data => 'Total Supply of Tokens: ' + ((symbol === "FDA"? (data / Math.pow(10, 6)).toFixed(6): (data / Math.pow(10, 15)).toFixed(15)) +' ' + symbol) ), // (ethers.utils.formatEther(data) * 1000).toFixed(3)),

			tokenPrice: !contract.getPrice? '': _await(fn => contract.getPrice().then(data => fn(data)), true, 5000, d => $$([{
				bid: $$([' buy: ', (ethers.utils.formatEther(d.bid) * 1000).toFixed(15), ' ETH / 1000 ' + symbol]).innerText,
				ask: $$(['sell: ', (ethers.utils.formatEther(d.ask) * 1000).toFixed(15), ' ETH / 1000 ' + symbol]).innerText,
				hr_:'',
				p1: $b(['1 ', symbol, ' ~= ',(___ethPrice___ * ethers.utils.formatEther(d.ask)).toFixed(4)," USD"].join('')).css({color: '#aaf', 'font-size': '1.05em'})
			}])),

			address: 'Contract address: '+ address,
			net: network == 'ropstan'? $div('Ropsten Test Network').css({
				    background: '#900',
				    color: '#FF0',
				    margin: '-1.5rem',
				    padding: '0.5rem'
			}): ''
		}
	}
	
	function getUSDFromETH(eth) {
		return (eth * ___ethPrice___).toFixed(2);
	}
	function getTokenBalance (address, tokenType){
		return _await(fn => ethApi.getContract(configContract.ropstan[tokenType]).balanceOf(address).then(data => {
			console.log(address, tokenType, data+'')
			if(tokenType === "FDA"){
				fn(((data + '') / Math.pow(10, 6)))//.toLocaleString())
			} else {
				fn(ethers.utils.formatEther(data) * 1000)
			}
		}), true, 15000)
	}

    var config = {
    	infoPanel: {
    		p_: _('homeInfo')
    	},
    	workSpace: {
			//ethPrice: _await(ethApi.getPrice, true, 10000, data => 'Ether Price: ' + data + ' USD / 1 ETH'),
    		user: {
				getAddress:'',
				form__idEnterPrivatkey: {
					h1_:'Enter your wallet address to see your balance',
					input__selfAddress:'Enter your wallet address to see your balance',
					button_: 'Submit',
					onsubmit: function(evt) {
						evt.preventDefault();
						var addr = selfAddress.value;
						blockPrivateData.cls().add($$([
							[$b('Address: '), addr],
							[$b('Balance: '), _await(fn => ethApi.getBalancePromise(addr).then(data => fn(data)), true, 20000, 
								data => $$([ethers.utils.formatEther(data) + ' ETH, ',$b(getUSDFromETH(ethers.utils.formatEther(data))), $b(" USD")]))],
							[$b('Tokens DT5: '), getTokenBalance(addr, "DT5")],
							[$b('Tokens DT10: '), getTokenBalance(addr, "DT10")],
							[$b('Tokens DT15: '), getTokenBalance(addr, "DT15")],
							[$b('Tokens FDA: '), getTokenBalance(addr, "FDA")],
						]).addClass('my-block-data loadupAnim'))
					}
				},
				p__blockPrivateData:''
			},
    		fddp: {
				contracts: {
					'contract DT5':  getContractData("ropstan", "DT5"),
					'contract DT10': getContractData("ropstan", "DT10"),
					'contract DT15': getContractData("ropstan", "DT15"),
					'contract FDA':  getContractData("ropstan", "FDA"),
				}
			},
			
		}
	}
	View.instance();
    View.instance().addContent($$([config]).addClass('content-page'))
    View.instance().setCourseInHead($$([
    	_await(ethApi.getPrice, true, 10000, data => 'Ether Price: ' + data + ' USD / 1 ETH'),

    ]))  ;
    

});
