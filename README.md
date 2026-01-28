![moltfun](moltbot.png)

# moltfun

A local-run observational agent for studying Pump.fun token lifecycle behavior. moltfun monitors on-chain activity, computes participation and technical signals, classifies tokens into lifecycle states, and applies strict risk gates. It is designed for transparency, inspection, and experimentation, not profit generation.

## Concept Overview

moltfun is an experimental system built to observe and analyze the lifecycle of tokens on Pump.fun. The system tracks liquidity flows, volume velocity, wallet growth, and holder concentration to identify behavioral patterns in newly launched tokens.

This project explicitly does NOT attempt to:

- guarantee profitable trading outcomes
- provide financial advice
- operate as a black-box automated trading system
- replace human judgment or due diligence
- predict future token performance with certainty

Instead, moltfun focuses on:

- real-time observation of on-chain behavior
- transparent signal computation with auditable logic
- lifecycle state classification based on measurable criteria
- comprehensive logging of all observations and decisions
- local execution with safety-first design

The goal is to provide a framework for understanding how tokens evolve through different phases, from initial launch through expansion, stagnation, and eventual decline. All behavior is inspectable, all decisions are logged, and all actions are gated by strict risk controls.

## System Architecture

moltfun operates as a pipeline that ingests on-chain data, computes signals, applies risk gates, classifies lifecycle states, and logs all observations. The architecture is designed to be modular, auditable, and safe by default.

```
Pump.fun Events
      |
      v
On-chain Data Collector
      |
      v
Signal Engine
      |
      v
Risk Gate
      |
      v
State Classifier
      |
      v
Decision Logger
      |
      v
Audit Log / Paper Mode / Observe-Only
```

### Component Breakdown

**Data Collector**: Monitors Pump.fun for new token launches, swap events, liquidity changes, and wallet activity. Normalizes raw event data into a consistent format for downstream processing.

**Signal Engine**: Computes technical and participation signals from normalized data. Calculates momentum, moving averages, volume velocity, wallet growth rate, and holder concentration metrics.

**Risk Gate**: Evaluates all computed signals against predefined risk thresholds. Blocks any action that violates liquidity floors, concentration limits, exposure caps, or cooldown rules.

**State Classifier**: Maps signal combinations to lifecycle states (emerging, expanding, stalling, molting, dead). Handles ambiguous cases and state transitions with explicit logic.

**Decision Logger**: Records every observation, classification, and decision in structured JSON format. Logs include signal snapshots, risk flags, confidence scores, and human-readable explanations.

## Repository Structure

```
moltfun/
├── src/
│   ├── collector/
│   │   ├── pumpfun_monitor.py
│   │   ├── event_parser.py
│   │   └── data_normalizer.py
│   ├── signals/
│   │   ├── momentum.py
│   │   ├── volume_velocity.py
│   │   ├── participation.py
│   │   └── concentration.py
│   ├── risk/
│   │   ├── gates.py
│   │   ├── exposure_tracker.py
│   │   └── cooldown_manager.py
│   ├── states/
│   │   ├── classifier.py
│   │   ├── state_definitions.py
│   │   └── transition_logic.py
│   ├── logger/
│   │   ├── audit_log.py
│   │   ├── json_formatter.py
│   │   └── redactor.py
│   └── main.py
├── config/
│   ├── signals.yaml
│   ├── risk_limits.yaml
│   └── states.yaml
├── scripts/
│   ├── replay_historical.py
│   ├── analyze_logs.py
│   └── validate_config.py
├── logs/
│   ├── observations/
│   ├── decisions/
│   └── errors/
├── tests/
│   ├── test_signals.py
│   ├── test_risk_gates.py
│   └── test_classifier.py
├── .env.example
├── requirements.txt
├── LICENSE
└── README.md
```

**src/collector**: Data ingestion layer. Monitors Pump.fun events, parses blockchain transactions, and normalizes data into a consistent schema.

**src/signals**: Signal computation modules. Each signal has its own file with clear formulas and logic.

**src/risk**: Risk management layer. Enforces liquidity minimums, concentration limits, exposure caps, and cooldown periods.

**src/states**: Lifecycle state classification. Defines state criteria, handles transitions, and resolves ambiguous cases.

**src/logger**: Audit logging system. Writes structured JSON logs with full context for every observation and decision.

**config**: YAML configuration files for signal parameters, risk limits, and state definitions. All thresholds are tunable without code changes.

**scripts**: Utility scripts for replaying historical data, analyzing logs, and validating configuration.

**logs**: Structured logs organized by type. All observations, decisions, and errors are logged with timestamps and full context.

**tests**: Unit and integration tests for signals, risk gates, and classification logic.

## Setup & Installation

### Prerequisites

- Python 3.10 or higher
- RPC endpoint access (Solana mainnet or devnet)
- Pump.fun API access (read-only)
- At least 4GB RAM for signal computation
- Disk space for logs (recommend 10GB minimum)

### Installation

Clone the repository:

```bash
git clone https://github.com/yourusername/moltfun.git
cd moltfun
```

Create a virtual environment:

```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

### Environment Configuration

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# RPC Configuration
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
SOLANA_RPC_RATE_LIMIT=100

# Pump.fun API
PUMPFUN_API_KEY=your_api_key_here
PUMPFUN_WEBSOCKET_URL=wss://pumpfun.com/stream

# Execution Mode
EXECUTION_MODE=observe  # Options: observe, paper, disabled
ENABLE_LIVE_TRADING=false

# Risk Limits
MAX_EXPOSURE_SOL=0.0  # Set to 0 for observe/paper modes
MAX_POSITION_SIZE_SOL=0.0
DAILY_LOSS_LIMIT_SOL=0.0

# Logging
LOG_LEVEL=INFO
LOG_TO_FILE=true
LOG_RETENTION_DAYS=30

# Data Collection
COLLECTION_INTERVAL_SECONDS=5
MAX_TOKENS_TRACKED=100

# Signal Parameters (optional overrides)
# See config/signals.yaml for defaults
```

