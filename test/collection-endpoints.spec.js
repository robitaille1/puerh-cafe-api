const knex = require('knex')
const app = require('../src/app')
const fixtures = require('./collection-fixtures')
const helpers = require('./test-helpers')


describe('Collection Endpoints', function() {
    let db
    
    before('make knex instance', () => {
        db = knex({
          client: 'pg',
          connection: process.env.TEST_DATABASE_URL,
        })
        app.set('db', db)
      })

      after('disconnect from db', () => db.destroy())

      before('cleanup', () => helpers.cleanTables(db))

      afterEach('cleanup', () => helpers.cleanTables(db))

      describe(`GET /api/collection`, () => {
        context(`Given no collections`, () => {
          it(`responds with 200 and an empty list`, () => {
            return supertest(app)
              .get('/api/collection')
              .expect(200, [])
          })
        })
        context('Given there are collections in the database', () => {
          const testCollections = fixtures.makeCollectionArray()
    
          beforeEach('insert Collections', () => {
            return db
              .into('collections')
              .insert(testCollections)
          })
    
          it('gets the collections from the database', () => {
            return supertest(app)
              .get('/api/collection')
              .expect(200, testCollections)
          })
        })
    })
})