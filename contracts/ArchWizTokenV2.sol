// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "./Minters.sol";

contract ArchWizTokenV2 is Initializable, ERC20Upgradeable, Minters {
    uint256 private maxSupply;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(uint256 _maxSupply) public initializer {
        __ERC20_init("Arch Wizard Gems", "AWG");
        __Minters_init();

        maxSupply = _maxSupply;
    }

    function mint(address _account, uint256 _amount) public onlyMinters {
        require(_account != address(0));
        require(totalSupply() + _amount <= maxSupply, "Max supply reached");
        _mint(_account, _amount);
    }

    function burn(address _account, uint256 _amount) public onlyMinters {
        _burn(_account, _amount);
    }

    function burnSupply(uint256 _amount) public onlyOwner {
        require(maxSupply - totalSupply() >= _amount);
        maxSupply -= _amount;
    }

    function remainingSupply() public view returns (uint256) {
        return maxSupply - totalSupply();
    }

    function maximumSupply() external view returns (uint256) {
        return maxSupply;
    }

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) public virtual override(ERC20Upgradeable) returns (bool) {
        if (!minters[to]) {
            address spender = _msgSender();
            _spendAllowance(from, spender, amount);
        }
        _transfer(from, to, amount);
        return true;
    }
}