### Running in Observe-Only Mode

By default, moltfun runs in observe-only mode. This mode collects data, computes signals, classifies states, and logs observations without any execution capability.

```bash
python src/main.py --mode observe
```

Output:

```
[2026-01-28 10:00:00] Starting moltfun in OBSERVE mode
[2026-01-28 10:00:00] Live trading: DISABLED
[2026-01-28 10:00:01] Connected to Solana RPC
[2026-01-28 10:00:02] Subscribed to Pump.fun events
[2026-01-28 10:00:03] Monitoring 0 tokens...
```

### Running in Paper Mode

Paper mode simulates decision-making without real execution. All signals, risk gates, and classifications run normally, but no actual trades occur.

```bash
python src/main.py --mode paper
```

Edit `.env`:

```env
EXECUTION_MODE=paper
```

Paper mode logs will include simulated P&L tracking and position sizing, but no real funds are used.

### Live Execution (Disabled by Default)

Live trading is disabled by default and requires explicit configuration changes in multiple places to prevent accidental execution. This is intentional.

To enable live execution (NOT RECOMMENDED):

1. Set `EXECUTION_MODE=live` in `.env`
2. Set `ENABLE_LIVE_TRADING=true` in `.env`
3. Set non-zero risk limits in `.env`
4. Uncomment the live execution block in `src/main.py`
5. Acknowledge the risk warning in the console

Even with live execution enabled, all risk gates remain active and will block most actions.

## Data Inputs

moltfun consumes several types of on-chain data to build a complete picture of token lifecycle behavior:

### Pump.fun Launch Events

- Token creation timestamp
- Initial liquidity amount
- Creator wallet address
- Token metadata (name, symbol, description)
- Bonding curve parameters

### Swap Activity

- Individual swap transactions (buy/sell)
- Swap size in SOL and tokens
- Wallet addresses involved
- Transaction timestamps
- Gas fees paid

### Liquidity Changes

- Liquidity pool depth over time
- Additions and removals
- LP token supply changes
- Price impact estimates

### Wallet Counts

- Unique holders at each observation interval
- New wallet arrivals per period
- Wallet departures (complete exits)
- Wallet growth rate

### Holder Distribution

- Token concentration by wallet
- Top 10 holder percentage
- Gini coefficient for distribution
- Changes in concentration over time

### Data Limitations

- RPC rate limits may cause delays in data collection
- Some early transactions may be missed during high activity periods
- Wallet clustering (same entity controlling multiple wallets) is not detected
- Bot activity is not automatically filtered
- Data is sampled at fixed intervals, not continuous
- Historical data replay depends on RPC historical data availability

## Signal Layer

moltfun computes several categories of signals from raw on-chain data. All signals are designed to be simple, interpretable, and reproducible.

### Momentum Signals

**Price Momentum**: Rate of change in token price over a rolling window.

```python
def price_momentum(prices, window=12):
    """
    Calculate price momentum as percentage change.
    
    prices: list of recent prices (newest last)
    window: number of periods to look back
    
    returns: float, percentage change from window start to current
    """
    if len(prices) < window:
        return 0.0
    
    old_price = prices[-window]
    new_price = prices[-1]
    
    if old_price == 0:
        return 0.0
    
    return ((new_price - old_price) / old_price) * 100
```

**Volume Momentum**: Rate of change in trading volume.

```python
def volume_momentum(volumes, window=12):
    """
    Calculate volume momentum as percentage change.
    """
    if len(volumes) < window:
        return 0.0
    
    old_volume = sum(volumes[-window:-window//2])
    new_volume = sum(volumes[-window//2:])
    
    if old_volume == 0:
        return 0.0
    
    return ((new_volume - old_volume) / old_volume) * 100
```

### Moving Averages

**Short Moving Average**: Mean price over recent periods.

```python
def moving_average(prices, window=5):
    """
    Simple moving average.
    """
    if len(prices) < window:
        return prices[-1] if prices else 0.0
    
    return sum(prices[-window:]) / window
```

**Volume Moving Average**: Mean volume over recent periods.

```python
def volume_ma(volumes, window=10):
    """
    Volume moving average.
    """
    if len(volumes) < window:
        return sum(volumes) / len(volumes) if volumes else 0.0
    
    return sum(volumes[-window:]) / window
```

### Volume Velocity

**Volume Acceleration**: Second derivative of volume (rate of change of rate of change).

```python
def volume_velocity(volumes, window=6):
    """
    Calculate volume acceleration.
    
    Measures if volume growth is accelerating or decelerating.
    """
    if len(volumes) < window * 2:
        return 0.0
    
    # First derivative (recent rate of change)
    recent_delta = sum(volumes[-window:]) - sum(volumes[-window*2:-window])
    
    # Second derivative (change in rate of change)
    older_delta = sum(volumes[-window*2:-window]) - sum(volumes[-window*3:-window*2])
    
    if older_delta == 0:
        return 0.0
    
    return ((recent_delta - older_delta) / abs(older_delta)) * 100
```

### Participation Growth

**Wallet Growth Rate**: Rate at which new unique holders are joining.

```python
def wallet_growth_rate(holder_counts, window=10):
    """
    Calculate wallet growth rate.
    
    holder_counts: list of unique holder counts over time
    window: periods to measure growth over
    
    returns: percentage growth rate
    """
    if len(holder_counts) < window:
        return 0.0
    
    old_count = holder_counts[-window]
    new_count = holder_counts[-1]
    
    if old_count == 0:
        return 0.0
    
    return ((new_count - old_count) / old_count) * 100
```

**Net Wallet Flow**: New wallets minus exiting wallets.

```python
def net_wallet_flow(arrivals, departures):
    """
    Net change in unique holders.
    
    arrivals: new wallets in current period
    departures: wallets that fully exited in current period
    
    returns: net change
    """
    return arrivals - departures
```

