export const NOTARY_ABI = [
  {
    type: 'function',
    name: 'store',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'content', type: 'string' }],
    outputs: [{ name: 'contentHash', type: 'bytes32' }],
  },
  {
    type: 'function',
    name: 'timestampOf',
    stateMutability: 'view',
    inputs: [
      { name: 'author', type: 'address' },
      { name: 'contentHash', type: 'bytes32' },
    ],
    outputs: [{ name: '', type: 'uint64' }],
  },
  {
    type: 'function',
    name: 'MAX_LENGTH',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    type: 'event',
    name: 'Stored',
    inputs: [
      { name: 'contentHash', type: 'bytes32', indexed: true },
      { name: 'author', type: 'address', indexed: true },
      { name: 'timestamp', type: 'uint64', indexed: false },
      { name: 'content', type: 'string', indexed: false },
    ],
  },
] as const;
