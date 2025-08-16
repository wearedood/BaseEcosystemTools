/**
 * Comprehensive test suite for BaseSDK
 * Testing all Base ecosystem integrations
 */

import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { ethers } from 'ethers';
import { BaseSDK, createBaseSDK, BASE_PROTOCOLS } from '../src/BaseSDK';
import { DeFiIntegrator, createDeFiIntegrator } from '../src/DeFiIntegrator';

// Mock ethers provider
jest.mock('ethers', () => ({
  ethers: {
    JsonRpcProvider: jest.fn().mockImplementation(() => ({
      getBlockNumber: jest.fn().mockResolvedValue(12345),
      getFeeData: jest.fn().mockResolvedValue({
        gasPrice: BigInt('20000000000')
      }),
      getBalance: jest.fn().mockResolvedValue(BigInt('1000000000000000000'))
    })),
    Wallet: jest.fn().mockImplementation(() => ({
      sendTransaction: jest.fn().mockResolvedValue({
        wait: jest.fn().mockResolvedValue({
          hash: '0x1234567890abcdef',
          blockNumber: 12345,
          gasUsed: BigInt('150000'),
          status: 1
        })
      })
    })),
    formatEther: jest.fn().mockReturnValue('1.0'),
    parseEther: jest.fn().mockReturnValue(BigInt('1000000000000000000'))
  }
}));

describe('BaseSDK', () => {
  let sdk: BaseSDK;
  const mockPrivateKey = '0x' + '1'.repeat(64);

  beforeEach(() => {
    sdk = createBaseSDK(mockPrivateKey);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Initialization', () => {
    it('should create SDK with default config', () => {
      const defaultSdk = createBaseSDK();
      expect(defaultSdk).toBeInstanceOf(BaseSDK);
    });

    it('should create SDK with private key', () => {
      expect(sdk).toBeInstanceOf(BaseSDK);
    });

    it('should initialize with correct Base protocols', () => {
      expect(BASE_PROTOCOLS).toHaveLength(4);
      expect(BASE_PROTOCOLS[0].name).toBe('Uniswap V3');
      expect(BASE_PROTOCOLS[1].name).toBe('Aerodrome');
      expect(BASE_PROTOCOLS[2].name).toBe('Compound V3');
      expect(BASE_PROTOCOLS[3].name).toBe('Base Bridge');
    });
  });

  describe('Network Utilities', () => {
    it('should get current block number', async () => {
      const blockNumber = await sdk.getBlockNumber();
      expect(blockNumber).toBe(12345);
    });

    it('should get current gas price', async () => {
      const gasPrice = await sdk.getGasPrice();
      expect(gasPrice).toBe(BigInt('20000000000'));
    });

    it('should get balance for address', async () => {
      const balance = await sdk.getBalance('0x1234567890123456789012345678901234567890');
      expect(balance).toBe('1.0');
    });
  });

  describe('Transaction Utilities', () => {
    it('should send transaction successfully', async () => {
      const result = await sdk.sendTransaction(
        '0x1234567890123456789012345678901234567890',
        '1.0'
      );

      expect(result.hash).toBe('0x1234567890abcdef');
      expect(result.blockNumber).toBe(12345);
      expect(result.gasUsed).toBe('150000');
      expect(result.status).toBe('success');
    });

    it('should handle transaction with data', async () => {
      const result = await sdk.sendTransaction(
        '0x1234567890123456789012345678901234567890',
        '0',
        '0x1234'
      );

      expect(result.status).toBe('success');
    });
  });

  describe('DeFi Integrations', () => {
    it('should swap tokens successfully', async () => {
      const result = await sdk.swapTokens({
        protocol: 'uniswap-v3',
        tokenIn: '0xA0b86a33E6417c8f2c8B758B2d7D2E4C2F2e2e2e',
        tokenOut: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
        amountIn: '1000000000000000000',
        slippage: 0.5
      });

      expect(result.status).toBe('success');
      expect(result.gasUsed).toBe('150000');
    });

    it('should add liquidity successfully', async () => {
      const result = await sdk.addLiquidity({
        protocol: 'uniswap-v3',
        token0: '0xA0b86a33E6417c8f2c8B758B2d7D2E4C2F2e2e2e',
        token1: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
        amount0: '1000000000000000000',
        amount1: '1000000000'
      });

      expect(result.status).toBe('success');
      expect(result.gasUsed).toBe('200000');
    });

    it('should lend asset successfully', async () => {
      const result = await sdk.lendAsset({
        protocol: 'compound-v3',
        asset: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
        amount: '1000000000'
      });

      expect(result.status).toBe('success');
      expect(result.gasUsed).toBe('180000');
    });

    it('should bridge to L1 successfully', async () => {
      const result = await sdk.bridgeToL1({
        amount: '1000000000000000000'
      });

      expect(result.status).toBe('success');
      expect(result.gasUsed).toBe('250000');
    });

    it('should throw error for unsupported protocol', async () => {
      await expect(sdk.swapTokens({
        protocol: 'unsupported',
        tokenIn: '0xA0b86a33E6417c8f2c8B758B2d7D2E4C2F2e2e2e',
        tokenOut: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
        amountIn: '1000000000000000000',
        slippage: 0.5
      })).rejects.toThrow('Protocol unsupported not supported');
    });
  });
});

