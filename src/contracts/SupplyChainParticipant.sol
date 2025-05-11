// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract SupplyChainParticipant {
    struct Participant {
        string id;
        string name;
        string role;
        address walletAddress;
        bool isActive;
        uint256 registeredAt;
    }

    mapping(address => Participant) public participants;
    mapping(string => address) public participantIds;
    address public owner;

    event ParticipantRegistered(string id, string name, string role);
    event ParticipantUpdated(string id, string name, string role);
    event ParticipantDeactivated(string id);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function registerParticipant(
        string memory _id,
        string memory _name,
        string memory _role
    ) public {
        require(participants[msg.sender].walletAddress == address(0), "Already registered");
        require(participantIds[_id] == address(0), "ID already exists");
        
        participants[msg.sender] = Participant({
            id: _id,
            name: _name,
            role: _role,
            walletAddress: msg.sender,
            isActive: true,
            registeredAt: block.timestamp
        });
        
        participantIds[_id] = msg.sender;
        emit ParticipantRegistered(_id, _name, _role);
    }

    function updateParticipant(
        string memory _name,
        string memory _role
    ) public {
        require(participants[msg.sender].walletAddress != address(0), "Not registered");
        require(participants[msg.sender].isActive, "Participant inactive");
        
        participants[msg.sender].name = _name;
        participants[msg.sender].role = _role;
        
        emit ParticipantUpdated(
            participants[msg.sender].id,
            _name,
            _role
        );
    }

    function deactivateParticipant(string memory _id) public onlyOwner {
        address participantAddress = participantIds[_id];
        require(participantAddress != address(0), "Participant not found");
        
        participants[participantAddress].isActive = false;
        emit ParticipantDeactivated(_id);
    }

    function getParticipant(address _address) public view returns (
        string memory id,
        string memory name,
        string memory role,
        address walletAddress,
        bool isActive,
        uint256 registeredAt
    ) {
        Participant memory participant = participants[_address];
        return (
            participant.id,
            participant.name,
            participant.role,
            participant.walletAddress,
            participant.isActive,
            participant.registeredAt
        );
    }

    function isRegistered(address _address) public view returns (bool) {
        return participants[_address].walletAddress != address(0) && 
               participants[_address].isActive;
    }
}