import { useMemo, useState } from 'react';
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { keccak256, stringToBytes } from 'viem';
import { ARBISCAN_BASE, CONTRACT_ADDRESS, MAX_LENGTH } from '../config';
import { NOTARY_ABI } from '../abi';

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export default function WritePanel() {
  const { address, isConnected } = useAccount();
  const [text, setText] = useState('');
  const { writeContract, data: txHash, isPending, error, reset } = useWriteContract();
  const { isLoading: confirming, isSuccess: confirmed } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  const byteLen = useMemo(() => new TextEncoder().encode(text).length, [text]);
  const hash = useMemo(() => (text ? keccak256(stringToBytes(text)) : null), [text]);
  const tooLong = byteLen > MAX_LENGTH;
  const contractMissing = CONTRACT_ADDRESS === ZERO_ADDRESS;

  const onSubmit = () => {
    if (!text || tooLong || contractMissing) return;
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: NOTARY_ABI,
      functionName: 'store',
      args: [text],
    });
  };

  return (
    <div className="panel">
      <label className="label">Content</label>
      <textarea
        className="textarea"
        placeholder="Type any text. Once stored on Arbitrum, it is public and permanent."
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={10}
      />

      <div className="meta-row">
        <span className={tooLong ? 'meta-error' : 'meta'}>
          {byteLen.toLocaleString()} / {MAX_LENGTH.toLocaleString()} bytes
        </span>
        {hash && (
          <span className="meta mono" title={hash}>
            hash: {hash.slice(0, 10)}…{hash.slice(-8)}
          </span>
        )}
      </div>

      <button
        className="btn-primary"
        disabled={
          contractMissing ||
          !isConnected ||
          !text ||
          tooLong ||
          isPending ||
          confirming
        }
        onClick={onSubmit}
      >
        {contractMissing
          ? 'Contract not deployed yet'
          : !isConnected
          ? 'Connect wallet to write'
          : isPending
          ? 'Confirm in wallet…'
          : confirming
          ? 'Waiting for confirmation…'
          : 'Store on Arbitrum'}
      </button>

      {error && <div className="error">{error.message.split('\n')[0]}</div>}

      {confirmed && txHash && (
        <div className="success">
          <div className="success-title">Stored ✓</div>
          <div className="kv">
            <span className="k">Author</span>
            <span className="v mono">{address}</span>
          </div>
          <div className="kv">
            <span className="k">Content hash</span>
            <span className="v mono">{hash}</span>
          </div>
          <div className="kv">
            <span className="k">Tx</span>
            <a
              className="v link mono"
              href={`${ARBISCAN_BASE}/tx/${txHash}`}
              target="_blank"
              rel="noreferrer"
            >
              {txHash.slice(0, 10)}…{txHash.slice(-8)}
            </a>
          </div>
          <button
            className="btn-link"
            onClick={() => {
              reset();
              setText('');
            }}
          >
            Write another
          </button>
        </div>
      )}
    </div>
  );
}
