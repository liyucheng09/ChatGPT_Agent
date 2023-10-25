// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract GameAsset is ERC721 {
    uint256 public nextTokenId;

    constructor() ERC721("GameAsset", "GAS") {}

    function mint(address to) public {
        _mint(to, nextTokenId);
        nextTokenId++;
    }
}