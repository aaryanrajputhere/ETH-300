import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { RefreshCw, Activity, Clock, Users, PieChart } from 'lucide-react';
import './index.css';

const TOTAL_ETH = 0.1301;
const TOTAL_COST = 269.04; // Total fiat invested
const DIVISION = {
  irfan: { parts: 20, name: 'Irfan', color: '#10b981' }, // Emerald
  aaryan: { parts: 3, name: 'Aaryan', color: '#6366f1' }, // Indigo
  kanda: { parts: 2, name: 'Kanda', color: '#f59e0b' }, // Amber
};
const TOTAL_PARTS = 25;

function App() {
  const [ethData, setEthData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [isINR, setIsINR] = useState(false);

  const fetchEthPrice = async () => {
    setLoading(true);
    setError(null);
    try {
      // Connects to our local Express backend
      const response = await axios.get('http://localhost:5000/api/eth-price');
      setEthData(response.data);
      setLastUpdate(new Date().toLocaleTimeString());
    } catch (err) {
      console.error(err);
      setError('Failed to fetch Ethereum price. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEthPrice();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchEthPrice, 30000);
    return () => clearInterval(interval);
  }, []);

  const currentPriceRaw = ethData?.price ? parseFloat(ethData.price) : 0;
  const inrRate = ethData?.inrRate || 83.5;
  const currentPrice = isINR ? currentPriceRaw * inrRate : currentPriceRaw;
  const totalCost = isINR ? TOTAL_COST * inrRate : TOTAL_COST;
  const portfolioValue = currentPriceRaw * TOTAL_ETH * (isINR ? inrRate : 1);
  const totalProfit = portfolioValue - totalCost;
  const profitPercentage = portfolioValue > 0 ? ((portfolioValue - totalCost) / totalCost) * 100 : 0;
  const isProfit = totalProfit >= 0;

  const currSym = isINR ? '₹' : '$';
  const locale = isINR ? 'en-IN' : 'en-US';

  const buyDate = new Date('2026-02-09');
  const now = new Date();
  let monthsPassed = (now.getFullYear() - buyDate.getFullYear()) * 12 + now.getMonth() - buyDate.getMonth();
  if (now.getDate() < buyDate.getDate()) {
    monthsPassed--;
  }

  return (
    <div className="animate-slide-up">
      <div className="glass-card">
        
        <header className="app-header" style={{ justifyContent: 'space-between', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div className="eth-logo">
              <svg width="24" height="24" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.925 23.969L15.812 24.08V31.81L15.925 32L26.31 16.326L15.925 23.969Z" fill="#8A92B2"/>
                <path d="M15.925 32V23.968L5.54102 16.326L15.925 32Z" fill="#62688F"/>
                <path d="M15.925 21.696L16.012 21.619V14.152L15.925 14.256L6.09668 18.232L15.925 21.696Z" fill="#454A75"/>
                <path d="M15.925 21.696L25.753 18.232L15.925 14.256V21.696Z" fill="#8A92B2"/>
                <path d="M15.925 0L15.754 0.58V12.753L15.925 12.923L26.347 16.666L15.925 0Z" fill="#8A92B2"/>
                <path d="M15.925 0L5.50391 16.666L15.925 12.923V0Z" fill="#454A75"/>
              </svg>
            </div>
            <h1 className="app-title">300 ETH Investment</h1>
          </div>
          <button 
            onClick={() => setIsINR(!isINR)} 
            style={{ 
              background: 'transparent', border: '1px solid var(--border-color)', 
              color: 'var(--text-primary)', padding: '0.4rem 0.8rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem'
            }}
          >
            {isINR ? 'Switch to USD' : 'Switch to INR'}
          </button>
        </header>

        {error && <div className="error-msg">{error}</div>}

        <div className="price-container">
          <span className="price-label">Current ETH Price</span>
          <div className="price-value">
            <span className="currency-symbol">{currSym}</span>
            {loading && !ethData ? (
              <span className="animate-pulse">---.--</span>
            ) : (
              <span>
                {currentPrice.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            )}
          </div>
          
          {ethData?.isMock && (
            <div className="mock-badge">
              Demo Mode (Using mock data)
            </div>
          )}
        </div>

        <div className="portfolio-section">
          <div className="portfolio-header">
            <PieChart size={20} className="text-accent" />
            <h2>Portfolio Breakdown</h2>
          </div>
          
          <div className="total-holdings">
            <div className="holdings-main">
              <span className="holdings-label">Total Holdings ({TOTAL_ETH} ETH)</span>
              <span className="holdings-value">{currSym}{portfolioValue.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem', display: 'block' }}>
                Bought 9 Feb 2026 ({monthsPassed > 0 ? `${monthsPassed} months ago` : 'less than a month ago'})
              </span>
            </div>
            {currentPrice > 0 && (
              <div className={`gain-box ${isProfit ? 'profit-positive' : 'profit-negative'}`}>
                <span className="gain-value">
                  {isProfit ? '+' : '-'}{currSym}{Math.abs(totalProfit).toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span className="gain-pct">
                  ({isProfit ? '+' : ''}{profitPercentage.toFixed(2)}%)
                </span>
              </div>
            )}
          </div>

          <div className="holdings-list">
            {Object.keys(DIVISION).map((key) => {
              const person = DIVISION[key];
              const ethAmount = (TOTAL_ETH * person.parts) / TOTAL_PARTS;
              const usdAmountRaw = ethAmount * currentPriceRaw;
              const usdAmount = isINR ? usdAmountRaw * inrRate : usdAmountRaw;
              const personCostRaw = (person.parts / TOTAL_PARTS) * TOTAL_COST;
              const personCost = isINR ? personCostRaw * inrRate : personCostRaw;
              const personProfit = usdAmount - personCost;
              const percentage = (person.parts / TOTAL_PARTS) * 100;
              
              return (
                <div key={key} className="holding-item">
                  <div className="holding-info">
                    <div className="avatar" style={{ overflow: 'hidden', padding: 0 }}>
                      <img src={`/imgs/${key}.jpeg`} alt={person.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div className="holding-details">
                      <span className="person-name">{person.name}</span>
                      <span className="person-eth">{ethAmount.toFixed(4)} ETH ({percentage}%)</span>
                    </div>
                  </div>
                  <div className="holding-value-container">
                    <div className="holding-value">
                      {currSym}{usdAmount.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    {currentPrice > 0 && (
                      <div className={`person-gain ${personProfit >= 0 ? 'text-profit' : 'text-loss'}`}>
                        {personProfit >= 0 ? '+' : '-'}{currSym}{Math.abs(personProfit).toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <button 
          className="btn-refresh" 
          onClick={fetchEthPrice} 
          disabled={loading}
        >
          <RefreshCw className={loading ? 'spinner' : ''} size={20} />
          {loading ? 'Fetching...' : 'Update Price'}
        </button>

        <div className="info-row">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity size={16} />
            <span>24h Vol: Live</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={16} />
            <span>Updated: {lastUpdate || '--:--'}</span>
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;
