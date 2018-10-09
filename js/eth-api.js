(function(_export){
	var EtherscanProvider = new ethers.providers.EtherscanProvider();
	var APIURL = "https://api.etherscan.io/api?";

	function download (data, filename, type) {
		var file = new Blob([data], {type: type || 'application/octet-stream'});
		if (window.navigator.msSaveOrOpenBlob) // IE10+
			window.navigator.msSaveOrOpenBlob(file, filename);
		else { // Others
			var a = document.createElement("a"),
				url = URL.createObjectURL(file);
			a.href = url;
			a.download = filename; 
			document.body.appendChild(a);
			a.click();
			setTimeout(function() {
				document.body.removeChild(a);
				window.URL.revokeObjectURL(url);
			}, 0);
		}
	}

	_export.createKeyStore = function (_password){
		var w = new ethers.Wallet.createRandom();
		w.encrypt(_password).then(function(data) {
			var _fileName = JSON.parse(data)['x-ethers'].gethFilename;
            download(data, _fileName, 'text/x-json')
		});
		return w;
	};

	_export.provider = ethers.providers.getDefaultProvider('mainnet');

	_export.getBalancePromise = function(address, network, fn){
		if(!address) throw 'address shuld not be empty';
		if(network) _export.setProvider(network); 
		return _export.provider.getBalance(address).then(fn);
	}
	_export.getContract = function(contractAddress, network){
		if(!contractAddress) throw 'contractAddress shuld not be empty';
		if(network) _export.setProvider(network);
		return new ethers.Contract(contractAddress, _export.getABI(contractAddress), _export.provider);
	}
	_export.getSignedContract = function(contractAddress, privateKeyWallet, network) {
		if(!contractAddress) throw 'contractAddress shuld not be empty';
		if(!privateKeyWallet) throw 'privateKeyWallet shuld not be empty';
		if(network) _export.setProvider(network);
		var wallet = new ethers.Wallet(privateKeyWallet, _export.provider);
		return ethApi.getContract(contractAddress).connect(wallet);
	}
	_export.setProvider = function(strName){
		switch(strName){
			case "main":
				APIURL = "https://api.etherscan.io/api?";
				_export.provider = ethers.providers.getDefaultProvider('mainnet');
				EtherscanProvider = new ethers.providers.EtherscanProvider();
				break;
			case "ropstan":
				APIURL = "https://api-ropsten.etherscan.io/api?";
				_export.provider = ethers.providers.getDefaultProvider('ropsten');
				EtherscanProvider = new ethers.providers.EtherscanProvider('ropsten');
				break;
			default:
				throw 'Incorect net name [main|ropstan]';
		}
	};
	_export.getPrice = function (fn) {
		
		ethers.providers.getDefaultProvider('mainnet').getEtherPrice().then(function(data){
			fn(data);
		})
	};

	_export.getABI = function (address) {
		/* var data = {
			module: 'contract',
			action: "getabi",
			address: address,
			apikey: '9TW741YA78XY5EHB828E49F33W36HDQSJB'
		}
		return $.loadAndСache(APIURL + data.toUri()).data.result
		 */
		return $.loadAndСache('/js/abi/' + address + '.json').data;
	}

	_export.createWallet = ethers.Wallet.createRandom;
	_export.history = function (address, fn, fnerr) {
		EtherscanProvider.getHistory(address).then(fn, fnerr);
	}
})(ethApi = {
	ROPSTAN: 'ropstan',
	MAINNET: 'mainnet'
});

