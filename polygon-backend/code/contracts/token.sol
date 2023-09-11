// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "../node_modules/@openzeppelin/contracts/security/Pausable.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";

contract MyToken is ERC20, ERC20Burnable, Pausable, Ownable, ERC20Permit, ERC20Votes {
    uint256 public tokenPrice; // This value denotes 1 ETH = 10000 Tokens

    uint256 public totalYesVotes = 0;
    uint256 public totalNoVotes = 0;
    uint256 public totalAbstainVotes = 0;

    event Mint(address indexed to, uint256 amount);
    event YesVote(address indexed voter, uint256 power);
    event NoVote(address indexed voter, uint256 power);
    event AbstainVote(address indexed voter, uint256 power);

    constructor() ERC20("testGOV", "GOV") ERC20Permit("testGOV") {}

    function approveContract(uint256 amount) public {
        approve(address(this), amount);
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }
    function setTokenPrice(uint256 _tokenPrice) public onlyOwner {
        tokenPrice = _tokenPrice;
    }
    function decimals() public view virtual override returns (uint8) {
        return 18;
    }

    function approveAll() public returns (bool) { 
        uint256 allowance = balanceOf(msg.sender);
        _approve(msg.sender, address(this), allowance);
        return true;
    }


    function mint(address to) public payable {
        require(msg.value >= tokenPrice,"Invalid amount sent");
        uint256 amountToMint = (msg.value / tokenPrice)*(10**uint256(decimals())); // 1 ETH = 10000 Tokens
        _mint(to, amountToMint);

        emit Mint(to, amountToMint);
    }

    function voteYes(uint256 amount) public {
        require(amount <= balanceOf(msg.sender), "Not enough tokens to vote");
        require(allowance(msg.sender, address(this)) >= amount, "Contract is not approved to transfer this amount of tokens");
        transfer(address(this), amount);

        totalYesVotes += amount;  
        emit YesVote(msg.sender, amount);
    }

    function voteNo(uint256 amount) public {
        require(amount <= balanceOf(msg.sender), "Not enough tokens to vote");
        require(allowance(msg.sender, address(this)) >= amount, "Contract is not approved to transfer this amount of tokens");
        transfer(address(this), amount);

        totalNoVotes += amount;  

        emit NoVote(msg.sender, amount);
    }

    function voteAbstain(uint256 amount) public {
        require(amount <= balanceOf(msg.sender), "Not enough tokens to vote");
        require(allowance(msg.sender, address(this)) >= amount, "Contract is not approved to transfer this amount of tokens");
        transfer(address(this), amount);

        totalAbstainVotes += amount;  

        emit AbstainVote(msg.sender, amount);
    }

    function _beforeTokenTransfer(address from, address to, uint256 amount)
        internal
        whenNotPaused
        override
    {
        super._beforeTokenTransfer(from, to, amount);
    }

    function _afterTokenTransfer(address from, address to, uint256 amount)
        internal
        override(ERC20, ERC20Votes)
    {
        super._afterTokenTransfer(from, to, amount);
    }

    function _mint(address to, uint256 amount)
        internal
        override(ERC20, ERC20Votes)
    {
        super._mint(to, amount);
    }

    function _burn(address account, uint256 amount)
        internal
        override(ERC20, ERC20Votes)
    {
        super._burn(account, amount);
    }

}