### Concentration Drift

**Holder Concentration**: Percentage of total supply held by top N wallets.

```python
def top_holder_concentration(balances, top_n=10):
    """
    Calculate concentration in top N holders.
    
    balances: dict mapping wallet addresses to token balances
    top_n: number of top holders to consider
    
    returns: percentage of supply in top N wallets
    """
    if not balances:
        return 0.0
    
    sorted_balances = sorted(balances.values(), reverse=True)
    top_balance = sum(sorted_balances[:top_n])
    total_balance = sum(balances.values())
    
    if total_balance == 0:
        return 0.0
    
    return (top_balance / total_balance) * 100
```

**Concentration Trend**: Rate of change in concentration over time.

```python
def concentration_drift(concentrations, window=8):
    """
    Measure if token is becoming more or less concentrated.
    
    concentrations: list of concentration percentages over time
    window: periods to measure drift over
    
    returns: positive if concentrating, negative if distributing
    """
    if len(concentrations) < window:
        return 0.0
    
    old_conc = concentrations[-window]
    new_conc = concentrations[-1]
    
    return new_conc - old_conc
```

### Signal Thresholds

Default thresholds are defined in `config/signals.yaml`:

```yaml
momentum:
  strong_positive: 20.0
  weak_positive: 5.0
  neutral: 0.0
  weak_negative: -5.0
  strong_negative: -20.0

volume_velocity:
  accelerating: 15.0
  steady: -5.0
  decelerating: -15.0

wallet_growth:
  rapid: 30.0
  moderate: 10.0
  slow: 2.0
  stagnant: 0.0
  declining: -5.0

concentration:
  highly_concentrated: 70.0
  concentrated: 50.0
  distributed: 30.0
  highly_distributed: 15.0
```

All thresholds are tunable and should be adjusted based on observed token behavior.

## Lifecycle State Model

moltfun classifies tokens into five lifecycle states based on signal combinations. States represent distinct phases in token evolution, from initial launch through eventual decline.

### State Definitions

| State | Description | Typical Duration | Key Characteristics |
|-------|-------------|------------------|---------------------|
| **emerging** | Token has just launched and is gaining initial traction | 1-6 hours | Rapid wallet growth, increasing volume, low concentration |
| **expanding** | Token is experiencing sustained growth and participation | 6-48 hours | Strong momentum, accelerating volume, steady wallet influx |
| **stalling** | Growth has plateaued, activity is stabilizing | 12-72 hours | Declining momentum, steady volume, slowing wallet growth |
| **molting** | Token is shedding participants, volume is declining | 24+ hours | Negative momentum, decelerating volume, wallet exodus |
| **dead** | Token has effectively ceased meaningful activity | Indefinite | Minimal volume, no new wallets, high concentration |

### State Criteria

**Emerging State**

Criteria:
- Wallet growth rate > 30%
- Volume velocity > 15% (accelerating)
- Price momentum > 5%
- Concentration < 50%
- Age < 6 hours since launch

Transitions to:
- **expanding** if momentum strengthens and volume accelerates
- **stalling** if wallet growth drops below 10%
- **molting** if price momentum turns negative

**Expanding State**

Criteria:
- Wallet growth rate > 10%
- Volume velocity > 0% (not decelerating)
- Price momentum > 0%
- Concentration stable or decreasing
- Net wallet flow > 0

Transitions to:
- **stalling** if wallet growth drops below 5% or volume velocity turns negative
- **molting** if price momentum drops below -10%
- **emerging** if token re-accelerates (rare, requires strong catalyst)

**Stalling State**

Criteria:
- Wallet growth rate between 0% and 10%
- Volume velocity between -10% and 5%
- Price momentum between -5% and 5%
- Concentration stable
- Net wallet flow near zero

Transitions to:
- **expanding** if wallet growth exceeds 15% and momentum turns positive
- **molting** if wallet growth turns negative or concentration spikes
- **dead** if volume drops below minimum threshold

**Molting State**

Criteria:
- Wallet growth rate < 0% (net loss of holders)
- Volume velocity < -15% (decelerating)
- Price momentum < -10%
- Concentration increasing (holders consolidating)
- Net wallet flow < 0

Transitions to:
- **dead** if volume drops to near zero
- **stalling** if decline stabilizes (temporary floor)
- **expanding** only with exceptional re-ignition (very rare)

**Dead State**

Criteria:
- Volume < 1% of peak 24h volume
- Wallet growth rate < -5%
- No new wallets for 24+ hours
- Concentration > 70%
- Price down > 50% from peak

Transitions:
- Generally terminal, no transitions out

### Ambiguity Handling

When signal combinations do not clearly map to a single state, the classifier applies these rules:

1. **Conflicting signals**: Use the most conservative state (favors observation over action)
2. **Missing data**: Default to previous state with low confidence flag
3. **State oscillation**: Apply hysteresis (require sustained signal change to transition)
4. **Boundary cases**: Log as ambiguous, defer to human review

Example ambiguous case:

```
Signals:
  wallet_growth: 8% (borderline emerging/expanding)
  volume_velocity: -2% (slightly decelerating)
  price_momentum: 3% (weakly positive)
  concentration: 45% (moderate)

Classification: STALLING (with ambiguity flag)
Confidence: 0.65
Reason: "Mixed signals, wallet growth insufficient for expansion"
```

### State Transition Logic

Pseudocode for state transitions:

