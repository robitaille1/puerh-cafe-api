const knex = require('knex')
const app = require('../src/app')
const fixtures = require('./tea-fixtures')
const helpers = require('./test-helpers')
const collectionFixtures = require('./collection-fixtures')


describe('Tea Endpoints', function() {
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

      describe(`GET /api/tea`, () => {
        context(`Given no teas`, () => {
          it(`responds with 200 and an empty list`, () => {
            return supertest(app)
              .get('/api/tea')
              .expect(200, [])
          })
        })
        context('Given there are teas in the database', () => {
          const testCollections = collectionFixtures.makeCollectionArray()
          const testTeas = fixtures.makeTeaArray()

          beforeEach('insert collections', () => {
            return db
              .into('collections')
              .insert(testCollections)
          })
    
          beforeEach('insert teas', () => {
            return db
              .into('teas')
              .insert(testTeas)
          })
    
          it('gets the teas from the database', () => {
            return supertest(app)
              .get('/api/tea')
              .expect(200, testTeas)
          })
        })
    })
})