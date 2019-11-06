const knex = require('knex')
const app = require('../src/app')
const fixtures = require('./session-fixtures')
const helpers = require('./test-helpers')
const collectionFixtures = require('./collection-fixtures')
const teaFixtures = require('./tea-fixtures')


describe('Session Endpoints', function() {
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

      describe(`GET /api/session`, () => {
        context(`Given no sessions`, () => {
          it(`responds with 200 and an empty list`, () => {
            return supertest(app)
              .get('/api/session')
              .expect(200, [])
          })
        })
        context('Given there are sessions in the database', () => {
          const testCollections = collectionFixtures.makeCollectionArray()
          const testTeas = teaFixtures.makeTeaArray()
          const testSessions = fixtures.makeSessionArray()

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

          beforeEach('insert sessions', () => {
            return db
              .into('sessions')
              .insert(testSessions)
          })
    
          it('gets the teas from the database', () => {
            return supertest(app)
              .get('/api/session')
              .expect(200, testSessions)
          })
        })
    })
})