```python
def classify_state(signals, current_state):
    """
    Classify lifecycle state from signal snapshot.
    
    Applies hysteresis to prevent rapid oscillation.
    """
    candidate_state = None
    confidence = 0.0
    
    # Check emerging criteria
    if (signals['wallet_growth'] > 30 and
        signals['volume_velocity'] > 15 and
        signals['price_momentum'] > 5 and
        signals['concentration'] < 50 and
        signals['age_hours'] < 6):
        candidate_state = 'emerging'
        confidence = 0.85
    
    # Check expanding criteria
    elif (signals['wallet_growth'] > 10 and
          signals['volume_velocity'] > 0 and
          signals['price_momentum'] > 0 and
          signals['net_wallet_flow'] > 0):
        candidate_state = 'expanding'
        confidence = 0.80
    
    # Check stalling criteria
    elif (0 <= signals['wallet_growth'] <= 10 and
          -10 <= signals['volume_velocity'] <= 5 and
          -5 <= signals['price_momentum'] <= 5):
        candidate_state = 'stalling'
        confidence = 0.75
    
    # Check molting criteria
    elif (signals['wallet_growth'] < 0 and
          signals['volume_velocity'] < -15 and
          signals['price_momentum'] < -10):
        candidate_state = 'molting'
        confidence = 0.80
    
    # Check dead criteria
    elif (signals['volume_ratio'] < 0.01 and
          signals['wallet_growth'] < -5 and
          signals['concentration'] > 70):
        candidate_state = 'dead'
        confidence = 0.90
    
    # Ambiguous case
    else:
        candidate_state = current_state  # Stay in current state
        confidence = 0.50
        log_ambiguity(signals)
    
    # Apply hysteresis
    if candidate_state != current_state:
        if confidence < 0.70:
            return current_state, confidence, "Insufficient confidence for transition"
    
    return candidate_state, confidence, "Clean classification"
```

## Risk Management

Risk management is the core safety layer of moltfun. All actions (even in paper mode) are evaluated against strict risk gates before logging or execution.

### Risk Gate Categories

**Liquidity Floor**

No action is permitted on tokens below minimum liquidity threshold.

```python
def check_liquidity_floor(token_liquidity_sol, min_liquidity_sol=5.0):
    """
    Enforce minimum liquidity requirement.
    
    Prevents interaction with illiquid tokens where slippage would be extreme.
    """
    if token_liquidity_sol < min_liquidity_sol:
        return False, f"Liquidity {token_liquidity_sol} SOL below floor {min_liquidity_sol} SOL"
    return True, "Liquidity check passed"
```

Default: 5 SOL minimum liquidity

**Concentration Limit**

No action is permitted on tokens with excessive holder concentration.

```python
def check_concentration_limit(top10_concentration, max_concentration=60.0):
    """
    Enforce concentration limit.
    
    Prevents interaction with tokens controlled by few wallets.
    """
    if top10_concentration > max_concentration:
        return False, f"Top 10 concentration {top10_concentration}% exceeds limit {max_concentration}%"
    return True, "Concentration check passed"
```

Default: 60% maximum concentration in top 10 holders

**Exposure Cap**

Total exposure across all positions cannot exceed configured maximum.

```python
def check_exposure_cap(current_exposure_sol, position_size_sol, max_exposure_sol=1.0):
    """
    Enforce total exposure limit.
    
    Prevents overconcentration of capital in Pump.fun tokens.
    """
    if current_exposure_sol + position_size_sol > max_exposure_sol:
        return False, f"Total exposure would be {current_exposure_sol + position_size_sol} SOL, exceeds {max_exposure_sol} SOL"
    return True, "Exposure cap check passed"
```

Default: 0 SOL in observe/paper modes, configurable for live (NOT RECOMMENDED)

**Position Size Limit**

Individual position sizes are capped.

```python
def check_position_size(position_size_sol, max_position_size_sol=0.5):
    """
    Enforce per-position size limit.
    """
    if position_size_sol > max_position_size_sol:
        return False, f"Position size {position_size_sol} SOL exceeds limit {max_position_size_sol} SOL"
    return True, "Position size check passed"
```

Default: 0 SOL in observe/paper modes

**Cooldown Period**

Prevents rapid repeated actions on the same token.

```python
def check_cooldown(token_id, last_action_time, cooldown_seconds=300):
    """
    Enforce cooldown between actions on same token.
    
    Prevents rapid oscillation and overtrading.
    """
    import time
    current_time = time.time()
    
    if last_action_time is None:
        return True, "No previous action"
    
    elapsed = current_time - last_action_time
    if elapsed < cooldown_seconds:
        return False, f"Cooldown active, {cooldown_seconds - elapsed:.0f}s remaining"
    
    return True, "Cooldown expired"
```

Default: 300 seconds (5 minutes) between actions on same token

**Daily Loss Limit**

Cumulative losses in a 24-hour period trigger kill switch.

```python
def check_daily_loss_limit(daily_pnl_sol, max_loss_sol=-0.5):
    """
    Enforce daily loss limit.
    
    If losses exceed limit, system enters observe-only mode.
    """
    if daily_pnl_sol < max_loss_sol:
        return False, f"Daily loss {daily_pnl_sol} SOL exceeds limit {max_loss_sol} SOL - KILL SWITCH ACTIVATED"
    return True, "Daily loss check passed"
```

Default: 0 SOL in observe/paper modes, triggers immediate shutdown if breached

### Composite Risk Gate

All risk gates must pass for any action to proceed.

