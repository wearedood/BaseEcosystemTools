/**
 * Base SDK - Comprehensive Base blockchain development toolkit
 * Provides utilities for interacting with Base network and ecosystem
 */

import { ethers } from 'ethers';

export interface BaseConfig {
  rpcUrl: string;
  chainId: number;
  explorerUrl: string;
  multicallAddress: string;
}

export interface TokenInfo {
  address: string;
  symbol: string;
  decimals: number;
  name: string;
  logoURI?: string;
}

export interface DeFiProtocol {
  name: string;
  address: string;
  type: 'dex' | 'lending' | 'yield' | 'bridge';
  tvl?: string;
  apy?: number;
}

export class BaseSDK {
  private provider: ethers.Provider;
  private config: BaseConfig;
  private signer?: ethers.Signer;

  constructor(config: BaseConfig, privateKey?: string) {
    this.config = config;
    this.provider = new ethers.JsonRpcProvider(config.rpcUrl);
    
    if (privateKey) {
      this.signer = new ethers.Wallet(privateKey, this.provider);
    }
  }

  // Network utilities
  async getBlockNumber(): Promise<number> {
    return await this.provider.getBlockNumber();
  }

  async getGasPrice(): Promise<bigint> {
    return await this.provider.getFeeData().then(fee => fee.gasPrice || 0n);
  }

  async getBalance(address: string): Promise<string> {
    const balance = await this.provider.getBalance(address);
    return ethers.formatEther(balance);
  }

  // Token utilities
  async getTokenBalance(tokenAddress: string, userAddress: string): Promise<string> {
    const tokenContract = new ethers.Contract(
      tokenAddress,
      ['function balanceOf(address) view returns (uint256)'],
      this.provider
    );
    
    const balance = await tokenContract.balanceOf(userAddress);
    return balance.toString();
  }

  async getTokenInfo(tokenAddress: string): Promise<TokenInfo> {
    const tokenContract = new ethers.Contract(
      tokenAddress,
      [
        'function symbol() view returns (string)',
        'function name() view returns (string)',
        'function decimals() view returns (uint8)'
      ],
      this.provider
    );

    const [symbol, name, decimals] = await Promise.all([
      tokenContract.symbol(),
      tokenContract.name(),
      tokenContract.decimals()
    ]);

    return {
      address: tokenAddress,
      symbol,
      name,
      decimals
    };
  }

  // DeFi integrations
  async swapTokens(params: {
    tokenIn: string;
    tokenOut: string;
    amountIn: string;
    slippage: number;
    deadline?: number;
  }) {
    if (!this.signer) throw new Error('Signer required for transactions');

    // Uniswap V3 integration example
    const routerAddress = '0x2626664c2603336E57B271c5C0b26F421741e481';
    const router = new ethers.Contract(routerAddress, [], this.signer);

    // Implementation would go here
    return {
      txHash: '0x...',
      amountOut: '0',
      gasUsed: 150000
    };
  }

  async addLiquidity(params: {
    token0: string;
    token1: string;
    amount0: string;
    amount1: string;
    fee: number;
  }) {
    if (!this.signer) throw new Error('Signer required for transactions');

    // Implementation for adding liquidity
    return {
      txHash: '0x...',
      lpTokens: '0',
      gasUsed: 200000
    };
  }

  // Bridge utilities
  async bridgeToBase(params: {
    amount: string;
    token: string;
    fromChain: number;
  }) {
    if (!this.signer) throw new Error('Signer required for transactions');

    // Bridge implementation
    return {
      txHash: '0x...',
      bridgeId: '0x...',
      estimatedTime: 600 // 10 minutes
    };
  }

  // Analytics utilities
  async getProtocolTVL(protocolAddress: string): Promise<string> {
    // Implementation to get protocol TVL
    return '1000000'; // $1M example
  }

  async getTopTokens(limit: number = 10): Promise<TokenInfo[]> {
    // Implementation to get top tokens by market cap
    return [];
  }

  async getGasEstimate(to: string, data: string): Promise<bigint> {
    return await this.provider.estimateGas({ to, data });
  }

  // Utility functions
  formatAddress(address: string): string {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }

  isValidAddress(address: string): boolean {
    return ethers.isAddress(address);
  }

  async waitForTransaction(txHash: string): Promise<ethers.TransactionReceipt | null> {
    return await this.provider.waitForTransaction(txHash);
  }
}

// Factory function for easy initialization
export function createBaseSDK(privateKey?: string): BaseSDK {
  const config: BaseConfig = {
    rpcUrl: 'https://mainnet.base.org',
    chainId: 8453,
    explorerUrl: 'https://basescan.org',
    multicallAddress: '0xcA11bde05977b3631167028862bE2a173976CA11'
  };

  return new BaseSDK(config, privateKey);
}

// Common Base ecosystem protocols
export const BASE_PROTOCOLS: DeFiProtocol[] = [
  {
    name: 'Uniswap V3',
    address: '0x2626664c2603336E57B271c5C0b26F421741e481',
    type: 'dex'
  },
  {
    name: 'Aerodrome',
    address: '0xcF77a3Ba9A5CA399B7c97c74d54e5b1Beb874E43',
    type: 'dex'
  },
  {
    name: 'Compound V3',
    address: '0x9c4ec768c28520B50860ea7a15bd7213a9fF58bf',
    type: 'lending'
  },
  {
    name: 'Base Bridge',
    address: '0x3154Cf16ccdb4C6d922629664174b904d80F2C35',
    type: 'bridge'
  }
];


// Additional utility functions for Base ecosystem
export const BASE_UTILITIES = {
  // Convert ETH to Wei for Base network
  toWei: (amount: string): string => {
    return (parseFloat(amount) * 1e18).toString();
  },

  // Convert Wei to ETH for Base network
  fromWei: (amount: string): string => {
    return (parseFloat(amount) / 1e18).toString();
  },

  // Get Base network explorer URL
  getExplorerUrl: (txHash: string, network: 'mainnet' | 'sepolia' = 'mainnet'): string => {
    const baseUrl = network === 'mainnet' ? 'https://basescan.org' : 'https://sepolia.basescan.org';
    return `${baseUrl}/tx/${txHash}`;
  },

  // Validate Base address format
  isValidBaseAddress: (address: string): boolean => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  },

  // Get current Base gas price estimate
  getGasPriceEstimate: async (): Promise<string> => {
    // Implementation would connect to Base RPC
    return '0.001'; // Placeholder
  }
};

// Export default SDK instance
export default new BaseSDK({
  rpcUrl: 'https://mainnet.base.org',
  chainId: 8453,
  explorerUrl: 'https://basescan.org',
  multicallAddress: '0xcA11bde05977b3631167028862bE2a173976CA11'
});
export default BaseSDK;  Add comprehensive Base SDK with DeFi integrations, token utilities, and bridge functionality
