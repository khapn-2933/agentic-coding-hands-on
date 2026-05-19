const DEFAULT_EVENT_START_AT = "2025-12-26T18:30:00+07:00";

export function getEventStartAt(): string {
  return process.env.NEXT_PUBLIC_EVENT_START_AT ?? DEFAULT_EVENT_START_AT;
}