```python
def evaluate_risk_gates(token_data, position_size_sol, portfolio_state):
    """
    Evaluate all risk gates.
    
    Returns: (bool, list of reasons)
    """
    results = []
    
    # Liquidity check
    passed, reason = check_liquidity_floor(
        token_data['liquidity_sol'],
        config.MIN_LIQUIDITY_SOL
    )
    results.append(('liquidity', passed, reason))
    
    # Concentration check
    passed, reason = check_concentration_limit(
        token_data['top10_concentration'],
        config.MAX_CONCENTRATION
    )
    results.append(('concentration', passed, reason))
    
    # Exposure check
    passed, reason = check_exposure_cap(
        portfolio_state['total_exposure_sol'],
        position_size_sol,
        config.MAX_EXPOSURE_SOL
    )
    results.append(('exposure', passed, reason))
    
    # Position size check
    passed, reason = check_position_size(
        position_size_sol,
        config.MAX_POSITION_SIZE_SOL
    )
    results.append(('position_size', passed, reason))
    
    # Cooldown check
    passed, reason = check_cooldown(
        token_data['token_id'],
        portfolio_state['last_action_times'].get(token_data['token_id']),
        config.COOLDOWN_SECONDS
    )
    results.append(('cooldown', passed, reason))
    
    # Daily loss check
    passed, reason = check_daily_loss_limit(
        portfolio_state['daily_pnl_sol'],
        config.MAX_DAILY_LOSS_SOL
    )
    results.append(('daily_loss', passed, reason))
    
    # All must pass
    all_passed = all(r[1] for r in results)
    reasons = [r[2] for r in results if not r[1]]
    
    return all_passed, reasons
```

### Kill Switch

If daily loss limit is breached, the system automatically enters observe-only mode and sends an alert.

```python
def activate_kill_switch():
    """
    Emergency shutdown of all live functionality.
    """
    global EXECUTION_MODE
    
    logger.critical("KILL SWITCH ACTIVATED - Daily loss limit breached")
    logger.critical("Switching to OBSERVE-ONLY mode")
    
    EXECUTION_MODE = 'observe'
    
    # Close all positions (if any)
    close_all_positions()
    
    # Send alert
    send_alert("KILL SWITCH ACTIVATED", "Daily loss limit exceeded, system in observe-only mode")
    
    # Log event
    log_kill_switch_event()
```

### Safety-First Design Principles

- **Default to inaction**: When in doubt, observe only
- **Explicit risk limits**: All thresholds are configurable and logged
- **Multiple gate layers**: Every action requires passing multiple independent checks
- **Fail-safe**: System defaults to safe state on errors or missing data
- **Audit trail**: Every decision, including rejected actions, is logged with full reasoning
- **No silent failures**: All risk gate rejections are logged and can trigger alerts

## Decision Loop

The main decision loop runs continuously, processing tokens at regular intervals. Each iteration follows the same sequence.

### Loop Pseudocode

```python
def main_loop():
    """
    Main decision loop.
    
    Runs continuously until stopped.
    """
    while True:
        # 1. Collect data
        tokens = collect_active_tokens()
        
        for token in tokens:
            try:
                # 2. Fetch on-chain data
                data = collect_token_data(token['token_id'])
                
                # 3. Compute signals
                signals = compute_all_signals(data)
                
                # 4. Classify lifecycle state
                state, confidence, reason = classify_state(
                    signals,
                    token.get('previous_state', 'emerging')
                )
                
                # 5. Evaluate risk gates
                risk_passed, risk_reasons = evaluate_risk_gates(
                    data,
                    position_size=0.0,  # Default for observe mode
                    portfolio_state=get_portfolio_state()
                )
                
                # 6. Determine action
                if EXECUTION_MODE == 'observe':
                    action = 'observe'
                elif not risk_passed:
                    action = 'skip'
                elif state in ['expanding', 'emerging'] and confidence > 0.75:
                    action = 'paper_buy' if EXECUTION_MODE == 'paper' else 'skip'
                else:
                    action = 'skip'
                
                # 7. Log decision
                log_decision(
                    token_id=token['token_id'],
                    signals=signals,
                    state=state,
                    confidence=confidence,
                    risk_passed=risk_passed,
                    risk_reasons=risk_reasons,
                    action=action,
                    explanation=reason
                )
                
                # 8. Execute (if applicable)
                if action.startswith('paper_'):
                    execute_paper_trade(token, action, signals, state)
                elif action.startswith('live_'):
                    # This branch should never execute in default config
                    logger.error("Live execution attempted but disabled")
                    activate_kill_switch()
                
            except Exception as e:
                logger.error(f"Error processing token {token['token_id']}: {e}")
                log_error(token['token_id'], str(e))
                continue
        
        # 9. Sleep until next interval
        time.sleep(COLLECTION_INTERVAL_SECONDS)
```

### Step-by-Step Breakdown

**Step 1: Collect Active Tokens**

Query Pump.fun for tokens launched within the observation window (default: last 24 hours).

**Step 2: Fetch On-Chain Data**

For each token, retrieve:
- Current liquidity
- Recent swap history
- Holder distribution
- Price history
- Wallet counts

**Step 3: Compute Signals**

Calculate all technical and participation signals using formulas defined in Signal Layer section.

**Step 4: Classify State**

Apply state classification logic to signal snapshot, considering current state and applying hysteresis.

**Step 5: Evaluate Risk Gates**

Run all risk checks. If any gate fails, action is automatically set to 'skip' and reasons are logged.

**Step 6: Determine Action**

Based on execution mode, state, confidence, and risk gates, decide action:
- `observe`: Log observation only
- `skip`: Skip due to risk or low confidence
- `paper_buy`: Simulate purchase (paper mode only)
- `paper_sell`: Simulate sale (paper mode only)

**Step 7: Log Decision**

Write structured JSON log with full context. See Logging section for format.

**Step 8: Execute**

In observe mode, no execution. In paper mode, update simulated portfolio. In live mode (disabled), this would execute trades.

**Step 9: Sleep**

Wait for next collection interval before repeating.

## Logging & Auditability

Every observation, decision, and action is logged in structured JSON format. Logs are designed for easy inspection, analysis, and replay.

### Log Structure

All logs follow this schema:

