function cleanTables(db) {
    return db.transaction(trx =>
      trx.raw(
        `TRUNCATE 
          collections,
          teas,
          sessions
        `
      )
      .then(() =>
        Promise.all([
          trx.raw(`ALTER SEQUENCE collections_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE teas_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE sessions_id_seq minvalue 0 START WITH 1`),
          trx.raw(`SELECT setval('collections_id_seq', 0)`),
          trx.raw(`SELECT setval('teas_id_seq', 0)`),
          trx.raw(`SELECT setval('sessions_id_seq', 0)`),
        ])
      )
    )
  }
  
  
  
  module.exports = {
    cleanTables
  }