const initState = {
  fleets: {
    watchlist: [
      /* WSubject */
    ],
  },
  ships: {
    sort: {
      method: 'level',
      reversed: false,
    },
    filter: {
      // must be sorted
      lessThanArr: [50,53,76,85,100],
      // current selected stype (Ext for extended)
      stypeExt: 'stype-2',
      moraleFilters: {
        /*
           if not empty:

           'stype-2': 'all',
           'stype-20': 'lt-50',
           ...

         */
      },
    },
  },
  tab: 'fleet', // fleet / ship
  ready: false,
}

export {
  initState,
}