```json
{
  "timestamp": "2026-01-28T10:15:30.123Z",
  "token_id": "abc123...",
  "token_symbol": "EXAMPLE",
  "execution_mode": "observe",
  "signals": {
    "price_momentum": 12.5,
    "volume_momentum": 8.3,
    "volume_velocity": 5.2,
    "wallet_growth_rate": 25.0,
    "net_wallet_flow": 15,
    "top10_concentration": 45.2,
    "concentration_drift": -2.1,
    "liquidity_sol": 8.5,
    "age_hours": 2.3
  },
  "lifecycle_state": "expanding",
  "previous_state": "emerging",
  "confidence": 0.82,
  "state_reason": "Strong wallet growth and positive momentum, volume accelerating",
  "risk_gates": {
    "liquidity": {
      "passed": true,
      "reason": "Liquidity 8.5 SOL above floor 5.0 SOL"
    },
    "concentration": {
      "passed": true,
      "reason": "Top 10 concentration 45.2% below limit 60.0%"
    },
    "exposure": {
      "passed": true,
      "reason": "Total exposure 0.0 SOL within limit"
    },
    "position_size": {
      "passed": true,
      "reason": "Position size 0.0 SOL within limit"
    },
    "cooldown": {
      "passed": true,
      "reason": "No previous action"
    },
    "daily_loss": {
      "passed": true,
      "reason": "Daily P&L 0.0 SOL within limit"
    }
  },
  "risk_passed": true,
  "action": "observe",
  "action_reason": "Observe-only mode, no execution capability",
  "ambiguity_flags": [],
  "portfolio_state": {
    "total_exposure_sol": 0.0,
    "open_positions": 0,
    "daily_pnl_sol": 0.0
  }
}
```

### Sample Logs

**Observation Log (Emerging Token)**

```json
{
  "timestamp": "2026-01-28T10:20:15.456Z",
  "token_id": "xyz789...",
  "token_symbol": "NEWTOKEN",
  "execution_mode": "observe",
  "signals": {
    "price_momentum": 35.2,
    "volume_momentum": 42.1,
    "volume_velocity": 18.5,
    "wallet_growth_rate": 45.0,
    "net_wallet_flow": 28,
    "top10_concentration": 38.5,
    "concentration_drift": -5.3,
    "liquidity_sol": 12.3,
    "age_hours": 0.5
  },
  "lifecycle_state": "emerging",
  "previous_state": null,
  "confidence": 0.88,
  "state_reason": "Rapid wallet growth, strong momentum, low age",
  "risk_gates": {
    "liquidity": {"passed": true, "reason": "Liquidity 12.3 SOL above floor"},
    "concentration": {"passed": true, "reason": "Concentration 38.5% below limit"},
    "exposure": {"passed": true, "reason": "No exposure"},
    "position_size": {"passed": true, "reason": "No position"},
    "cooldown": {"passed": true, "reason": "First observation"},
    "daily_loss": {"passed": true, "reason": "No P&L"}
  },
  "risk_passed": true,
  "action": "observe",
  "action_reason": "Observe-only mode",
  "ambiguity_flags": []
}
```

**Skipped Action Log (Risk Gate Failure)**

```json
{
  "timestamp": "2026-01-28T11:05:42.789Z",
  "token_id": "def456...",
  "token_symbol": "RISKY",
  "execution_mode": "paper",
  "signals": {
    "price_momentum": 15.0,
    "volume_momentum": 10.5,
    "volume_velocity": 3.2,
    "wallet_growth_rate": 18.0,
    "net_wallet_flow": 8,
    "top10_concentration": 72.5,
    "concentration_drift": 8.2,
    "liquidity_sol": 6.8,
    "age_hours": 3.2
  },
  "lifecycle_state": "expanding",
  "previous_state": "emerging",
  "confidence": 0.75,
  "state_reason": "Positive momentum and wallet growth",
  "risk_gates": {
    "liquidity": {"passed": true, "reason": "Liquidity sufficient"},
    "concentration": {"passed": false, "reason": "Top 10 concentration 72.5% exceeds limit 60.0%"},
    "exposure": {"passed": true, "reason": "No exposure"},
    "position_size": {"passed": true, "reason": "No position"},
    "cooldown": {"passed": true, "reason": "Cooldown expired"},
    "daily_loss": {"passed": true, "reason": "No P&L"}
  },
  "risk_passed": false,
  "action": "skip",
  "action_reason": "Risk gate failed: concentration too high",
  "ambiguity_flags": []
}
```

**Paper Mode Trade Log**

```json
{
  "timestamp": "2026-01-28T12:30:22.111Z",
  "token_id": "ghi321...",
  "token_symbol": "PAPER",
  "execution_mode": "paper",
  "signals": {
    "price_momentum": 22.0,
    "volume_momentum": 18.5,
    "volume_velocity": 12.0,
    "wallet_growth_rate": 28.0,
    "net_wallet_flow": 18,
    "top10_concentration": 42.0,
    "concentration_drift": -3.5,
    "liquidity_sol": 15.2,
    "age_hours": 1.8
  },
  "lifecycle_state": "expanding",
  "previous_state": "emerging",
  "confidence": 0.85,
  "state_reason": "Strong expansion signals across all dimensions",
  "risk_gates": {
    "liquidity": {"passed": true, "reason": "Liquidity sufficient"},
    "concentration": {"passed": true, "reason": "Concentration acceptable"},
    "exposure": {"passed": true, "reason": "Simulated exposure within limit"},
    "position_size": {"passed": true, "reason": "Simulated position within limit"},
    "cooldown": {"passed": true, "reason": "Cooldown expired"},
    "daily_loss": {"passed": true, "reason": "Simulated P&L positive"}
  },
  "risk_passed": true,
  "action": "paper_buy",
  "action_reason": "Expanding state with high confidence, all risk gates passed",
  "paper_trade": {
    "size_sol": 0.5,
    "entry_price": 0.00012,
    "estimated_slippage": 0.02,
    "simulated_cost_sol": 0.51
  },
  "ambiguity_flags": []
}
```

### Log Retention

Logs are rotated daily and retained according to configuration (default: 30 days). Older logs can be archived for historical analysis.

### Log Analysis

The `scripts/analyze_logs.py` utility provides basic log analysis:

