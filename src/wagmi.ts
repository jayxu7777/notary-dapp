import { fallback, http } from 'viem';
import { arbitrum } from 'wagmi/chains';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { WALLET_CONNECT_PROJECT_ID } from './config';

export const wagmiConfig = getDefaultConfig({
  appName: 'Notary',
  projectId: WALLET_CONNECT_PROJECT_ID,
  chains: [arbitrum],
  transports: {
    // publicnode is first because the official Arb RPC caps eth_getLogs at
    // ~128 blocks per request, which breaks the Query feature once the
    // contract is more than a couple minutes old. publicnode has no such cap.
    [arbitrum.id]: fallback([
      http('https://arbitrum-one-rpc.publicnode.com'),
      http('https://arb1.arbitrum.io/rpc'),
    ]),
  },
  ssr: false,
});
