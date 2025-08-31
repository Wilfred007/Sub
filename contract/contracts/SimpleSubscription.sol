// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Streamlined Dual Payment Subscription Contract  
 * @dev Essential subscription functionality with ETH/USDT payments and auto-renewal
 */

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract StreamlinedSubscription {
    
    struct Plan {
        uint256 ethPrice;     // Price in wei
        uint256 usdtPrice;    // Price in USDT (6 decimals)
        uint256 interval;     // Duration in seconds
        string name;          // Plan name
        bool active;          // Is plan active
    }
    
    struct Subscription {
        uint256 expiresAt;           // Timestamp when subscription expires
        bool autoRenewEnabled;       // Auto-renewal opt-in status
        bool preferETH;              // Preferred payment method (true = ETH, false = USDT)
    }
    
    // State variables
    address public owner;
    uint256 public planCounter;
    IERC20 public usdtToken;
    
    // Prepaid ETH balances for auto-renewal
    mapping(address => uint256) public ethBalances;
    mapping(uint256 => Plan) public plans;
    mapping(address => mapping(uint256 => Subscription)) public subscriptions;
    
    // Essential events
    event PlanCreated(uint256 indexed planId, string name, uint256 ethPrice, uint256 usdtPrice);
    event Subscribed(address indexed user, uint256 indexed planId, uint256 expiresAt, bool paidWithETH);
    event Renewed(address indexed user, uint256 indexed planId, uint256 expiresAt, bool paidWithETH);
    event AutoRenewalToggled(address indexed user, uint256 indexed planId, bool enabled);
    event ETHDeposited(address indexed user, uint256 amount);
    event ETHWithdrawn(address indexed user, uint256 amount);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }
    
    modifier validPlan(uint256 planId) {
        require(planId < planCounter && plans[planId].active, "Invalid plan");
        _;
    }
    
    constructor(address _usdtToken) {
        owner = msg.sender;
        usdtToken = IERC20(_usdtToken);
    }
    
    // ============ CORE FUNCTIONS ============
    
    /**
     * @dev Create a new subscription plan
     */
    function createPlan(
        string calldata name,
        uint256 ethPrice,
        uint256 usdtPrice,
        uint256 intervalDays
    ) external onlyOwner {
        require(bytes(name).length > 0 && ethPrice > 0 && usdtPrice > 0 && intervalDays > 0, "Invalid params");
        
        plans[planCounter] = Plan({
            name: name,
            ethPrice: ethPrice,
            usdtPrice: usdtPrice,
            interval: intervalDays * 1 days,
            active: true
        });
        
        emit PlanCreated(planCounter, name, ethPrice, usdtPrice);
        planCounter++;
    }
    
    /**
     * @dev Subscribe with ETH
     */
    function subscribeETH(uint256 planId) external payable validPlan(planId) {
        Plan storage plan = plans[planId];
        require(msg.value == plan.ethPrice, "Wrong ETH amount");
        require(!isActive(msg.sender, planId), "Already active");
        
        _createSubscription(planId, plan.interval, true);
        emit Subscribed(msg.sender, planId, subscriptions[msg.sender][planId].expiresAt, true);
    }
    
    /**
     * @dev Subscribe with USDT
     */
    function subscribeUSDT(uint256 planId) external validPlan(planId) {
        Plan storage plan = plans[planId];
        require(!isActive(msg.sender, planId), "Already active");
        require(usdtToken.transferFrom(msg.sender, address(this), plan.usdtPrice), "USDT transfer failed");
        
        _createSubscription(planId, plan.interval, false);
        emit Subscribed(msg.sender, planId, subscriptions[msg.sender][planId].expiresAt, false);
    }
    
    /**
     * @dev Renew with ETH
     */
    function renewETH(uint256 planId) external payable validPlan(planId) {
        Plan storage plan = plans[planId];
        require(msg.value == plan.ethPrice, "Wrong ETH amount");
        require(subscriptions[msg.sender][planId].expiresAt > 0, "Not subscribed");
        
        _renewSubscription(planId, plan.interval);
        emit Renewed(msg.sender, planId, subscriptions[msg.sender][planId].expiresAt, true);
    }
    
    /**
     * @dev Renew with USDT
     */
    function renewUSDT(uint256 planId) external validPlan(planId) {
        Plan storage plan = plans[planId];
        require(subscriptions[msg.sender][planId].expiresAt > 0, "Not subscribed");
        require(usdtToken.transferFrom(msg.sender, address(this), plan.usdtPrice), "USDT transfer failed");
        
        _renewSubscription(planId, plan.interval);
        emit Renewed(msg.sender, planId, subscriptions[msg.sender][planId].expiresAt, false);
    }
    
    // ============ AUTO-RENEWAL ============
    
    /**
     * @dev Toggle auto-renewal
     */
    function setAutoRenewal(uint256 planId, bool enabled, bool preferETH) external {
        require(subscriptions[msg.sender][planId].expiresAt > 0, "Not subscribed");
        
        Subscription storage sub = subscriptions[msg.sender][planId];
        sub.autoRenewEnabled = enabled;
        sub.preferETH = preferETH;
        
        emit AutoRenewalToggled(msg.sender, planId, enabled);
    }
    
    /**
     * @dev Process auto-renewal (callable by anyone)
     */
    function processAutoRenewal(address user, uint256 planId) external validPlan(planId) {
        Subscription storage sub = subscriptions[user][planId];
        require(sub.autoRenewEnabled && block.timestamp >= sub.expiresAt, "Cannot renew");
        
        Plan storage plan = plans[planId];
        
        if (sub.preferETH) {
            require(ethBalances[user] >= plan.ethPrice, "Insufficient ETH balance");
            ethBalances[user] -= plan.ethPrice;
        } else {
            require(usdtToken.transferFrom(user, address(this), plan.usdtPrice), "USDT transfer failed");
        }
        
        _renewSubscriptionForUser(user, planId, plan.interval);
        emit Renewed(user, planId, subscriptions[user][planId].expiresAt, sub.preferETH);
    }
    
    // ============ ETH BALANCE MANAGEMENT ============
    
    /**
     * @dev Deposit ETH for auto-renewal
     */
    function depositETH() external payable {
        require(msg.value > 0, "Zero deposit");
        ethBalances[msg.sender] += msg.value;
        emit ETHDeposited(msg.sender, msg.value);
    }
    
    /**
     * @dev Withdraw ETH balance
     */
    function withdrawETH(uint256 amount) external {
        require(ethBalances[msg.sender] >= amount && amount > 0, "Invalid amount");
        
        ethBalances[msg.sender] -= amount;
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Transfer failed");
        
        emit ETHWithdrawn(msg.sender, amount);
    }
    
    // ============ VIEW FUNCTIONS ============
    
    /**
     * @dev Check if subscription is active
     */
    function isActive(address user, uint256 planId) public view returns (bool) {
        return block.timestamp < subscriptions[user][planId].expiresAt;
    }
    
    /**
     * @dev Get subscription info
     */
    function getSubscription(address user, uint256 planId) external view returns (
        uint256 expiresAt, 
        bool active,
        bool autoRenewEnabled,
        bool preferETH
    ) {
        Subscription storage sub = subscriptions[user][planId];
        return (sub.expiresAt, isActive(user, planId), sub.autoRenewEnabled, sub.preferETH);
    }
    
    /**
     * @dev Get plan info
     */
    function getPlan(uint256 planId) external view returns (
        string memory name,
        uint256 ethPrice,
        uint256 usdtPrice,
        uint256 interval,
        bool active
    ) {
        require(planId < planCounter, "Invalid plan");
        Plan storage plan = plans[planId];
        return (plan.name, plan.ethPrice, plan.usdtPrice, plan.interval, plan.active);
    }
    
    /**
     * @dev Get active plans
     */
    function getActivePlans() external view returns (uint256[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < planCounter; i++) {
            if (plans[i].active) count++;
        }
        
        uint256[] memory activePlans = new uint256[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < planCounter; i++) {
            if (plans[i].active) {
                activePlans[index++] = i;
            }
        }
        return activePlans;
    }
    
    // ============ OWNER FUNCTIONS ============
    
    /**
     * @dev Toggle plan status
     */
    function togglePlan(uint256 planId) external onlyOwner {
        require(planId < planCounter, "Invalid plan");
        plans[planId].active = !plans[planId].active;
    }
    
    /**
     * @dev Withdraw contract ETH (revenue only)
     */
    function withdrawRevenue() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds");
        
        (bool success, ) = payable(owner).call{value: balance}("");
        require(success, "Transfer failed");
    }
    
    /**
     * @dev Withdraw USDT
     */
    function withdrawUSDT() external onlyOwner {
        uint256 balance = usdtToken.balanceOf(address(this));
        require(balance > 0, "No USDT");
        require(usdtToken.transfer(owner, balance), "Transfer failed");
    }
    
    // ============ INTERNAL FUNCTIONS ============
    
    function _createSubscription(uint256 planId, uint256 interval, bool preferETH) internal {
        subscriptions[msg.sender][planId] = Subscription({
            expiresAt: block.timestamp + interval,
            autoRenewEnabled: false,
            preferETH: preferETH
        });
    }
    
    function _renewSubscription(uint256 planId, uint256 interval) internal {
        Subscription storage sub = subscriptions[msg.sender][planId];
        sub.expiresAt = (sub.expiresAt > block.timestamp) 
            ? sub.expiresAt + interval 
            : block.timestamp + interval;
    }
    
    function _renewSubscriptionForUser(address user, uint256 planId, uint256 interval) internal {
        Subscription storage sub = subscriptions[user][planId];
        sub.expiresAt = (sub.expiresAt > block.timestamp) 
            ? sub.expiresAt + interval 
            : block.timestamp + interval;
    }
}