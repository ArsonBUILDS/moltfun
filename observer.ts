import { collectPumpEvents } from "./collector/pumpEvents";
import { classifyState } from "./states/classifier";
import { logDecision } from "./logger";

export async function startObserver(config: any) {
  const events = await collectPumpEvents();
  for (const event of events) {
    const state = classifyState(event);
    logDecision({ event, state });
  }
}