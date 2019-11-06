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
    describe('GET /api/session/:id', () => {
      context(`Given no sessions`, () => {
        it(`responds 404 when session doesn't exist`, () => {
          return supertest(app)
            .get(`/api/session/123`)
            .expect(404, {
              error: { message: `Session doesn't exist` }
            })
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
  
        it('responds with 200 and the specified session', () => {
          const sessionId = 2
          const expectedSession = testSessions[sessionId - 1]
          return supertest(app)
            .get(`/api/session/${sessionId}`)
            .expect(200, expectedSession)
        })
      })
    })
    describe('POST /api/session', () => {
      ['name', 'teaid'].forEach(field => {
        const newSession= {
          name: 'test-name',
          teaid: 1
        }
  
        it(`responds with 400 missing '${field}' if not supplied`, () => {
          delete newSession[field]
  
          return supertest(app)
            .post(`/api/session`)
            .send(newSession)
            .expect(400, {
              error: { message: `Missing '${field}' in request body` }
            })
        })
      })
        const testCollections = collectionFixtures.makeCollectionArray()
        beforeEach('insert collections', () => {
          return db
            .into('collections')
            .insert(testCollections)
        })

        const testTeas = teaFixtures.makeTeaArray()
        beforeEach('insert teas', () => {
          return db
            .into('teas')
            .insert(testTeas)
        })
      
      
      it('adds a new session to the database', () => {
        const newSession = {
          name: 'test-tea',
          teaid: 1,
          quantity: 10,
          parameters: 'Very hot',
          notes: 'So good',
          rating: 5
        }
        return supertest(app)
          .post(`/api/session`)
          .send(newSession)
          .expect(201)
          .expect(res => {
            expect(res.body.name).to.eql(newSession.name)
            expect(res.body.teaid).to.eql(newSession.teaid)
            expect(res.body.quantity).to.eql(newSession.quantity)
            expect(res.body.parameters).to.eql(newSession.parameters)
            expect(res.body.notes).to.eql(newSession.notes)
            expect(res.body.rating).to.eql(newSession.rating)
            expect(res.body).to.have.property('id')
            expect(res.headers.location).to.eql(`/api/session/${res.body.id}`)
          })
          .then(res =>
            supertest(app)
              .get(`/api/session/${res.body.id}`)
              .expect(res.body)
          )
      })
    })
    describe('DELETE /api/session/:id', () => {
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
  
        it('removes the session by ID from the store', () => {
          const idToRemove = 2
          const expectedSessions = testSessions.filter(se => se.id !== idToRemove)
          return supertest(app)
            .delete(`/api/session/${idToRemove}`)
            .expect(204)
            .then(() =>
              supertest(app)
                .get(`/api/session`)
                .expect(expectedSessions)
            )
        })
      })
    })
    describe(`PATCH /api/session/:id`, () => {
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
      
            it('responds with 204 and updates the collections', () => {
              const idToUpdate = 2
              const updateSession= {
                id: 2,
                name: 'test-tea',
                teaid: 1,
                quantity: 10,
                parameters: 'updated parameters',
                notes: 'updated notes',
                rating: 5
              }
              
              const expectedSession = {
                ...testSessions[idToUpdate - 1],
                ...updateSession
              }
              return supertest(app)
                .patch(`/api/session/${idToUpdate}`)
                .send(updateSession)
                .expect(204)
                .then(res => 
                    supertest(app)
                    .get(`/api/session/${idToUpdate}`)
                    .expect(expectedSession)
                  )
            })
            it(`responds with 400 when no required fields supplied`, () => {
              const idToUpdate = 2
              return supertest(app)
                .patch(`/api/session/${idToUpdate}`)
                .send({ irrelevantField: 'foo' })
                .expect(400, {
                  error: {
                    message: `Request body must contain either 'name' or 'teaid'`
                  }
                })
            })
            it(`responds with 204 when updating only a subset of fields`, () => {
              const idToUpdate = 2
              const updateSession = {
                name: 'updated name test',
              }
              const expectedSession = {
                ...testSessions[idToUpdate - 1],
                ...updateSession
              }
        
              return supertest(app)
                .patch(`/api/session/${idToUpdate}`)
                .send({
                  ...updateSession,
                  fieldToIgnore: 'should not be in GET response'
                })
                .expect(204)
                .then(res =>
                  supertest(app)
                    .get(`/api/session/${idToUpdate}`)
                    .expect(expectedSession)
                )
            })
          })  
     })
})