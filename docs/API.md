# BaseEcosystemTools API Documentation

Comprehensive API documentation for the BaseEcosystemTools SDK.

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Core Classes](#core-classes)
- [Interfaces](#interfaces)
- [Utilities](#utilities)
- [Examples](#examples)

## Installation

```bash
npm install base-ecosystem-tools
```

## Quick Start

```typescript
import BaseEcosystemToolkit, { BaseSDK } from 'base-ecosystem-tools';

// Initialize the toolkit
const toolkit = new BaseEcosystemToolkit(8453); // Base mainnet
await toolkit.initialize();

// Or use the default SDK instance
import sdk from 'base-ecosystem-tools';
```

## Core Classes

### BaseSDK

The main SDK class for interacting with Base blockchain.

#### Constructor

```typescript
new BaseSDK(config: BaseConfig)
```

#### Methods

##### `getProtocolTVL(protocolAddress: string): Promise<string>`

Retrieve the Total Value Locked (TVL) for a specific protocol.

**Parameters:**
- `protocolAddress` (string): The contract address of the protocol

**Returns:** Promise<string> - TVL in USD

##### `getTopTokens(limit?: number): Promise<TokenInfo[]>`

Get top tokens by market cap on Base network.

**Parameters:**
- `limit` (number, optional): Maximum number of tokens to return (default: 10)

**Returns:** Promise<TokenInfo[]> - Array of token information

##### `swapTokens(params: SwapParams): Promise<TransactionResult>`

Execute a token swap through supported DEX protocols.

**Parameters:**
- `params` (SwapParams): Swap configuration object

**Returns:** Promise<TransactionResult> - Transaction details

##### `bridgeToL1(params: BridgeParams): Promise<TransactionResult>`

Bridge assets from Base to Ethereum L1.

**Parameters:**
- `params` (BridgeParams): Bridge configuration object

**Returns:** Promise<TransactionResult> - Transaction details

## Interfaces

### BaseConfig

```typescript
interface BaseConfig {
  rpcUrl: string;
  chainId: number;
  explorerUrl: string;
  multicallAddress: string;
}
```

### TokenInfo

```typescript
interface TokenInfo {
  address: string;
  symbol: string;
  decimals: number;
  name: string;
  logoURI: string;
}
```

### DeFiProtocol

```typescript
interface DeFiProtocol {
  name: string;
  address: string;
  abi: any[];
  type: 'dex' | 'lending' | 'yield' | 'bridge' | 'derivatives';
}
```

### TransactionResult

```typescript
interface TransactionResult {
  hash: string;
  blockNumber: number;
  gasUsed: string;
  status: 'success' | 'failed';
  timestamp: number;
}
```

## Utilities

### BASE_UTILITIES

Utility functions for Base ecosystem development.

#### `toWei(amount: string): string`

Convert ETH amount to Wei.

#### `fromWei(amount: string): string`

Convert Wei amount to ETH.

#### `getExplorerUrl(txHash: string, network?: 'mainnet' | 'sepolia'): string`

Generate explorer URL for transaction.

#### `isValidBaseAddress(address: string): boolean`

Validate Ethereum address format.

#### `getGasPriceEstimate(): Promise<string>`

Get current gas price estimate for Base network.

## Examples

### Getting Protocol TVL

```typescript
import { BaseSDK } from 'base-ecosystem-tools';

const sdk = new BaseSDK({
  rpcUrl: 'https://mainnet.base.org',
  chainId: 8453,
  explorerUrl: 'https://basescan.org',
  multicallAddress: '0xcA11bde05977b3631167028862bE2a173976CA11'
});

const tvl = await sdk.getProtocolTVL('0x...');
console.log(`Protocol TVL: $${tvl}`);
```

### Token Swapping

```typescript
const swapResult = await sdk.swapTokens({
  protocol: 'uniswap-v3',
  tokenIn: '0x...',
  tokenOut: '0x...',
  amountIn: '1000000000000000000', // 1 ETH in wei
  slippage: 0.5,
  recipient: '0x...'
});

console.log('Swap completed:', swapResult.hash);
```

### Bridging to L1

```typescript
const bridgeResult = await sdk.bridgeToL1({
  amount: '500000000000000000', // 0.5 ETH
  recipient: '0x...'
});

console.log('Bridge transaction:', bridgeResult.hash);
```

## Error Handling

All SDK methods may throw errors. Always wrap calls in try-catch blocks:

```typescript
try {
  const result = await sdk.swapTokens(params);
  console.log('Success:', result);
} catch (error) {
  console.error('Swap failed:', error.message);
}
```

## Support

For issues and questions:
- GitHub Issues: [BaseEcosystemTools Issues](https://github.com/wearedood/BaseEcosystemTools/issues)
- Documentation: [Full Documentation](https://docs.baseecosystemtools.com)

## License

MIT License - see LICENSE file for details.
