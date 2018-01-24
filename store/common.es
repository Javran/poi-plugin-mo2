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
      // Array of <IntPredRep>, but without {type: 'all'}.
      // all elements must have unique result over IntPredRep.toId
      methods: [50,53,76,85,100].map(value =>
        ({type: 'lessThan', value})
      ),

      // current selected stype (Ext for extended)
      stypeExt: 'stype-2',
      moraleFilters: {
        /*
           if not empty:

           'stype-2': <IntPredRep>,
           'stype-20': <IntPredRep>,
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
