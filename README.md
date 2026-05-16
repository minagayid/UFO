# UFO: Ultimate Financial Operations

**UFO** brings futuristic CEO-level financial dashboard features to your organization. Visualize revenue, expenses, uncertainty, and run what-if scenario analyses interactively—powered by modern tech: TypeScript, React, Tailwind CSS, Vite, and Recharts.

---

## Features
- **Intuitive dashboard UI** with KPIs, interactive charts, and scenario tuning
- **Credible interval forecasting**: 50% and 80% uncertainty bands using Bayesian-style ranges
- **Data quality/uncertainty display**
- **Scenario analysis**: What-if sliders for revenue/expense/volatility
- **Pretend canvas dashboard** for future drag-n-drop widget layouts

## Quickstart

1. **Install dependencies**
   ```sh
   cd frontend
   npm install
   ```
2. **Run development mode**
   ```sh
   npm run dev
   ```
3. **Build for production**
   ```sh
   npm run build
   ```

4. **Preview (after build)**
   ```sh
   npm run preview
   ```

Node 18+ is recommended. Built with Vite, React 18, TypeScript, and Tailwind CSS.

---

## Scripts (in `frontend/package.json`)
- `dev` – run Vite dev server
- `build` – build with TypeScript+Vite
- `preview` – preview production build
- `lint` – run ESLint static analysis (auto-fixes)
- `format` – run Prettier formatting
- `test` – run example tests with Vitest

See `.github/workflows/ci.yml` for CI steps.

---

## Contributing
1. Fork this repo & create feature branches from `main`.
2. Run `npm run lint && npm run test` before committing.
3. Open PRs against `main`.

---

## License
No license yet — all rights reserved by repo owner. Not permitted for production or redistribution.
