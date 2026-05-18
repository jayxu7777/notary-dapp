export default function Guide() {
  return (
    <section className="guide">
      <h2 className="guide-title">How it works</h2>

      <div className="guide-grid">
        <div className="guide-card">
          <div className="guide-num">01</div>
          <h3>Connect</h3>
          <p>
            Click <b>Connect Wallet</b> in the top right. MetaMask, Rabby, and any
            WalletConnect-compatible wallet works. Make sure your wallet is on the{' '}
            <b>Arbitrum One</b> network.
          </p>
        </div>

        <div className="guide-card">
          <div className="guide-num">02</div>
          <h3>Write</h3>
          <p>
            Type any text in the editor. The page shows a live <b>byte counter</b> and
            the <b>keccak256 hash</b> preview. Click <b>Store on Arbitrum</b> and approve
            the transaction in your wallet. You pay only the Arbitrum gas fee — no
            protocol fee.
          </p>
        </div>

        <div className="guide-card">
          <div className="guide-num">03</div>
          <h3>Confirm</h3>
          <p>
            Once the transaction is mined, the content is permanently anchored on
            Arbitrum One. The <b>transaction hash</b> is saved automatically in your
            wallet's recent activity — that is how you retrieve the record later.
          </p>
        </div>

        <div className="guide-card">
          <div className="guide-num">04</div>
          <h3>Query</h3>
          <p>
            Switch to the <b>Query</b> tab, paste a transaction hash (from your wallet
            history or anyone else's tx that called this contract). The page reads the
            chain directly and shows the original text, the UTC timestamp, the author
            address, and a link to the on-chain transaction.
          </p>
        </div>
      </div>

      <h2 className="guide-title">FAQ</h2>

      <details className="faq">
        <summary>Is the content really permanent?</summary>
        <p>
          Yes. The Notary contract has no owner, no upgrade mechanism, no selfdestruct,
          and no delegatecall. As long as Arbitrum One exists, the data exists. Even if
          this website disappears, anyone can read the contract directly on Arbiscan or
          through any Arbitrum RPC.
        </p>
      </details>

      <details className="faq">
        <summary>Can I delete or edit a record?</summary>
        <p>
          No. That is the entire point. Treat anything you store as <b>public and
          forever</b>. Do not paste private keys, passwords, or content you may later
          regret.
        </p>
      </details>

      <details className="faq">
        <summary>How much does it cost?</summary>
        <p>
          You pay only Arbitrum gas. Cost scales with content length — a few cents for
          short text, around $0.20 for ~3,000 characters. The hard cap is 10,000 bytes
          per record.
        </p>
      </details>

      <details className="faq">
        <summary>Can two people store the same text?</summary>
        <p>
          Yes. Uniqueness is enforced per <code>(author, hash)</code>. Different
          addresses can each independently notarize the same text with their own
          timestamps. The same address cannot store the same content twice.
        </p>
      </details>

      <details className="faq">
        <summary>Is my wallet address public?</summary>
        <p>
          Yes. Every record stores the author address. If you need anonymity, use a
          fresh wallet that has not been linked to your identity.
        </p>
      </details>

      <details className="faq">
        <summary>What if I lose the transaction hash?</summary>
        <p>
          Open your wallet → activity / recent transactions. Every notarization shows
          up as a "Contract Interaction · store" entry — click it to see the
          transaction hash. You can also browse all records of the Notary contract on
          Arbiscan.
        </p>
      </details>

      <details className="faq">
        <summary>What is the "content hash" shown in results?</summary>
        <p>
          It is <code>keccak256(content)</code> — a cryptographic fingerprint of the
          text. Anyone can recompute it from the original text and check that it
          matches the on-chain record, proving the text has not been altered.
        </p>
      </details>

      <details className="faq">
        <summary>Why Arbitrum and not Ethereum mainnet?</summary>
        <p>
          Same security model (Arbitrum One inherits L1 security via fraud proofs) at a
          fraction of the cost. Storing a paragraph of text on L1 mainnet would cost
          tens of dollars; on Arbitrum it costs cents.
        </p>
      </details>
    </section>
  );
}
