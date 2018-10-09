pragma solidity ^0.4.16;

/**
 * @title SafeMath
 * @dev Math operations with safety checks that throw on error
 */
library SafeMath {
    
  function mul(uint256 a, uint256 b) internal pure returns (uint256) {
    uint256 c = a * b;
    assert(a == 0 || c / a == b);
    return c;
  }

  function div(uint256 a, uint256 b) internal pure returns (uint256) {
    // assert(b > 0); // Solidity automatically throws when dividing by 0
    uint256 c = a / b;
    // assert(a == b * c + a % b); // There is no case in which this doesn't hold
    return c;
  }

  function sub(uint256 a, uint256 b) internal pure returns (uint256) {
    assert(b <= a);
    return a - b;
  }

  function add(uint256 a, uint256 b) internal pure returns (uint256) {
    uint256 c = a + b;
    assert(c >= a);
    return c;
  }
  
}


contract FDDP_DepositToken_10 {
    
    using SafeMath for uint;
    
	string public constant name = "FDDP - Deposit Token 10%";
	
	string public constant symbol = "DT10";
	
	uint32 public constant decimals = 15;
    
    uint _money = 0;
    uint _tokens = 0;
    uint _sellprice;
    uint contractBalance;
    
    // Адрес контракта Акций
    address theStocksTokenContract;
    
    // сохранить баланс на счетах пользователя
    
    mapping (address => uint) balances;
    
    event OperationEvent(bytes32 status, uint sellprice, uint time);
    event Transfer(address indexed from, address indexed to, uint256 value);
    // OK
    constructor (address _tstc) public {
        uint s = 10**15;
        _sellprice = s.mul(90).div(100);
        theStocksTokenContract = _tstc;
        
        /* 
         * 1 token belongs to the contract
         */
        address _this = this; 
        uint _value = 10**15; 
        
        _tokens += _value;
        balances[_this] += _value;
    }
    function totalSupply () public constant returns (uint256 tokens) {
        return _tokens;
    }
   
    function getTheStocksTokens () public constant returns (address stAddress) {
        return theStocksTokenContract;
    }
    // OK
    function balanceOf(address addr) public constant returns(uint){
        return balances[addr];
    }
    // OK
    function transfer(address _to, uint256 _value) public returns (bool success) {
        address addressContract = this;
        require(_to == addressContract);
        sell(_value);
        emit Transfer(msg.sender, _to, _value);
        success = true;
    }
    // OK
    function buy() public payable {
        uint _value = msg.value.mul(10**15).div(_sellprice.mul(100).div(90));
        _money += msg.value.mul(95).div(100);
        
        theStocksTokenContract.call.value(msg.value.mul(5).div(100)).gas(53000)(); // 5% comission system
        
        _tokens += _value;
        balances[msg.sender] += _value;
        _sellprice = _money.mul(10**15).mul(98).div(_tokens).div(100);
        emit OperationEvent("buy", _sellprice, now);
    }
    // OK
    function () external payable {
        buy();
    }
    // OK
    function sell (uint256 countTokens) public {
        require(balances[msg.sender] - countTokens >= 0);
        uint _value = countTokens.mul(_sellprice).div(10**15);
        _money -= _value;
        _tokens -= countTokens;
        balances[msg.sender] -= countTokens;
        if(_tokens > 0) {
            _sellprice = _money.mul(10**15).mul(98).div(_tokens).div(100);
        }
        msg.sender.transfer(_value);
        emit OperationEvent("sell", _sellprice, now);
    }
    // OK
    function getPrice() public constant returns (uint bid, uint ask) {
        bid = _sellprice.mul(100).div(90);
        ask = _sellprice;
    }
}