describe('DeFiIntegrator', () => {
  let sdk: BaseSDK;
  let integrator: DeFiIntegrator;

  beforeEach(() => {
    sdk = createBaseSDK();
    integrator = createDeFiIntegrator(sdk);
  });

  describe('Pool Information', () => {
    it('should get pool info', async () => {
      const poolInfo = await integrator.getPoolInfo(
        '0xA0b86a33E6417c8f2c8B758B2d7D2E4C2F2e2e2e',
        '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
        3000
      );

      expect(poolInfo.token0).toBe('0xA0b86a33E6417c8f2c8B758B2d7D2E4C2F2e2e2e');
      expect(poolInfo.token1).toBe('0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913');
      expect(poolInfo.fee).toBe(3000);
      expect(poolInfo.liquidity).toBe('1000000000000000000');
    });
  });

  describe('Uniswap V3 Integration', () => {
    it('should execute exact input single swap', async () => {
      const txHash = await integrator.swapExactInputSingle({
        tokenIn: '0xA0b86a33E6417c8f2c8B758B2d7D2E4C2F2e2e2e',
        tokenOut: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
        amountIn: '1000000000000000000',
        amountOutMinimum: '990000000',
        recipient: '0x1234567890123456789012345678901234567890',
        deadline: Math.floor(Date.now() / 1000) + 3600
      });

      expect(txHash).toMatch(/^0x[a-fA-F0-9]{64}$/);
    });
  });

  describe('Aerodrome Integration', () => {
    it('should get Aerodrome routes', async () => {
      const routes = await integrator.getAerodromeRoutes(
        '0xA0b86a33E6417c8f2c8B758B2d7D2E4C2F2e2e2e',
        '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'
      );

      expect(routes).toHaveLength(1);
      expect(routes[0].from).toBe('0xA0b86a33E6417c8f2c8B758B2d7D2E4C2F2e2e2e');
      expect(routes[0].to).toBe('0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913');
    });

    it('should swap on Aerodrome', async () => {
      const routes = await integrator.getAerodromeRoutes(
        '0xA0b86a33E6417c8f2c8B758B2d7D2E4C2F2e2e2e',
        '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'
      );

      const txHash = await integrator.swapOnAerodrome(
        '1000000000000000000',
        '990000000',
        routes,
        '0x1234567890123456789012345678901234567890',
        Math.floor(Date.now() / 1000) + 3600
      );

      expect(txHash).toMatch(/^0x[a-fA-F0-9]{64}$/);
    });
  });

  describe('Liquidity Management', () => {
    it('should add liquidity', async () => {
      const txHash = await integrator.addLiquidity({
        token0: '0xA0b86a33E6417c8f2c8B758B2d7D2E4C2F2e2e2e',
        token1: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
        fee: 3000,
        tickLower: -887220,
        tickUpper: 887220,
        amount0Desired: '1000000000000000000',
        amount1Desired: '1000000000',
        amount0Min: '950000000000000000',
        amount1Min: '950000000',
        recipient: '0x1234567890123456789012345678901234567890',
        deadline: Math.floor(Date.now() / 1000) + 3600
      });

      expect(txHash).toMatch(/^0x[a-fA-F0-9]{64}$/);
    });

    it('should remove liquidity', async () => {
      const txHash = await integrator.removeLiquidity(
        12345,
        '500000000000000000',
        '475000000000000000',
        '475000000',
        Math.floor(Date.now() / 1000) + 3600
      );

      expect(txHash).toMatch(/^0x[a-fA-F0-9]{64}$/);
    });
  });

  describe('Compound V3 Integration', () => {
    it('should supply to Compound', async () => {
      const txHash = await integrator.supplyToCompound(
        '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
        '1000000000'
      );

      expect(txHash).toMatch(/^0x[a-fA-F0-9]{64}$/);
    });

    it('should borrow from Compound', async () => {
      const txHash = await integrator.borrowFromCompound(
        '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
        '500000000'
      );

      expect(txHash).toMatch(/^0x[a-fA-F0-9]{64}$/);
    });

    it('should get lending position', async () => {
      const positions = await integrator.getLendingPosition(
        '0x1234567890123456789012345678901234567890'
      );

      expect(positions).toHaveLength(1);
      expect(positions[0].supplied).toBe('1000000000000000000');
      expect(positions[0].borrowed).toBe('500000000000000000');
      expect(positions[0].healthFactor).toBe(1.5);
    });
  });

  describe('Yield Farming', () => {
    it('should stake LP tokens', async () => {
      const txHash = await integrator.stakeLPTokens(
        '0x1234567890123456789012345678901234567890',
        '1000000000000000000'
      );

      expect(txHash).toMatch(/^0x[a-fA-F0-9]{64}$/);
    });

    it('should claim rewards', async () => {
      const txHash = await integrator.claimRewards(
        '0x1234567890123456789012345678901234567890'
      );

      expect(txHash).toMatch(/^0x[a-fA-F0-9]{64}$/);
    });
  });

  describe('Portfolio Analytics', () => {
    it('should get portfolio value', async () => {
      const portfolio = await integrator.getPortfolioValue(
        '0x1234567890123456789012345678901234567890'
      );

      expect(portfolio.totalValue).toBe('10000000000000000000');
      expect(portfolio.breakdown).toHaveLength(3);
      expect(portfolio.breakdown[0].protocol).toBe('Uniswap V3');
    });

    it('should get yield summary', async () => {
      const yieldSummary = await integrator.getYieldSummary(
        '0x1234567890123456789012345678901234567890'
      );

      expect(yieldSummary.totalYield).toBe('100000000000000000');
      expect(yieldSummary.apr).toBe(0.12);
      expect(yieldSummary.positions).toHaveLength(3);
    });
  });
});

