
import { useMemo, useState } from 'react';

export default function CampaignPacingCalculator({ config }) {
  const [totalBudget, setTotalBudget] = useState('');
  const [totalDays, setTotalDays] = useState('');
  const [daysElapsed, setDaysElapsed] = useState('');
  const [amountSpent, setAmountSpent] = useState('');
  const [results, setResults] = useState(null);

  const opts = useMemo(() => {
    const fallback = { currency: 'USD', decimals: 0 };
    if (!config || typeof config !== 'object') return fallback;
    const currency = typeof config.currency === 'string' ? config.currency : 'USD';
    const decimals = Number.isFinite(config.decimals) ? config.decimals : 0;
    return { currency, decimals };
  }, [config]);

  const formatCurrency = (value) => {
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: opts.currency,
        minimumFractionDigits: opts.decimals,
        maximumFractionDigits: opts.decimals,
      }).format(value);
    } catch (e) {
      return Number(value).toFixed(opts.decimals);
    }
  };

  const calculatePacing = () => {
    const budget = parseFloat(totalBudget);
    const duration = parseFloat(totalDays);
    const elapsed = parseFloat(daysElapsed);
    const spent = parseFloat(amountSpent);

    if (isNaN(budget) || isNaN(duration) || isNaN(elapsed) || isNaN(spent)) {
      alert('Please fill in all fields with valid numbers');
      return;
    }
    if (duration <= 0) {
      alert('Campaign duration must be greater than 0');
      return;
    }
    if (elapsed > duration) {
      alert('Days elapsed cannot be greater than campaign duration');
      return;
    }
    if (budget <= 0) {
      alert('Total budget must be greater than 0');
      return;
    }

    const targetSpend = (elapsed / duration) * budget;
    const spendVariance = spent - targetSpend;
    const percentOfBudgetSpent = (spent / budget) * 100;

    let pacingStatus = 'On Pace';
    const varianceThreshold = budget * 0.05; // 5% band

    if (spendVariance < -varianceThreshold) pacingStatus = 'Underpacing';
    else if (spendVariance > varianceThreshold) pacingStatus = 'Overpacing';

    setResults({
      targetSpend,
      spendVariance,
      percentOfBudgetSpent,
      pacingStatus,
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') calculatePacing();
  };

  return (
  <div className="pacing-widget">
    <h1>Campaign Pacing Calculator</h1>
    <div className="sub">Track and optimize your marketing spend in real time</div>

    <div className="grid">
      {/* Inputs */}
      <div>
        <div>
          <label>Total Budget</label>
          <input type="number" value={totalBudget} onChange={(e)=>setTotalBudget(e.target.value)} onKeyPress={handleKeyPress} placeholder="1000" />
        </div>

        <div style={{marginTop:12}}>
          <label>Campaign Duration (Days)</label>
          <input type="number" value={totalDays} onChange={(e)=>setTotalDays(e.target.value)} onKeyPress={handleKeyPress} placeholder="30" />
        </div>

        <div style={{marginTop:12}}>
          <label>Days Elapsed</label>
          <input type="number" value={daysElapsed} onChange={(e)=>setDaysElapsed(e.target.value)} onKeyPress={handleKeyPress} placeholder="20" />
        </div>

        <div style={{marginTop:12}}>
          <label>Amount Spent</label>
          <input type="number" value={amountSpent} onChange={(e)=>setAmountSpent(e.target.value)} onKeyPress={handleKeyPress} placeholder="400" />
        </div>

        <button className="btn" onClick={calculatePacing} style={{marginTop:12}}>
          Calculate Pacing
        </button>
      </div>

      {/* Results */}
      <div className="panel">
        {!results ? (
          <div style={{color:'#6b7280', textAlign:'center', padding:'24px 0'}}>
            Enter your campaign details and click "Calculate Pacing" to see results
          </div>
        ) : (
          <>
            <div>
              <div className="metric-label">Pacing Status</div>
              <div className="metric">{results.pacingStatus}</div>
            </div>

            <div style={{marginTop:12}}>
              <div className="metric-label">Target Spend</div>
              <div className="metric">{formatCurrency(results.targetSpend)}</div>
            </div>

            <div style={{marginTop:12}}>
              <div className="metric-label">Spend Variance</div>
              <div className="metric">{results.spendVariance >= 0 ? '+' : ''}{formatCurrency(results.spendVariance)}</div>
            </div>

            <div style={{marginTop:12}}>
              <div className="bar"><span style={{width: `${Math.min(results.percentOfBudgetSpent, 100)}%`}} /></div>
              <div style={{fontWeight:600, marginTop:8}}>
                {results.percentOfBudgetSpent.toFixed(0)}% of Budget Spent
              </div>
            </div>
          </>
        )}
      </div>
    </div>

    <div className="foot">Currency: {opts.currency} • Decimals: {opts.decimals}</div>
  </div>
);
