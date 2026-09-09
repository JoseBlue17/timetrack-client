export function shortenTxid(txid?: string) {
  if (!txid) return 'TX pendiente';
  if (txid.length <= 14) return txid;
  return `TX: ${txid.slice(0, 6)}...${txid.slice(-4)}`;
}
