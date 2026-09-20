# UFO — Ultimate Financial Operations

UFO is a React + TypeScript dashboard prototype for reviewing revenue,
expenses, forecasts, uncertainty bands, and what-if scenarios in one local
workspace.

## Current capabilities

- Revenue forecasting with 50% and 80% uncertainty bands.
- Expense projections with adjustable reduction assumptions.
- KPI cards for projected revenue, expenses, margin, and cash runway.
- Functional growth, expense-reduction, and volatility sliders.
- A customizable canvas view with local layout persistence and JSON sharing.
- Optional browser-side Gemini copilot configuration; no key is committed.

The app uses synthetic data. It is a decision-support prototype, not an
accounting system or a source of verified financial advice.

## Quick start

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. For a production bundle:

```bash
npm run build
```

## Project structure

```text
src/
  components/   Dashboard, canvas, KPI, copilot, and scenario UI
  data/         Synthetic revenue and expense inputs
  types/        Financial TypeScript models
  utils/        Forecast, expense, KPI, and class-name helpers
```

## Known boundaries

- Data is currently local and synthetic; there is no backend or persistence
  beyond browser storage for the canvas layout.
- There are no component tests or live financial-data integrations yet.
- Build and lint checks require the declared npm dependencies to be installed.

## License

MIT — see [LICENSE](LICENSE) for details.
