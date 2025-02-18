// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract USDTContract is ERC20 {
    uint8 private immutable _decimals;

    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply,
        uint8 decimal
    ) ERC20(name, symbol) {
        _decimals = decimal; // Set custom decimal places to 6
        _mint(msg.sender, initialSupply * 10**_decimals); // Mint initial supply
    }

    // Override decimals function
    function decimals() public view override returns (uint8) {
        return _decimals;
    }
}
