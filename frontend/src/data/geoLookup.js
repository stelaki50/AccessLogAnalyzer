// src/data/geoLookup.js
let starts = null;
let countries = null;
let loadingPromise = null;

function loadGeoDb() {
  if (starts) return Promise.resolve();
  if (loadingPromise) return loadingPromise;

  async function fetchOrThrow(url) {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Failed to load ${url}: ${res.status} ${res.statusText}`);
    }
    return res;
  }

  loadingPromise = Promise.all([
    fetchOrThrow(`/geo/geo-starts.bin`).then(r => r.arrayBuffer()),
    fetchOrThrow(`/geo/geo-countries.json`).then(r => r.json())
  ]).then(([startsBuf, countriesJson]) => {
    starts = new Uint32Array(startsBuf);
    countries = countriesJson;
  });

  return loadingPromise;
}

function ipToInt(ip) {
  return ip.split(".").reduce((acc, octet) => (acc << 8) + Number(octet), 0) >>> 0;
}

function lookupCountry(ip) {
  if (!starts) throw new Error("Geo DB not loaded yet — call loadGeoDb() first");

  // Guard against non-IPv4 input (e.g. IPv6, malformed strings)
  const parts = ip.split(".");
  if (parts.length !== 4) return "Unknown";

  const target = ipToInt(ip);

  let lo = 0, hi = starts.length - 1, result = -1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (starts[mid] <= target) {
      result = mid;
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }

  return result === -1 ? "Unknown" : countries[result];
}

export { loadGeoDb, lookupCountry };