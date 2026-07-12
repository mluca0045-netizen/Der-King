# Der-King

TradingView Trading-Bot-Strategie in Pine Script v6.

## Datei

- [`der-king-strategy.pine`](der-king-strategy.pine) – Trend-Following-Strategie mit Risikomanagement und Webhook-Alerts.

## So verwendest du die Strategie

1. Öffne [TradingView](https://www.tradingview.com/) und einen Chart deiner Wahl (empfohlen: 1H–4H auf liquiden Märkten wie BTC/USDT, ETH/USDT oder Indizes).
2. Öffne den **Pine Editor** (unten im Chart).
3. Kopiere den kompletten Inhalt von `der-king-strategy.pine` hinein.
4. Klicke auf **„Zum Chart hinzufügen"**.
5. Öffne den **Strategie-Tester**, um Backtest-Ergebnisse zu sehen (Nettogewinn, Drawdown, Trefferquote, Profitfaktor).

## Funktionsweise

- **Trendfilter (EMA 200):** Longs nur über dem EMA 200, Shorts nur darunter.
- **Einstieg:** Crossover des schnellen EMA (21) über/unter den langsamen EMA (55).
- **RSI-Filter:** Bestätigt Momentum (Long nur bei RSI > 50, Short nur bei RSI < 50).
- **Stop-Loss / Take-Profit:** ATR-basiert (Standard: 2× ATR Stop, 3× ATR Ziel) – passt sich der Volatilität an. Optional Trailing-Stop.
- **Positionsgröße:** Riskiert standardmäßig 1 % des Kontos pro Trade.
- **Kosten:** Kommission (0,075 %) und Slippage sind im Backtest eingerechnet.

Alle Parameter sind über die Strategie-Einstellungen (Zahnrad-Symbol) anpassbar.

## Automatisierung per Webhook

Die Strategie sendet bei Ein- und Ausstiegen JSON-Alerts, z. B.:

```json
{"action":"buy","symbol":"BTCUSDT","price":65000}
```

1. Erstelle in TradingView einen Alert auf die Strategie mit Bedingung **„Order fills only"**.
2. Trage als Nachricht `{{strategy.order.alert_message}}` ein.
3. Hinterlege die Webhook-URL deines Bot-Dienstes (z. B. 3Commas, Alertatron oder ein eigener Server), der die Order an deinen Broker/deine Börse weiterleitet.

## ⚠️ Risikohinweis

Keine Strategie ist garantiert profitabel – vergangene Backtest-Ergebnisse sind keine Garantie für zukünftige Gewinne. Teste ausgiebig (Backtest **und** Paper-Trading), optimiere die Parameter pro Markt/Timeframe und riskiere niemals Geld, dessen Verlust du dir nicht leisten kannst.