describe('Integration Tests', () => {
  let sdk: BaseSDK;
  let integrator: DeFiIntegrator;

  beforeEach(() => {
    sdk = createBaseSDK();
    integrator = createDeFiIntegrator(sdk);
  });

  it('should perform complete DeFi workflow', async () => {
    // 1. Get pool info
    const poolInfo = await integrator.getPoolInfo(
      '0xA0b86a33E6417c8f2c8B758B2d7D2E4C2F2e2e2e',
      '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
      3000
    );
    expect(poolInfo).toBeDefined();

    // 2. Swap tokens
    const swapTx = await integrator.swapExactInputSingle({
      tokenIn: '0xA0b86a33E6417c8f2c8B758B2d7D2E4C2F2e2e2e',
      tokenOut: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
      amountIn: '1000000000000000000',
      amountOutMinimum: '990000000',
      recipient: '0x1234567890123456789012345678901234567890',
      deadline: Math.floor(Date.now() / 1000) + 3600
    });
    expect(swapTx).toMatch(/^0x[a-fA-F0-9]{64}$/);

    // 3. Add liquidity
    const liquidityTx = await integrator.addLiquidity({
      token0: '0xA0b86a33E6417c8f2c8B758B2d7D2E4C2F2e2e2e',
      token1: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
      fee: 3000,
      tickLower: -887220,
      tickUpper: 887220,
      amount0Desired: '1000000000000000000',
      amount1Desired: '1000000000',
      amount0Min: '950000000000000000',
      amount1Min: '950000000',
      recipient: '0x1234567890123456789012345678901234567890',
      deadline: Math.floor(Date.now() / 1000) + 3600
    });
    expect(liquidityTx).toMatch(/^0x[a-fA-F0-9]{64}$/);

    // 4. Supply to lending protocol
    const supplyTx = await integrator.supplyToCompound(
      '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
      '1000000000'
    );
    expect(supplyTx).toMatch(/^0x[a-fA-F0-9]{64}$/);

    // 5. Get portfolio analytics
    const portfolio = await integrator.getPortfolioValue(
      '0x1234567890123456789012345678901234567890'
    );
    expect(portfolio.totalValue).toBeDefined();
  });

  // 6. Test error handling
  it('should handle network errors gracefully', async () => {
    // Mock network failure
    const mockProvider = {
      getBalance: jest.fn().mockRejectedValue(new Error('Network error')),
      getTransactionCount: jest.fn().mockRejectedValue(new Error('Network error'))
    };
    
    const integrator = createDeFiIntegrator(mockProvider);
    
    await expect(integrator.getBalance('0x123')).rejects.toThrow('Network error');
  });

  // 7. Test gas estimation
  it('should estimate gas correctly for transactions', async () => {
    const gasEstimate = await integrator.estimateGas({
      to: '0x1234567890123456789012345678901234567890',
      value: '1000000000000000000', // 1 ETH
      data: '0x'
    });
    
    expect(gasEstimate).toBeDefined();
    expect(parseInt(gasEstimate)).toBeGreaterThan(21000); // Minimum gas for transfer
  });

  // 8. Test batch operations
  it('should handle batch operations efficiently', async () => {
    const addresses = [
      '0x1234567890123456789012345678901234567890',
      '0x0987654321098765432109876543210987654321',
      '0x1111111111111111111111111111111111111111'
    ];
    
    const batchResults = await integrator.getBatchBalances(addresses);
    
    expect(batchResults).toHaveLength(3);
    batchResults.forEach(result => {
      expect(result.address).toBeDefined();
      expect(result.balance).toBeDefined();
    });
  });

  // 9. Test yield farming calculations
  it('should calculate yield farming rewards accurately', async () => {
    const position = {
      protocol: 'Compound V3',
      amount: '1000000000000000000', // 1 token
      apr: 15.5,
      duration: 365 // days
    };
    
    const rewards = await integrator.calculateYieldRewards(position);
    
    expect(rewards.totalRewards).toBeDefined();
    expect(parseFloat(rewards.totalRewards)).toBeGreaterThan(0);
    expect(rewards.dailyRewards).toBeDefined();
  });

  // 10. Test protocol integration
  it('should integrate with multiple DeFi protocols', async () => {
    const protocols = ['Uniswap V3', 'Compound V3', 'Aerodrome'];
    
    for (const protocol of protocols) {
      const protocolData = await integrator.getProtocolInfo(protocol);
      
      expect(protocolData.name).toBe(protocol);
      expect(protocolData.tvl).toBeDefined();
      expect(protocolData.supportedTokens).toBeDefined();
    }
  });
});

