# Notary — Immutable On-Chain Text Notarization on Arbitrum One

A minimal dApp that lets anyone permanently anchor a piece of text on Arbitrum One.
No owner, no admin, no upgrade path — once a record is written, it cannot be changed or deleted.

- **Write**: connect wallet → submit text → contract emits an event with the full content and records `(author, hash) → timestamp` in storage.
- **Query**: paste the content hash (optionally the author address) → frontend reads the chain directly and shows content + UTC date + author + tx link.

## Stack

- Contract: Solidity 0.8.24, single-file `contracts/Notary.sol`
- Frontend: Vite + React + TypeScript + viem + wagmi v2 + RainbowKit v2
- Hosting: GitHub Pages (static SPA, `HashRouter` not needed — single page)
- RPC: Arbitrum public RPC + Llama RPC + Ankr (fallback)

## Setup

### 1. Deploy `Notary.sol` to Arbitrum One

Any tool works. Example with Foundry:

```bash
forge create contracts/Notary.sol:Notary \
  --rpc-url https://arb1.arbitrum.io/rpc \
  --private-key $PK
```

Verify the source on Arbiscan so users can audit it.

### 2. Configure the frontend

Edit `src/config.ts`:

- `CONTRACT_ADDRESS` — the deployed Notary address
- `DEPLOY_BLOCK` — the block number of the deploy tx (bounds `getLogs`)
- `WALLET_CONNECT_PROJECT_ID` — get one free at https://cloud.walletconnect.com

### 3. Run locally

```bash
npm install
npm run dev
```

### 4. Publish to GitHub Pages

1. Create repo `notary-dapp` on GitHub (under user `jayxu7777`).
2. Push this folder.
3. In repo **Settings → Pages → Build and deployment**, set **Source** to **GitHub Actions**.
4. The included workflow at `.github/workflows/deploy.yml` will build and publish on every push to `main`.

Site URL: **https://jayxu7777.github.io/notary-dapp/**

## Design choices

| Item | Choice | Reason |
|---|---|---|
| Storage of content | event log | ~10× cheaper than SSTORE on Arb |
| Existence index | `mapping(author => hash => timestamp)` | O(1) lookup, prevents duplicate per author |
| Uniqueness | `(author, hash)` | different addresses can independently notarize same text |
| Length cap | 10,000 bytes | covers 99% of text use, caps single-tx cost |
| Protocol fee | none | only Arb gas |
| Mutability | none — no owner, no upgrade, no selfdestruct | true permanence |
| Indexing | client-side `getLogs` | no backend, no The Graph |
| Hosting | GitHub Pages | free, durable, neutral |

## Warning

Anything you store is **public and permanent**. Do not paste private keys, passwords, or content you may want to retract later.
