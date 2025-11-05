
import { useMemo, useState } from 'react';

export default function CampaignPacingCalculator({ config }) {
  // state
  const [totalBudget, setTotalBudget] = useState('');
  const [totalDays, setTotalDays] = useState('');
  const [daysElapsed, setDaysElapsed] = useState('');
  const [amountSpent, setAmountSpent] = useState('');
  const [errors, setErrors] = useState({});
  const [results, setResults] = useState(null);

  // config (USD / whole dollars)
  const opts = useMemo(() => ({ currency: (config?.currency || 'USD'), decimals: 0 }), [config]);

  // helpers
  const toWhole = (v) => {
    if (v === '' || v === null || v === undefined) return '';
    const n = Math.max(0, Math.floor(Number(v)));
    return Number.isFinite(n) ? String(n) : '';
  };
  const fmt = (v) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: opts.currency, minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(Math.round(v));

  // realtime validation
  const validate = (vals) => {
    const e = {};
    const budget = parseInt(vals.totalBudget, 10);
    const duration = parseInt(vals.totalDays, 10);
    const elapsed = parseInt(vals.daysElapsed, 10);
    const spent = parseInt(vals.amountSpent, 10);

    if (!budget || budget <= 0) e.totalBudget = 'Please enter a valid budget';
    if (!duration || duration <= 0) e.totalDays = 'Please enter campaign duration';
    if (Number.isNaN(elapsed) || elapsed < 0) e.daysElapsed = 'Please enter days elapsed';
    if (Number.isNaN(spent) || spent < 0) e.amountSpent = 'Please enter amount spent';

    if (!e.totalDays && !Number.isNaN(elapsed) && elapsed > duration) e.daysElapsed = "Days Elapsed can't exceed Duration";
    if (!e.totalBudget && !Number.isNaN(spent) && spent > budget) e.amountSpent = "Amount Spent can't exceed Budget";

    return e;
  };

  const handleChange = (key) => (ev) => {
    const raw = ev.target.value;
    const next = {
      totalBudget,
      totalDays,
      daysElapsed,
      amountSpent,
      [key]: toWhole(raw),
    };
    // update state
    if (key === 'totalBudget') setTotalBudget(next.totalBudget);
    if (key === 'totalDays') setTotalDays(next.totalDays);
    if (key === 'daysElapsed') setDaysElapsed(next.daysElapsed);
    if (key === 'amountSpent') setAmountSpent(next.amountSpent);
    // realtime validation and clear results until valid submit
    const e = validate(next);
    setErrors(e);
  };

  const onCalculate = () => {
    const e = validate({ totalBudget, totalDays, daysElapsed, amountSpent });
    setErrors(e);
    if (Object.keys(e).length > 0) {
      setResults(null);
      return;
    }

    const budget = parseInt(totalBudget, 10);
    const duration = parseInt(totalDays, 10);
    const elapsed = parseInt(daysElapsed, 10);
    const spent = parseInt(amountSpent, 10);

    const expectedSpend = Math.round((budget / duration) * elapsed);
    const dailyBudget = Math.round(budget / duration);
    const remaining = budget - spent;
    const daysRemaining = Math.max(0, duration - elapsed);
    const recommendedDaily = daysRemaining > 0 ? Math.round(remaining / daysRemaining) : 0;

    const variancePct = expectedSpend === 0 ? 0 : ((spent - expectedSpend) / expectedSpend) * 100;
    let pacingText = 'On Track';
    let pacingClass = 'ok';
    if (Math.abs(variancePct) < 5) { pacingText = 'On Track'; pacingClass = 'ok'; }
    else if (variancePct > 0) { pacingText = `${Math.abs(Math.round(variancePct))}% Over Pace`; pacingClass = variancePct > 20 ? 'danger' : 'warn'; }
    else { pacingText = `${Math.abs(Math.round(variancePct))}% Under Pace`; pacingClass = variancePct < -20 ? 'warn' : 'ok'; }

    setResults({ dailyBudget, expectedSpend, remaining, recommendedDaily, pacingText, pacingClass, percentSpent: (spent / budget) * 100 });
  };

  const onClear = () => {
    setTotalBudget(''); setTotalDays(''); setDaysElapsed(''); setAmountSpent('');
    setErrors({}); setResults(null);
  };

  const onKey = (e) => { if (e.key === 'Enter') onCalculate(); };

  return (
    <div className="pw">
      <h1>Campaign Pacing Calculator</h1>
      <div className="sub">Track and optimize your marketing spend in real time</div>

      <div className="grid">
        {/* left column */}
        <div>
          <div className="group">
            <label htmlFor="budget">Total Budget</label>
            <div className="help">Enter your total campaign budget (USD, whole dollars)</div>
            <div className="wrap">
              <span className="sym">$</span>
              <input
                id="budget"
                type="number"
                inputMode="numeric"
                pattern="\d*"
                step="1"
                min="1"
                className={`sympad ${errors.totalBudget ? 'err' : ''}`}
                placeholder="e.g., 10000"
                value={totalBudget}
                onChange={handleChange('totalBudget')}
                onKeyPress={onKey}
              />
            </div>
            <div className={`errmsg ${errors.totalBudget ? 'show' : ''}`}>{errors.totalBudget || ''}</div>
          </div>

          <div className="group" style={{ marginTop: 16 }}>
            <label htmlFor="duration">Campaign Duration (Days)</label>
            <div className="help">Total length of your campaign</div>
            <div className="wrap">
              <input
                id="duration"
                type="number"
                inputMode="numeric"
                pattern="\d*"
                step="1"
                min="1"
                className={`${errors.totalDays ? 'err' : ''}`}
                placeholder="e.g., 30"
                value={totalDays}
                onChange={handleChange('totalDays')}
                onKeyPress={onKey}
              />
            </div>
            <div className={`errmsg ${errors.totalDays ? 'show' : ''}`}>{errors.totalDays || ''}</div>
          </div>

          <div className="group" style={{ marginTop: 16 }}>
            <label htmlFor="elapsed">Days Elapsed</label>
            <div className="help">Days since campaign started</div>
            <div className="wrap">
              <input
                id="elapsed"
                type="number"
                inputMode="numeric"
                pattern="\d*"
                step="1"
                min="0"
                className={`${errors.daysElapsed ? 'err' : ''}`}
                placeholder="e.g., 15"
                value={daysElapsed}
                onChange={handleChange('daysElapsed')}
                onKeyPress={onKey}
              />
            </div>
            <div className={`errmsg ${errors.daysElapsed ? 'show' : ''}`}>{errors.daysElapsed || ''}</div>
          </div>

          <div className="group" style={{ marginTop: 16 }}>
            <label htmlFor="spent">Amount Spent</label>
            <div className="help">Total amount spent so far (USD)</div>
            <div className="wrap">
              <span className="sym">$</span>
              <input
                id="spent"
                type="number"
                inputMode="numeric"
                pattern="\d*"
                step="1"
                min="0"
                className={`sympad ${errors.amountSpent ? 'err' : ''}`}
                placeholder="e.g., 5000"
                value={amountSpent}
                onChange={handleChange('amountSpent')}
                onKeyPress={onKey}
              />
            </div>
            <div className={`errmsg ${errors.amountSpent ? 'show' : ''}`}>{errors.amountSpent || ''}</div>
          </div>

          <div className="btnrow">
            <button type="button" className="primary" onClick={onCalculate}>Calculate Pacing</button>
            <button type="button" className="secondary" onClick={onClear}>Clear All</button>
          </div>

          <div className="foot">Currency: USD • Whole dollars only</div>
        </div>

        {/* right column */}
        <div className="panel">
          {!results ? (
            <div className="placeholder">
              <p><strong>Enter your campaign details</strong></p>
              <p>and click “Calculate Pacing” to see results</p>
            </div>
          ) : (
            <>
              <div className="metricbox">
                <div className="mlab">Pacing Status</div>
                <div className={`mval ${results.pacingClass}`}>{results.pacingText}</div>
              </div>

              <div className="metricbox">
                <div className="mlab">Expected Spend by Now</div>
                <div className="mval">{fmt((parseInt(totalBudget,10)/parseInt(totalDays,10))*parseInt(daysElapsed,10))}</div>
              </div>

              <div className="metricbox">
                <div className="mlab">Remaining Budget</div>
                <div className="mval">{fmt(results.remaining)}</div>
              </div>

              <div className="metricbox">
                <div className="mlab">Recommended Daily Spend</div>
                <div className="mval">{fmt(results.recommendedDaily)}</div>
              </div>

              <div className="metricbox">
                <div className="bar"><span style={{ width: `${Math.min(results.percentSpent, 100)}%` }} /></div>
                <div style={{ fontWeight: 700, marginTop: 8 }}>
                  {Math.round(results.percentSpent)}% of Budget Spent
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}