```bash
python scripts/analyze_logs.py --start-date 2026-01-20 --end-date 2026-01-28
```

Output includes:
- State distribution (percentage of observations in each state)
- Risk gate failure rates by type
- Average confidence scores by state
- Action distribution (observe/skip/paper)
- Ambiguity flag frequency

## Replay / Simulation Mode

moltfun supports replaying historical data to test classification logic, risk gates, and signal computation without live market exposure.

### Replay Process

Historical event data is loaded from saved logs or RPC historical queries. The system processes events in chronological order, computing signals and classifying states as if running live.

```bash
python scripts/replay_historical.py --start-date 2026-01-20 --end-date 2026-01-27 --mode paper
```

### Replay Capabilities

- Test signal thresholds on historical data
- Validate state classification logic
- Evaluate risk gate effectiveness
- Measure simulated performance (paper mode only)
- Debug misclassification edge cases

### Paper Mode

Paper mode runs with live data but simulates execution. No real trades occur. Simulated P&L is tracked based on observed prices.

Paper mode tracks:
- Simulated entry/exit prices
- Simulated position sizes
- Simulated slippage estimates
- Simulated fees
- Simulated P&L

Paper mode does NOT account for:
- Real slippage (may differ significantly from estimates)
- Partial fills or failed transactions
- MEV or front-running
- Actual market liquidity constraints

### Known Limitations

- Historical replay depends on RPC historical data availability (may be incomplete)
- Simulated slippage is estimated and may not reflect actual execution
- Bot detection and filtering are not implemented
- Wallet clustering is not detected
- Market microstructure effects are not modeled
- No accounting for transaction failures or reverts

### Performance Claims

**moltfun makes NO performance claims.**

Replay and paper mode results are for educational and testing purposes only. Past simulated performance does not predict future results. Real execution will differ from simulation.

## Troubleshooting

### Missing Data

**Symptom**: Logs show `null` or missing values for signals.

**Cause**: RPC node may be rate-limiting requests or missing historical data.

**Fix**:
- Increase `COLLECTION_INTERVAL_SECONDS` to reduce request rate
- Use a premium RPC endpoint with higher rate limits
- Check RPC node status and historical data availability

### Rate Limits

**Symptom**: Errors mentioning rate limits or 429 status codes.

**Cause**: Too many requests to RPC or Pump.fun API.

**Fix**:
- Reduce number of tokens tracked simultaneously (`MAX_TOKENS_TRACKED`)
- Increase collection interval
- Use multiple RPC endpoints with round-robin

### Malformed Events

**Symptom**: Parser errors or exceptions during event processing.

**Cause**: Unexpected event format from Pump.fun or RPC.

**Fix**:
- Update `event_parser.py` to handle new event formats
- Log malformed events for inspection
- Add validation and error handling for edge cases

### Misclassification Edge Cases

**Symptom**: Token classified in unexpected state.

**Cause**: Signal combinations that do not cleanly map to any state.

**Fix**:
- Review ambiguity flags in logs
- Adjust state thresholds in `config/states.yaml`
- Implement custom logic for specific edge cases
- Use manual override for known problematic tokens

### High Ambiguity Rate

**Symptom**: Many logs show ambiguity flags.

**Cause**: Signal thresholds may be too narrow or token behavior is genuinely ambiguous.

**Fix**:
- Widen state boundary thresholds
- Add additional signals to improve classification
- Accept that some tokens are inherently ambiguous
- Focus on high-confidence classifications only

### Log Disk Usage

**Symptom**: Logs consuming excessive disk space.

**Cause**: High logging volume with long retention period.

**Fix**:
- Reduce log retention days
- Compress old logs
- Filter verbose debug logs
- Implement log rotation with compression

## Security Considerations

### Local-Only Execution

moltfun is designed to run locally, not on a server. Running on a server exposes API keys and increases attack surface.

**Recommendations**:
- Run on a dedicated local machine or secure VM
- Do not expose any ports to the internet
- Use firewall rules to restrict outbound connections to known RPC/API endpoints only

### API Key Safety

API keys for RPC and Pump.fun should be treated as sensitive credentials.

**Best practices**:
- Store keys in `.env` file (never commit to git)
- Use read-only API keys where possible
- Rotate keys periodically
- Use separate keys for different environments (dev/prod)
- Monitor API key usage for anomalies

### Least Privilege

The system should run with minimum required permissions.

**Recommendations**:
- Run as non-root user
- Restrict file system write access to log directory only
- Use read-only RPC endpoints if available
- Disable unnecessary system services

### Redaction

Logs may contain sensitive information (wallet addresses, transaction hashes).

**Redaction features**:
- Wallet addresses are truncated in logs (first 8 + last 4 characters)
- Full addresses are stored in separate secure log files with restricted permissions
- Transaction hashes are logged but not linked to user identity
- PII is never logged

### Server Deployment Discouraged

Deploying moltfun on a server introduces several risks:

- API keys exposed to server environment
- Logs accessible to server administrators
- Potential for remote code execution if server is compromised
- Increased attack surface

**If server deployment is required:**
- Use dedicated machine with minimal software
- Implement strict firewall rules
- Enable intrusion detection
- Encrypt logs at rest
- Use secrets management system for API keys
- Regularly audit access logs

## Roadmap

Future development is focused on improving classification accuracy, adding richer signals, and enabling better inspection and analysis.

### Short-Term (1-3 months)

- **Enhanced classification heuristics**: Incorporate additional on-chain signals (transaction frequency, gas fees, contract interactions)
- **Improved visualization**: Web dashboard for real-time signal and state monitoring (read-only)
- **Richer holder analysis**: Wallet clustering detection, bot filtering, cohort analysis
- **Extended replay capabilities**: Support for full historical backtest with multiple strategies

### Medium-Term (3-6 months)

