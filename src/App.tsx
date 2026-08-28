import { useState } from 'react';
import Header from './components/Header';
import WritePanel from './components/WritePanel';
import QueryPanel from './components/QueryPanel';
import Guide from './components/Guide';
import { CONTRACT_ADDRESS } from './config';

type Tab = 'write' | 'query';

export default function App() {
  // Deep link: /?tx=0x… opens the Query tab with the hash pre-filled (QueryPanel
  // reads the same param and auto-runs the lookup).
  const [tab, setTab] = useState<Tab>(() =>
    new URLSearchParams(window.location.search).has('tx') ? 'query' : 'write'
  );
  const notDeployed = CONTRACT_ADDRESS === '0x0000000000000000000000000000000000000000';

  return (
    <div className="app">
      <Header />

      <main className="main">
        <section className="hero">
          <h1 className="hero-title">
            <span className="gradient-text">Immutable</span> on-chain notarization
          </h1>
          <p className="hero-sub">
            Anchor any text permanently on Arbitrum One. No owner, no admin, no upgrade —
            once written, it cannot be changed or deleted.
          </p>
        </section>

        {notDeployed && (
          <div className="warning">
            Contract is not configured yet. Deploy <code>contracts/Notary.sol</code> and
            set <code>CONTRACT_ADDRESS</code> + <code>DEPLOY_BLOCK</code> in{' '}
            <code>src/config.ts</code>.
          </div>
        )}

        <div className="tabs">
          <button
            className={`tab ${tab === 'write' ? 'tab-active' : ''}`}
            onClick={() => setTab('write')}
          >
            Write
          </button>
          <button
            className={`tab ${tab === 'query' ? 'tab-active' : ''}`}
            onClick={() => setTab('query')}
          >
            Query
          </button>
        </div>

        <div className="card">{tab === 'write' ? <WritePanel /> : <QueryPanel />}</div>

        <Guide />
      </main>

      <footer className="footer">
        <span>Notary · Arbitrum One · </span>
        <a
          href="https://github.com/jayxu7777/notary-dapp"
          target="_blank"
          rel="noreferrer"
        >
          source on GitHub
        </a>
      </footer>
    </div>
  );
}
