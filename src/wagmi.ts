import { fallback, http } from 'viem';
import { arbitrum } from 'wagmi/chains';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { WALLET_CONNECT_PROJECT_ID } from './config';

export const wagmiConfig = getDefaultConfig({
  appName: 'Notary',
  projectId: WALLET_CONNECT_PROJECT_ID,
  chains: [arbitrum],
  transports: {
    [arbitrum.id]: fallback([
      http('https://arb1.arbitrum.io/rpc'),
      http('https://arbitrum.llamarpc.com'),
      http('https://rpc.ankr.com/arbitrum'),
    ]),
  },
  ssr: false,
});
