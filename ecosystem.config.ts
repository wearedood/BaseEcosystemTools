/**
 * Base Ecosystem Configuration
 * Comprehensive configuration for Base blockchain ecosystem tools
 */

export interface NetworkConfig {
  chainId: number;
  name: string;
  rpcUrl: string;
  blockExplorer: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
}

export interface ProtocolConfig {
  name: string;
  address: string;
  abi: any[];
  version: string;
  category: 'dex' | 'lending' | 'yield' | 'bridge' | 'nft';
  tvl?: string;
  apr?: number;
}

export interface TokenConfig {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  logoURI?: string;
  coingeckoId?: string;
}

// Base Network Configuration
export const BASE_MAINNET: NetworkConfig = {
  chainId: 8453,
  name: 'Base',
  rpcUrl: 'https://mainnet.base.org',
  blockExplorer: 'https://basescan.org',
  nativeCurrency: {
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18
  }
};

export const BASE_SEPOLIA: NetworkConfig = {
  chainId: 84532,
  name: 'Base Sepolia',
  rpcUrl: 'https://sepolia.base.org',
  blockExplorer: 'https://sepolia.basescan.org',
  nativeCurrency: {
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18
  }
};

// Protocol Configurations
export const PROTOCOLS: Record<string, ProtocolConfig> = {
  UNISWAP_V3: {
    name: 'Uniswap V3',
    address: '0x2626664c2603336E57B271c5C0b26F421741e481',
    abi: [], // Add actual ABI
    version: '3.0.0',
    category: 'dex',
    tvl: '500000000', // $500M
    apr: 12.5
  },
  COMPOUND_V3: {
    name: 'Compound V3',
    address: '0x9c4ec768c28520B50860ea7a15bd7213a9fF58bf',
    abi: [], // Add actual ABI
    version: '3.0.0',
    category: 'lending',
    tvl: '300000000', // $300M
    apr: 8.2
  },
  AERODROME: {
    name: 'Aerodrome',
    address: '0x940181a94A37A2A52b90D688a193c1e0c0Ae46A1',
    abi: [], // Add actual ABI
    version: '1.0.0',
    category: 'dex',
    tvl: '200000000', // $200M
    apr: 15.8
  },
  MOONWELL: {
    name: 'Moonwell',
    address: '0x628ff693426583D9a7FB391E54366292F509D457',
    abi: [], // Add actual ABI
    version: '2.0.0',
    category: 'lending',
    tvl: '150000000', // $150M
    apr: 9.5
  }
};

// Token Configurations
export const TOKENS: Record<string, TokenConfig> = {
  ETH: {
    symbol: 'ETH',
    name: 'Ethereum',
    address: '0x0000000000000000000000000000000000000000',
    decimals: 18,
    coingeckoId: 'ethereum'
  },
  USDC: {
    symbol: 'USDC',
    name: 'USD Coin',
    address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    decimals: 6,
    coingeckoId: 'usd-coin'
  },
  WETH: {
    symbol: 'WETH',
    name: 'Wrapped Ethereum',
    address: '0x4200000000000000000000000000000000000006',
    decimals: 18,
    coingeckoId: 'weth'
  },
  DAI: {
    symbol: 'DAI',
    name: 'Dai Stablecoin',
    address: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb',
    decimals: 18,
    coingeckoId: 'dai'
  },
  CBETH: {
    symbol: 'cbETH',
    name: 'Coinbase Wrapped Staked ETH',
    address: '0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22',
    decimals: 18,
    coingeckoId: 'coinbase-wrapped-staked-eth'
  }
};

// Gas Configuration
export const GAS_CONFIG = {
  STANDARD: {
    gasLimit: 21000,
    maxFeePerGas: '20000000000', // 20 gwei
    maxPriorityFeePerGas: '2000000000' // 2 gwei
  },
  FAST: {
    gasLimit: 21000,
    maxFeePerGas: '30000000000', // 30 gwei
    maxPriorityFeePerGas: '3000000000' // 3 gwei
  },
  INSTANT: {
    gasLimit: 21000,
    maxFeePerGas: '50000000000', // 50 gwei
    maxPriorityFeePerGas: '5000000000' // 5 gwei
  }
};

// API Configuration
export const API_CONFIG = {
  COINGECKO: {
    baseUrl: 'https://api.coingecko.com/api/v3',
    rateLimit: 50 // requests per minute
  },
  DEFILLAMA: {
    baseUrl: 'https://api.llama.fi',
    rateLimit: 300 // requests per minute
  },
  BASESCAN: {
    baseUrl: 'https://api.basescan.org/api',
    rateLimit: 5 // requests per second
  }
};

// Feature Flags
export const FEATURE_FLAGS = {
  ENABLE_YIELD_FARMING: true,
  ENABLE_ARBITRAGE: true,
  ENABLE_FLASH_LOANS: false,
  ENABLE_CROSS_CHAIN: true,
  ENABLE_NFT_TRADING: true,
  ENABLE_GOVERNANCE: true
};

// Risk Management
export const RISK_CONFIG = {
  MAX_SLIPPAGE: 0.05, // 5%
  MAX_POSITION_SIZE: '1000000', // $1M
  MIN_LIQUIDITY: '100000', // $100K
  RISK_SCORE_THRESHOLD: 7, // Out of 10
  REBALANCE_THRESHOLD: 0.1 // 10% deviation
};

// Utility Functions
export function getNetworkConfig(chainId: number): NetworkConfig | null {
  switch (chainId) {
    case 8453:
      return BASE_MAINNET;
    case 84532:
      return BASE_SEPOLIA;
    default:
      return null;
  }
}

export function getProtocolByAddress(address: string): ProtocolConfig | null {
  return Object.values(PROTOCOLS).find(p => 
    p.address.toLowerCase() === address.toLowerCase()
  ) || null;
}

export function getTokenBySymbol(symbol: string): TokenConfig | null {
  return TOKENS[symbol.toUpperCase()] || null;
}

export function calculateOptimalGas(priority: 'standard' | 'fast' | 'instant') {
  switch (priority) {
    case 'fast':
      return GAS_CONFIG.FAST;
    case 'instant':
      return GAS_CONFIG.INSTANT;
    default:
      return GAS_CONFIG.STANDARD;
  }
}

export default {
  networks: { BASE_MAINNET, BASE_SEPOLIA },
  protocols: PROTOCOLS,
  tokens: TOKENS,
  gas: GAS_CONFIG,
  api: API_CONFIG,
  features: FEATURE_FLAGS,
  risk: RISK_CONFIG,
  utils: {
    getNetworkConfig,
    getProtocolByAddress,
    getTokenBySymbol,
    calculateOptimalGas
  }
};
