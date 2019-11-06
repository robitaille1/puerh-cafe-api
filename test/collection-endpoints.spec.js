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
    describe('GET /api/collection/:id', () => {
      context(`Given no collections`, () => {
        it(`responds 404 whe collection doesn't exist`, () => {
          return supertest(app)
            .get(`/api/collection/123`)
            .expect(404, {
              error: { message: `Collection doesn't exist` }
            })
        })
      })
      context('Given there are collections in the database', () => {
        const testCollections = fixtures.makeCollectionArray()
  
        beforeEach('insert collections', () => {
          return db
            .into('collections')
            .insert(testCollections)
        })
  
        it('responds with 200 and the specified collection', () => {
          const collectionId = 2
          const expectedCollection = testCollections[collectionId - 1]
          return supertest(app)
            .get(`/api/collection/${collectionId}`)
            .expect(200, expectedCollection)
        })
      })
    })
    describe('POST /api/collection', () => {
      ['name', 'userid'].forEach(field => {
        const newCollection = {
          name: 'test-name',
          userid: 1
        }
  
        it(`responds with 400 missing '${field}' if not supplied`, () => {
          delete newCollection[field]
  
          return supertest(app)
            .post(`/api/collection`)
            .send(newCollection)
            .expect(400, {
              error: { message: `Missing '${field}' in request body` }
            })
        })
      })
      it('adds a new collection to the database', () => {
        const newCollection = {
          name: 'test-name',
          userid: 1
        }
        return supertest(app)
          .post(`/api/collection`)
          .send(newCollection)
          .expect(201)
          .expect(res => {
            expect(res.body.name).to.eql(newCollection.name)
            expect(res.body.userid).to.eql(newCollection.userid)
            expect(res.body).to.have.property('id')
            expect(res.headers.location).to.eql(`/api/collection/${res.body.id}`)
          })
          .then(res =>
            supertest(app)
              .get(`/api/collection/${res.body.id}`)
              .expect(res.body)
          )
      })
    })
    describe('DELETE /api/collection/:id', () => {
      context('Given there are collections in the database', () => {
        const testCollections = fixtures.makeCollectionArray()
  
        beforeEach('insert collections', () => {
          return db
            .into('collections')
            .insert(testCollections)
        })
  
        it('removes the collection by ID from the store', () => {
          const idToRemove = 2
          const expectedCollections = testCollections.filter(cl => cl.id !== idToRemove)
          return supertest(app)
            .delete(`/api/collection/${idToRemove}`)
            .expect(204)
            .then(() =>
              supertest(app)
                .get(`/api/collection`)
                .expect(expectedCollections)
            )
        })
      })
    })

    describe(`PATCH /api/collection/:id`, () => {
      context('Given there are collections in the database', () => {
        const testCollections = fixtures.makeCollectionArray()

        beforeEach('insert collections', () => {
          return db
            .into('collections')
            .insert(testCollections)
        })
      
            it('responds with 204 and updates the collections', () => {
              const idToUpdate = 2
              const updateCollection= {
                id: 2,
                name: 'updated test name',
                userid: 1,
              }
              
              const expectedCollection = {
                ...testCollections[idToUpdate - 1],
                ...updateCollection
              }
              return supertest(app)
                .patch(`/api/collection/${idToUpdate}`)
                .send(updateCollection)
                .expect(204)
                .then(res => 
                    supertest(app)
                    .get(`/api/collection/${idToUpdate}`)
                    .expect(expectedCollection)
                  )
            })
            it(`responds with 400 when no required fields supplied`, () => {
              const idToUpdate = 2
              return supertest(app)
                .patch(`/api/collection/${idToUpdate}`)
                .send({ irrelevantField: 'foo' })
                .expect(400, {
                  error: {
                    message: `Request body must contain either 'name' or 'userid'`
                  }
                })
            })
            it(`responds with 204 when updating only a subset of fields`, () => {
              const idToUpdate = 2
              const updateCollection = {
                name: 'updated name test',
              }
              const expectedCollection = {
                ...testCollections[idToUpdate - 1],
                ...updateCollection
              }
        
              return supertest(app)
                .patch(`/api/collection/${idToUpdate}`)
                .send({
                  ...updateCollection,
                  fieldToIgnore: 'should not be in GET response'
                })
                .expect(204)
                .then(res =>
                  supertest(app)
                    .get(`/api/collection/${idToUpdate}`)
                    .expect(expectedCollection)
                )
            })
          })  
     })
})