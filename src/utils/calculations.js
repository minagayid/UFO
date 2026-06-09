/**
 * Calculates dynamic revenue forecast with uncertainty bands based on growth rate and volatility
 */
export function calculateRevenueForecast(baseData, parameters) {
    const { growthRate, volatility } = parameters;
    const spreadMultiplier = volatility / 5; // 5 is the base medium volatility
    return baseData.map((point, index) => {
        // For months with historical actuals (Jan, Feb, Mar - index 0, 1, 2)
        if (point.actual !== null) {
            return { ...point };
        }
        // Compounding forecast adjustment based on index (Apr is index 3, May 4, Jun 5)
        // t is number of months into the future (Apr=1, May=2, Jun=3)
        const t = index - 2;
        const growthFactor = 1 + (growthRate / 100) * (t / 3); // composes growth gradually
        const forecast = Math.round(point.forecast * growthFactor);
        // Scale confidence intervals based on volatility
        const baseSpread50 = point.high50 - point.forecast;
        const baseSpread80 = point.high80 - point.forecast;
        const spread50 = Math.round(baseSpread50 * spreadMultiplier * (1 + Math.abs(growthRate) / 200));
        const spread80 = Math.round(baseSpread80 * spreadMultiplier * (1 + Math.abs(growthRate) / 150));
        return {
            month: point.month,
            actual: null,
            forecast,
            low50: Math.max(0, forecast - spread50),
            high50: forecast + spread50,
            low80: Math.max(0, forecast - spread80),
            high80: forecast + spread80,
        };
    });
}
/**
 * Calculates dynamic expense forecast based on expense reduction rate
 */
export function calculateExpenses(baseData, parameters) {
    const { expenseReduction } = parameters;
    return baseData.map((point, index) => {
        // Jan, Feb, Mar (index 0, 1, 2) are actuals - they don't change
        if (index < 3) {
            return { ...point };
        }
        // Future expenses (Apr, May, Jun) are reduced
        const reductionFactor = 1 - expenseReduction / 100;
        return {
            ...point,
            amount: Math.round(point.amount * reductionFactor),
        };
    });
}
/**
 * Calculates KPIs based on current projected data (for Jun - end of forecast period)
 */
export function calculateKPIs(revenueData, expenseData) {
    // Jun metrics (index 5)
    const juneRev = revenueData[5].forecast;
    const juneExp = expenseData[5].amount;
    const profitMargin = ((juneRev - juneExp) / juneRev) * 100;
    // Let's assume a baseline cash reserve of $1,600,000
    const cashReserves = 1600000;
    const runwayMonths = Math.round((cashReserves / juneExp) * 10) / 10;
    // Compare Jun vs Mar (Index 2 is Mar - latest actual)
    const marRev = revenueData[2].actual || 145000;
    const marExp = expenseData[2].amount;
    const revChangePct = ((juneRev - marRev) / marRev) * 100;
    const expChangePct = ((juneExp - marExp) / marExp) * 100;
    const marProfitMargin = ((marRev - marExp) / marRev) * 100;
    const marginChangeDiff = profitMargin - marProfitMargin;
    return {
        revenue: {
            value: `$${juneRev.toLocaleString()}`,
            change: `${revChangePct >= 0 ? '+' : ''}${revChangePct.toFixed(1)}% vs Mar actual`,
            trend: revChangePct >= 0 ? 'up' : 'down',
        },
        expenses: {
            value: `$${juneExp.toLocaleString()}`,
            change: `${expChangePct >= 0 ? '+' : ''}${expChangePct.toFixed(1)}% vs Mar actual`,
            trend: expChangePct <= 0 ? 'up' : 'down', // "up" means good (costs down)
        },
        profitMargin: {
            value: `${profitMargin.toFixed(1)}%`,
            change: `${marginChangeDiff >= 0 ? '+' : ''}${marginChangeDiff.toFixed(1)}% margin shift`,
            trend: marginChangeDiff >= 0 ? 'up' : 'down',
        },
        runway: {
            value: `${runwayMonths} months`,
            change: juneExp <= marExp ? 'Extended Runway' : 'Increased Burn Rate',
            trend: juneExp <= marExp ? 'up' : 'down',
        }
    };
}
