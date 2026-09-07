// Ordering rules shared by the browser extension and the iOS app. Pure: no
// storage access, no clock. Callers supply `usage` and, for record(), `now`.
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  } else {
    root.RadioOrdering = api;
  }
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  function sort(stations, usage) {
    const rank = new Map(stations.map((station, index) => [station.id, index]));
    return stations.slice().sort((first, second) => {
      const firstUsage = usage[first.id] || {};
      const secondUsage = usage[second.id] || {};
      const firstCount = firstUsage.count || 0;
      const secondCount = secondUsage.count || 0;

      if (firstCount !== secondCount) {
        return secondCount - firstCount;
      }

      const firstAt = firstUsage.lastPlayedAt || 0;
      const secondAt = secondUsage.lastPlayedAt || 0;
      if (firstAt !== secondAt) {
        return secondAt - firstAt;
      }

      return rank.get(first.id) - rank.get(second.id);
    });
  }

  function record(usage, stationId, now) {
    const previous = usage[stationId] || {};
    return Object.assign({}, usage, {
      [stationId]: {
        count: (previous.count || 0) + 1,
        lastPlayedAt: now
      }
    });
  }

  return { sort: sort, record: record };
}));
