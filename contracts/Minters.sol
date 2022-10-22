// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

abstract contract Minters is Initializable, OwnableUpgradeable {
    mapping(address => bool) public minters;

    function __Minters_init() internal onlyInitializing {
        __Ownable_init();
    }

    modifier onlyMinters() {
        require(minters[msg.sender] || owner() == msg.sender);
        _;
    }

    function addMinter(address _account) public onlyOwner {
        require(_account != address(0));
        minters[_account] = true;
    }

    function removeMinter(address _account) public onlyOwner {
        require(_account != address(0));
        minters[_account] = false;
    }
}