import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Header() {
  return (
    <header className="header">
      <div className="brand">
        <div className="brand-mark" />
        <span className="brand-name">Notary</span>
      </div>
      <ConnectButton showBalance={false} chainStatus="icon" />
    </header>
  );
}
