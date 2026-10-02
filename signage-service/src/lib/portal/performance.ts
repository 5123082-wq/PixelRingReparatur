export function portalReadTiming(operation = 'portal.read') {
  const started = performance.now(); let authenticated = started;
  return { authenticated() { authenticated = performance.now(); }, headers() {
    const finished = performance.now();
    const authMs = Number((authenticated - started).toFixed(1)); const dataMs = Number((finished - authenticated).toFixed(1));
    console.info(JSON.stringify({ event: 'portal.performance', operation, at: Date.now(), authMs, dataMs }));
    return { 'Cache-Control': 'private, no-store', 'Server-Timing': `auth;dur=${authMs},data;dur=${dataMs}` };
  } };
}

export function portalDataTiming(operation: 'summary' | 'detail' | 'messages') {
  const started = performance.now(); let prepared = started;
  return { queried() { prepared = performance.now(); }, complete() {
    console.info(JSON.stringify({ event: 'portal.data', operation, dbMs: Number((prepared-started).toFixed(1)), prepareMs: Number((performance.now()-prepared).toFixed(1)) }));
  } };
}