// Additional test suite for advanced features
describe('BaseSDK Advanced Features', () => {
  let integrator: any;

  beforeEach(() => {
    integrator = createDeFiIntegrator(mockProvider);
  });

  it('should perform cross-protocol arbitrage detection', async () => {
    const arbitrageOpportunities = await integrator.findArbitrageOpportunities([
      'Uniswap V3',
      'Aerodrome'
    ]);

    expect(arbitrageOpportunities).toBeDefined();
    if (arbitrageOpportunities.length > 0) {
      expect(arbitrageOpportunities[0].profit).toBeGreaterThan(0);
      expect(arbitrageOpportunities[0].protocols).toHaveLength(2);
    }
  });

  it('should optimize gas usage for complex transactions', async () => {
    const complexTx = {
      operations: [
        { type: 'swap', tokenA: 'USDC', tokenB: 'ETH', amount: '1000' },
        { type: 'supply', protocol: 'Compound V3', token: 'ETH', amount: '0.5' },
        { type: 'borrow', protocol: 'Compound V3', token: 'USDC', amount: '500' }
      ]
    };

    const optimizedTx = await integrator.optimizeTransaction(complexTx);

    expect(optimizedTx.estimatedGas).toBeDefined();
    expect(optimizedTx.steps).toBeDefined();
    expect(optimizedTx.steps.length).toBeGreaterThanOrEqual(complexTx.operations.length);
  });
});
