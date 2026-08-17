export function newMessageId() {
  return `msg_${Math.random().toString(36).slice(2, 10)}`;
}
