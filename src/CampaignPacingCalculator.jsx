
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
    <div className="min-h-[320px] bg-white p-6 md:p-8 border border-gray-200 rounded-2xl max-w-5xl mx-auto font-sans">
      <div className="text-2xl md:text-3xl font-semibold text-gray-900 text-center mb-1">
        Campaign Pacing Calculator
      </div>
      <div className="text-sm md:text-base text-gray-600 text-center mb-8">
        Track and optimize your marketing spend in real time
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="flex flex-col gap-5">
          <label className="flex flex-col">
            <span className="text-sm font-medium text-gray-900 mb-1">Total Budget</span>
            <input
              type="number"
              value={totalBudget}
              onChange={(e) => setTotalBudget(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="1000"
              className="p-3 text-base border border-gray-300 rounded-xl bg-white focus:border-gray-900 focus:outline-none transition-colors"
            />
          </label>

          <label className="flex flex-col">
            <span className="text-sm font-medium text-gray-900 mb-1">Campaign Duration (Days)</span>
            <input
              type="number"
              value={totalDays}
              onChange={(e) => setTotalDays(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="30"
              className="p-3 text-base border border-gray-300 rounded-xl bg-white focus:border-gray-900 focus:outline-none transition-colors"
            />
          </label>

          <label className="flex flex-col">
            <span className="text-sm font-medium text-gray-900 mb-1">Days Elapsed</span>
            <input
              type="number"
              value={daysElapsed}
              onChange={(e) => setDaysElapsed(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="20"
              className="p-3 text-base border border-gray-300 rounded-xl bg-white focus:border-gray-900 focus:outline-none transition-colors"
            />
          </label>

          <label className="flex flex-col">
            <span className="text-sm font-medium text-gray-900 mb-1">Amount Spent</span>
            <input
              type="number"
              value={amountSpent}
              onChange={(e) => setAmountSpent(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="400"
              className="p-3 text-base border border-gray-300 rounded-xl bg-white focus:border-gray-900 focus:outline-none transition-colors"
            />
          </label>

          <button
            onClick={calculatePacing}
            className="p-3 text-base font-medium text-white bg-gray-900 rounded-xl hover:bg-black active:scale-[0.99] transition-all"
          >
            Calculate Pacing
          </button>
        </div>

        <div className="bg-gray-50 rounded-xl p-6 text-gray-900 flex flex-col gap-5 border border-gray-200">
          {!results ? (
            <div className="text-gray-500 text-sm text-center py-8">
              Enter your campaign details and click \"Calculate Pacing\" to see results
            </div>
          ) : (
            <>
              <div>
                <div className="text-xs uppercase tracking-wide text-gray-500 mb-1 font-medium">Pacing Status</div>
                <div className="text-3xl md:text-4xl font-semibold">{results.pacingStatus}</div>
              </div>

              <div>
                <div className="text-xs uppercase tracking-wide text-gray-500 mb-1 font-medium">Target Spend</div>
                <div className="text-2xl md:text-3xl font-semibold">{formatCurrency(results.targetSpend)}</div>
              </div>

              <div>
                <div className="text-xs uppercase tracking-wide text-gray-500 mb-1 font-medium">Spend Variance</div>
                <div className="text-2xl md:text-3xl font-semibold">{results.spendVariance >= 0 ? '+' : ''}{formatCurrency(results.spendVariance)}</div>
              </div>

              <div>
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden mt-1" aria-hidden>
                  <div className="h-full rounded-full transition-all duration-500 bg-gray-700" style={{ width: `${Math.min(results.percentOfBudgetSpent, 100)}%` }} />
                </div>
                <div className="text-lg md:text-xl font-medium mt-2">{results.percentOfBudgetSpent.toFixed(0)}% of Budget Spent</div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="text-[11px] text-gray-400 mt-4">Currency: {opts.currency} • Decimals: {opts.decimals}</div>
    </div>
  );
}
