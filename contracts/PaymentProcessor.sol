// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract PaymentProcessor {
    struct Payment {
        address from;
        address to;
        uint256 amount;
        string productId;
        uint256 timestamp;
        bool completed;
    }

    mapping(string => Payment) public payments;
    mapping(address => uint256) public balances;

    event PaymentCreated(string paymentId, address from, address to, uint256 amount, string productId);
    event PaymentCompleted(string paymentId);
    event FundsDeposited(address account, uint256 amount);
    event FundsWithdrawn(address account, uint256 amount);

    function deposit() external payable {
        balances[msg.sender] += msg.value;
        emit FundsDeposited(msg.sender, msg.value);
    }

    function withdraw(uint256 amount) external {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);
        emit FundsWithdrawn(msg.sender, amount);
    }

    function createPayment(
        string memory paymentId,
        address to,
        uint256 amount,
        string memory productId
    ) external {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        require(payments[paymentId].timestamp == 0, "Payment ID already exists");

        payments[paymentId] = Payment({
            from: msg.sender,
            to: to,
            amount: amount,
            productId: productId,
            timestamp: block.timestamp,
            completed: false
        });

        emit PaymentCreated(paymentId, msg.sender, to, amount, productId);
    }

    function completePayment(string memory paymentId) external {
        Payment storage payment = payments[paymentId];
        require(payment.timestamp > 0, "Payment does not exist");
        require(!payment.completed, "Payment already completed");
        require(msg.sender == payment.to, "Only recipient can complete payment");

        payment.completed = true;
        balances[payment.from] -= payment.amount;
        balances[payment.to] += payment.amount;

        emit PaymentCompleted(paymentId);
    }

    function getPayment(string memory paymentId) external view returns (
        address from,
        address to,
        uint256 amount,
        string memory productId,
        uint256 timestamp,
        bool completed
    ) {
        Payment memory payment = payments[paymentId];
        return (
            payment.from,
            payment.to,
            payment.amount,
            payment.productId,
            payment.timestamp,
            payment.completed
        );
    }

    function getBalance() external view returns (uint256) {
        return balances[msg.sender];
    }
}