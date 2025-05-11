// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract ProductRegistry {
    struct Product {
        string id;
        string name;
        string rfidTag;
        string manufacturer;
        address manufacturerAddress;
        string currentLocation;
        string status;
        uint256 timestamp;
        uint256 temperature;
        uint256 humidity;
    }

    mapping(string => Product) public products;
    mapping(string => bool) public rfidExists;
    mapping(address => bool) public authorizedParticipants;

    event ProductRegistered(string id, string rfidTag, string manufacturer);
    event ProductUpdated(string indexed id, string status, string location);
    event SensorDataUpdated(string id, uint256 temperature, uint256 humidity);

    modifier onlyAuthorized() {
        require(authorizedParticipants[msg.sender], "Not authorized");
        _;
    }

    constructor() {
        authorizedParticipants[msg.sender] = true;
    }

    function registerProduct(
        string memory _id,
        string memory _name,
        string memory _rfidTag,
        string memory _manufacturer
    ) public onlyAuthorized {
        require(!rfidExists[_rfidTag], "RFID already registered");
        
        products[_id] = Product({
            id: _id,
            name: _name,
            rfidTag: _rfidTag,
            manufacturer: _manufacturer,
            manufacturerAddress: msg.sender,
            currentLocation: _manufacturer,
            status: "manufactured",
            timestamp: block.timestamp,
            temperature: 0,
            humidity: 0
        });
        
        rfidExists[_rfidTag] = true;
        emit ProductRegistered(_id, _rfidTag, _manufacturer);
    }

    function updateProduct(
        string memory _id,
        string memory _status,
        string memory _location
    ) public onlyAuthorized {
        require(bytes(products[_id].id).length > 0, "Product not found");
        
        products[_id].status = _status;
        products[_id].currentLocation = _location;
        products[_id].timestamp = block.timestamp;
        
        emit ProductUpdated(_id, _status, _location);
    }

    function updateSensorData(
        string memory _id,
        uint256 _temperature,
        uint256 _humidity
    ) public onlyAuthorized {
        require(bytes(products[_id].id).length > 0, "Product not found");
        
        products[_id].temperature = _temperature;
        products[_id].humidity = _humidity;
        products[_id].timestamp = block.timestamp;
        
        emit SensorDataUpdated(_id, _temperature, _humidity);
    }

    function getProduct(string memory _id) public view returns (
        string memory id,
        string memory name,
        string memory rfidTag,
        string memory manufacturer,
        address manufacturerAddress,
        string memory currentLocation,
        string memory status,
        uint256 timestamp,
        uint256 temperature,
        uint256 humidity
    ) {
        Product memory product = products[_id];
        require(bytes(product.id).length > 0, "Product not found");
        return (
            product.id,
            product.name,
            product.rfidTag,
            product.manufacturer,
            product.manufacturerAddress,
            product.currentLocation,
            product.status,
            product.timestamp,
            product.temperature,
            product.humidity
        );
    }

    function authorizeParticipant(address _participant) public onlyAuthorized {
        authorizedParticipants[_participant] = true;
    }

    function revokeParticipant(address _participant) public onlyAuthorized {
        authorizedParticipants[_participant] = false;
    }
}