// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract GameAssetMarket {
    struct Listing {
        address seller;
        uint256 price;
    }

    ERC721 public asset;
    mapping(uint256 => Listing) public listings;

    constructor(address _asset) {
        asset = ERC721(_asset);
    }

    function list(uint256 tokenId, uint256 price) public {
        require(asset.ownerOf(tokenId) == msg.sender, "Not token owner");
        asset.transferFrom(msg.sender, address(this), tokenId);
        listings[tokenId] = Listing(msg.sender, price);
    }

    function buy(uint256 tokenId) public payable {
        Listing storage listing = listings[tokenId];
        require(msg.value == listing.price, "Incorrect price");

        payable(listing.seller).transfer(msg.value);
        asset.transferFrom(address(this), msg.sender, tokenId);

        delete listings[tokenId];
    }
}