- **Public dashboards**: Read-only public interface for viewing token classifications and signals
- **Signal backtesting framework**: Systematic testing of signal parameters against historical data
- **Additional lifecycle states**: Sub-states or transition markers for finer-grained classification
- **Multi-chain support**: Extend to other token launch platforms beyond Pump.fun

### Long-Term (6+ months)

- **Machine learning classification**: Train models on historical state transitions to improve accuracy
- **Anomaly detection**: Identify unusual patterns that may indicate manipulation or exploits
- **Community signal contributions**: Framework for community-submitted signals and classification logic
- **Open dataset**: Publish anonymized classification results for research

### Non-Roadmap Items

The following are explicitly NOT planned:

- Guaranteed profit features or claims
- Fully automated trading without human oversight
- Proprietary or closed-source signals
- Token sales or revenue generation from the system itself
- Marketing or promotion of specific tokens

## FAQ

### Is this a trading bot?

moltfun is an observational agent designed to study token lifecycle behavior. By default, it operates in observe-only mode with no execution capability. Paper mode simulates decision-making without real trades. Live execution is disabled by default and strongly discouraged.

### Can it lose money?

In observe-only mode, no. In paper mode, simulated losses are tracked but no real funds are used. If live execution were enabled (NOT RECOMMENDED), yes, significant losses are possible. Pump.fun tokens are highly speculative and risky. Most tokens lose value quickly.

### Why Pump.fun?

Pump.fun provides a high-volume, transparent environment for studying token launch dynamics. The bonding curve mechanism creates consistent initial liquidity conditions, making lifecycle patterns more comparable across tokens. This is a research focus, not an endorsement of trading on the platform.

### Why not full automation?

Full automation without human oversight is dangerous in highly volatile and manipulated markets. moltfun is designed for observation, learning, and experimentation, not autonomous trading. Human judgment is essential for interpreting signals, understanding context, and making risk decisions.

### Why lifecycle states instead of buy/sell signals?

Buy/sell signals imply a recommendation or prediction, which moltfun explicitly avoids. Lifecycle states are descriptive classifications of current behavior, not prescriptive trading advice. States help organize observations but do not constitute financial guidance.

### What is the expected accuracy of classifications?

Classification accuracy depends heavily on signal thresholds, token behavior, and market conditions. Ambiguous cases are common. No accuracy guarantees are provided. Users should treat classifications as observations, not ground truth.

### Can I contribute my own signals?

Yes. The signal computation layer is modular. New signals can be added by implementing the signal interface and updating configuration. Pull requests are welcome, though they will be reviewed for quality and safety.

### Is there a hosted version?

No. moltfun is designed for local execution only. There is no hosted service, cloud deployment, or managed offering. Users run their own instance and are responsible for their own infrastructure.

### What data is collected about users?

None. moltfun does not collect user data, send telemetry, or phone home. All data stays local. Logs are stored on the user's machine and are not transmitted anywhere.

### Can I use this for live trading?

Technically, yes, but it is strongly discouraged. moltfun is experimental software with no guarantees. Live trading on Pump.fun carries extreme risk. Most users will lose money. The system is designed for observation and learning, not profit generation.

### How do I report a bug or issue?

Open an issue on GitHub with:
- Description of the problem
- Steps to reproduce
- Relevant log excerpts (with sensitive data redacted)
- Expected vs. actual behavior

### How do I request a feature?

Open a GitHub issue with:
- Description of the feature
- Use case or motivation
- Proposed implementation (if applicable)

Feature requests are considered based on alignment with project goals (transparency, inspection, safety).

## Disclaimer

**moltfun is experimental software provided as-is for educational and research purposes only.**

### Risk Warning

Trading cryptocurrency tokens, especially newly launched tokens on platforms like Pump.fun, carries extreme financial risk. Most tokens lose value rapidly. Significant losses are likely. Do not trade with funds you cannot afford to lose.

### Not Financial Advice

Nothing in this repository, documentation, or code constitutes financial, investment, tax, or legal advice. moltfun does not recommend buying, selling, or holding any specific token. All signals, classifications, and observations are for informational purposes only.

### No Warranties

This software is provided "as-is" without warranties of any kind, express or implied. The authors and contributors make no guarantees regarding:
- Accuracy of signals or classifications
- Reliability of data collection
- Profitability of any actions taken based on system output
- Security or safety of the software

### User Responsibility

Users are solely responsible for:
- Understanding the risks of cryptocurrency trading
- Configuring and operating the software safely
- Protecting API keys and sensitive data
- Complying with applicable laws and regulations
- Any financial losses incurred

### Liability

In no event shall the authors or contributors be liable for any direct, indirect, incidental, special, exemplary, or consequential damages arising from the use of this software.

### Regulatory Compliance

Users must comply with all applicable laws and regulations in their jurisdiction, including but not limited to securities laws, tax obligations, and anti-money laundering requirements.

## License

MIT License

Copyright (c) 2026 moltfun contributors

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

## Contributions

Contributions are welcome. Please follow these guidelines:

### Code Contributions

- Fork the repository
- Create a feature branch
- Write clear, documented code
- Add tests for new functionality
- Ensure all tests pass
- Submit a pull request with detailed description

### Documentation Contributions

- Improvements to this README
- Additional code comments
- Example configurations
- Troubleshooting guides

### Signal Contributions

- New signal implementations must include:
  - Clear mathematical definition or pseudocode
  - Rationale for inclusion
  - Test coverage
  - Configuration examples

### Review Process

All contributions are reviewed for:
- Code quality and clarity
- Alignment with project goals (transparency, safety, inspection)
- Security implications
- Potential for misuse

Contributions that promote unsafe behavior, make profit claims, or reduce transparency may be rejected.

### Code of Conduct

- Be respectful and professional
- Focus on technical merit
- Assume good faith
- Provide constructive feedback
- No harassment or discrimination

---

For questions, issues, or contributions, please use the GitHub repository issue tracker.