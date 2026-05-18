import { useState } from 'react';
import { usePublicClient } from 'wagmi';
import { type Address, type Hex, parseEventLogs } from 'viem';
import { ARBISCAN_BASE, CONTRACT_ADDRESS } from '../config';
import { NOTARY_ABI } from '../abi';

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

type Result = {
  contentHash: Hex;
  author: Address;
  timestamp: bigint;
  content: string;
  txHash: Hex;
  blockNumber: bigint;
};

export default function QueryPanel() {
  const client = usePublicClient();
  const [tx, setTx] = useState('');
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onQuery = async () => {
    setError(null);
    setResult(null);
    if (!client) return;

    let t = tx.trim();
    if (!t) return;
    if (!t.startsWith('0x')) t = '0x' + t;
    if (t.length !== 66 || !/^0x[0-9a-fA-F]{64}$/.test(t)) {
      setError('Transaction hash must be 32 bytes (0x followed by 64 hex chars).');
      return;
    }

    setLoading(true);
    try {
      const receipt = await client.getTransactionReceipt({ hash: t as Hex });
      if (receipt.status !== 'success') {
        setError('Transaction failed or was reverted on chain.');
        return;
      }

      const events = parseEventLogs({
        abi: NOTARY_ABI,
        eventName: 'Stored',
        logs: receipt.logs,
      });

      const ours = events.find(
        (e) => e.address.toLowerCase() === CONTRACT_ADDRESS.toLowerCase()
      );

      if (!ours) {
        setError(
          'This transaction did not store any content via the Notary contract. Make sure you pasted a tx hash from this site.'
        );
        return;
      }

      setResult({
        contentHash: ours.args.contentHash,
        author: ours.args.author,
        timestamp: ours.args.timestamp,
        content: ours.args.content,
        txHash: receipt.transactionHash,
        blockNumber: receipt.blockNumber,
      });
    } catch (e: any) {
      const msg = (e?.shortMessage || e?.message || '').toString();
      if (/not be found|could not be found|not found/i.test(msg)) {
        setError(
          'Transaction not found on Arbitrum One. Check the hash and the network it was sent on.'
        );
      } else {
        setError(msg || 'Query failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="panel">
      <label className="label">Transaction hash</label>
      <input
        className="input mono"
        placeholder="0x… (the tx hash from your wallet history)"
        value={tx}
        onChange={(e) => setTx(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') onQuery();
        }}
      />

      <div className="meta-row">
        <span className="meta">
          Tip: open your wallet → recent transactions → copy the transaction hash of
          the "Notary · store" call.
        </span>
      </div>

      <button
        className="btn-primary"
        disabled={loading || !tx || CONTRACT_ADDRESS === ZERO_ADDRESS}
        onClick={onQuery}
      >
        {CONTRACT_ADDRESS === ZERO_ADDRESS
          ? 'Contract not deployed yet'
          : loading
          ? 'Looking up on Arbitrum…'
          : 'Query'}
      </button>

      {error && <div className="error">{error}</div>}

      {result && (
        <div className="result">
          <div className="kv">
            <span className="k">Date (UTC)</span>
            <span className="v">
              {new Date(Number(result.timestamp) * 1000).toUTCString()}
            </span>
          </div>
          <div className="kv">
            <span className="k">Date (local)</span>
            <span className="v">
              {new Date(Number(result.timestamp) * 1000).toLocaleString()}
            </span>
          </div>
          <div className="kv">
            <span className="k">Author</span>
            <a
              className="v link mono"
              href={`${ARBISCAN_BASE}/address/${result.author}`}
              target="_blank"
              rel="noreferrer"
            >
              {result.author}
            </a>
          </div>
          <div className="kv">
            <span className="k">Tx</span>
            <a
              className="v link mono"
              href={`${ARBISCAN_BASE}/tx/${result.txHash}`}
              target="_blank"
              rel="noreferrer"
            >
              {result.txHash}
            </a>
          </div>
          <div className="kv">
            <span className="k">Content hash</span>
            <span className="v mono">{result.contentHash}</span>
          </div>
          <div className="content-box">{result.content}</div>
        </div>
      )}
    </div>
  );
}
