# COT Report Data Dashboard Demo

This is a standalone demo version of the CFTC Dashboard that shows Leveraged Funds positioning data from 2023-2025 March.

## Features

- **Two independent dashboards** displaying COT (Commitments of Traders) data
- Trader category selection (Leveraged Funds, Asset Manager, Dealer)
  - All three categories include real CFTC data (2023-2025 March)
- Select any major currency pair (EUR, GBP, JPY, USD, AUD, CAD, CHF, NZD)
- Filter by year (2023, 2024, 2025)
- Net Position charts showing only the net percentage line
- Position tables with:
  - Date, Long/Short positions and percentages
  - Net percentage displayed in yellow/gold
  - Signal indicators showing ↑ Net Change (Buy) or ↓ Net Change (Sell)
  - Signals are based on net position crossing zero

## How to Use

1. Open `index.html` in any modern web browser
2. Each dashboard can be configured independently:
   - Select a currency from the dropdown
   - Choose a year
   - Click "Show Chart" to view the net position trend
3. The table shows the 15 most recent data points
4. Signal column indicates:
   - **↑ Net Change**: When net position crosses from negative to positive
   - **↓ Net Change**: When net position crosses from positive to negative

## Data

This demo includes real CFTC data from 2023 through March 2025, showing:
- Leveraged Funds positioning data
- Asset Manager positioning data  
- Dealer positioning data
- Long and short positions (contracts and percentages)
- Net positioning calculations
- Trading signals based on zero-crossing

## Files

- `index.html` - Main dashboard interface
- `renderer.js` - Dashboard logic and chart rendering
- `data.js` - Embedded CFTC data (936 data points)
- `README.md` - This file

## Note

This is a demo version with embedded data. The full application includes:
- Real-time data updates from CFTC
- Multiple trader categories (Asset Managers, Dealers)
- Historical data back to 2010
- API integration for live updates
- Additional analytics and features

## UI Theme

The demo uses the same dark theme as the production version:
- Black background (#000000)
- Yellow/gold accent color (#EAB308) for net percentages
- Green indicators for buy signals
- Red indicators for sell signals

## License

Demo version for educational purposes.