import { useState } from 'react';
import { usePublicClient } from 'wagmi';
import { type Address, type Hex, getAddress, parseAbiItem } from 'viem';
import { ARBISCAN_BASE, CONTRACT_ADDRESS, DEPLOY_BLOCK } from '../config';

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

type Result = {
  contentHash: Hex;
  author: Address;
  timestamp: bigint;
  content: string;
  txHash: Hex;
  blockNumber: bigint;
};

const STORED_EVENT = parseAbiItem(
  'event Stored(bytes32 indexed contentHash, address indexed author, uint64 timestamp, string content)'
);

export default function QueryPanel() {
  const client = usePublicClient();
  const [hash, setHash] = useState('');
  const [author, setAuthor] = useState('');
  const [results, setResults] = useState<Result[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onQuery = async () => {
    setError(null);
    setResults(null);
    if (!client) return;

    let h = hash.trim();
    if (!h) return;
    if (!h.startsWith('0x')) h = '0x' + h;
    if (h.length !== 66 || !/^0x[0-9a-fA-F]{64}$/.test(h)) {
      setError('Hash must be 32 bytes (0x followed by 64 hex chars).');
      return;
    }

    let authorArg: Address | undefined;
    if (author.trim()) {
      try {
        authorArg = getAddress(author.trim());
      } catch {
        setError('Invalid author address.');
        return;
      }
    }

    setLoading(true);
    try {
      const logs = await client.getLogs({
        address: CONTRACT_ADDRESS,
        event: STORED_EVENT,
        args: {
          contentHash: h as Hex,
          ...(authorArg ? { author: authorArg } : {}),
        },
        fromBlock: DEPLOY_BLOCK,
        toBlock: 'latest',
      });

      const parsed: Result[] = logs.map((log) => ({
        contentHash: log.args.contentHash!,
        author: log.args.author!,
        timestamp: log.args.timestamp!,
        content: log.args.content!,
        txHash: log.transactionHash,
        blockNumber: log.blockNumber,
      }));
      setResults(parsed);
    } catch (e: any) {
      setError(e?.shortMessage || e?.message || 'Query failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="panel">
      <label className="label">Content hash</label>
      <input
        className="input mono"
        placeholder="0x… (32-byte keccak256 of the content)"
        value={hash}
        onChange={(e) => setHash(e.target.value)}
      />

      <label className="label">Author address (optional)</label>
      <input
        className="input mono"
        placeholder="0x… (filter by who submitted)"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
      />

      <button
        className="btn-primary"
        disabled={loading || !hash || CONTRACT_ADDRESS === ZERO_ADDRESS}
        onClick={onQuery}
      >
        {CONTRACT_ADDRESS === ZERO_ADDRESS
          ? 'Contract not deployed yet'
          : loading
          ? 'Searching…'
          : 'Query'}
      </button>

      {error && <div className="error">{error}</div>}

      {results && results.length === 0 && (
        <div className="empty">No record found for this hash.</div>
      )}

      {results &&
        results.map((r, i) => (
          <div key={i} className="result">
            <div className="kv">
              <span className="k">Date (UTC)</span>
              <span className="v">{new Date(Number(r.timestamp) * 1000).toUTCString()}</span>
            </div>
            <div className="kv">
              <span className="k">Date (local)</span>
              <span className="v">{new Date(Number(r.timestamp) * 1000).toLocaleString()}</span>
            </div>
            <div className="kv">
              <span className="k">Author</span>
              <a
                className="v link mono"
                href={`${ARBISCAN_BASE}/address/${r.author}`}
                target="_blank"
                rel="noreferrer"
              >
                {r.author}
              </a>
            </div>
            <div className="kv">
              <span className="k">Tx</span>
              <a
                className="v link mono"
                href={`${ARBISCAN_BASE}/tx/${r.txHash}`}
                target="_blank"
                rel="noreferrer"
              >
                {r.txHash}
              </a>
            </div>
            <div className="kv">
              <span className="k">Hash</span>
              <span className="v mono">{r.contentHash}</span>
            </div>
            <div className="content-box">{r.content}</div>
          </div>
        ))}
    </div>
  );
}
