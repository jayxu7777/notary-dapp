// ----- DEPLOY-TIME CONFIG -----
// After deploying contracts/Notary.sol on Arbitrum One, fill these in
// and commit. The dApp is otherwise self-contained.

import type { Address } from 'viem';

// Contract address of the deployed Notary on Arbitrum One.
// Leave as the zero address before deployment — UI will show a banner.
export const CONTRACT_ADDRESS: Address = '0x0000000000000000000000000000000000000000';

// Block number at which the contract was deployed.
// Used to bound getLogs queries (Arbitrum RPCs cap large ranges).
export const DEPLOY_BLOCK: bigint = 0n;

// Get one for free at https://cloud.walletconnect.com — required for WalletConnect.
// Injected wallets (MetaMask, Rabby) work without it.
export const WALLET_CONNECT_PROJECT_ID = 'YOUR_WALLETCONNECT_PROJECT_ID';

export const ARBISCAN_BASE = 'https://arbiscan.io';
export const MAX_LENGTH = 10_000;
