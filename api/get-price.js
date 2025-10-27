//
// MODIFIED content for api/get-price.js (v5 - Final Donut Miner Logic)
//
const { ethers } = require("ethers");

// --- START CONFIGURATION ---
const BASE_PROVIDER_URL = process.env.BASE_PROVIDER_URL; 
const CONTRACT_ADDRESS = '0x9c751e6825edaa55007160b99933846f6eceec9b';
const USDC_ADDRESS = '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913';

// UPDATED ABI: Added getOwner() to read the current King's address
const contractAbi = [
  "function getPrice() external view returns (uint256)",
  "function getSlot0() external view returns (tuple(uint8 locked, uint16 epochId, uint192 initPrice, uint40 startTime, address owner, string uri))",
  "function getOwner() external view returns (address)" // ADDED: To check who the current Glazer is
];
const usdcAbi = [
  "function allowance(address owner, address spender) external view returns (uint256)"
];
// --- END CONFIGURATION ---

let readOnlyProvider;
let readOnlyGameContract;
let readOnlyUsdcContract;

// Initialize providers and contracts outside the handler for reuse
if (BASE_PROVIDER_URL) {
  try {
    readOnlyProvider = new ethers.providers.JsonRpcProvider(BASE_PROVIDER_URL);
    readOnlyGameContract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi, readOnlyProvider);
    readOnlyUsdcContract = new ethers.Contract(USDC_ADDRESS, usdcAbi, readOnlyProvider);
    console.log("[get-price] Read-only provider and contracts initialized.");
  } catch (e) {
    console.error("[get-price] FAILED to create read-only provider:", e.message);
  }
}

module.exports = async function handler(req, res) {
  console.log("[v5] /api/get-price called (Donut Miner)");
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userAddress } = req.query;

  if (!readOnlyGameContract || !readOnlyUsdcContract) {
    console.error("[get-price] Provider or contract not initialized. Check BASE_PROVIDER_URL env var.");
    return res.status(500).json({ error: "Server configuration error: Failed to connect to network." });
  }

  try {
    // 1. Always fetch core data: Price, Slot0 (for epoch), and Current Owner
    const [price, slot0, currentOwner] = await Promise.all([
      readOnlyGameContract.getPrice(),
      readOnlyGameContract.getSlot0(),
      readOnlyGameContract.getOwner() 
    ]);
    
    const epochId = slot0.epochId;
    // Format price from 6 decimals (USDC) to a standard decimal string
    const priceInUsdc = ethers.utils.formatUnits(price, 6);

    let allowance = null;

    // 2. If a userAddress is provided, fetch their USDC allowance
    if (userAddress) {
      const checksummedAddress = ethers.utils.getAddress(userAddress);
      
      const userAllowance = await readOnlyUsdcContract.allowance(checksummedAddress, CONTRACT_ADDRESS);
      
      allowance = userAllowance.toString();
      
      console.log(`[get-price] Fetched user data: price: ${price.toString()}, owner: ${currentOwner}, allowance: ${allowance}`);
    }

    // 3. Return all necessary data
    res.status(200).json({
      price: price.toString(), // Raw price for transaction logic
      epochId: Number(epochId),
      priceInUsdc: priceInUsdc, // Formatted price for display
      allowance: allowance, // User's allowance to the game contract
      currentOwner: currentOwner, // The King Glazer's address
    });

  } catch (error) {
    console.error("[get-price] Error fetching data from contract:", error.message);
    res.status(500).json({ error: `Contract read error: ${error.message}` });
  }
};
