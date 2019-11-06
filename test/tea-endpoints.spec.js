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

    describe('GET /api/tea/:id', () => {
      context(`Given no teas`, () => {
        it(`responds 404 whe tea doesn't exist`, () => {
          return supertest(app)
            .get(`/api/tea/123`)
            .expect(404, {
              error: { message: `Tea doesn't exist` }
            })
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
  
        it('responds with 200 and the specified tea', () => {
          const teaId = 2
          const expectedTea = testTeas[teaId - 1]
          return supertest(app)
            .get(`/api/tea/${teaId}`)
            .expect(200, expectedTea)
        })
      })
    })
    describe('POST /api/tea', () => {
      ['name', 'collectionid'].forEach(field => {
        const newTea = {
          name: 'test-name',
          collectionid: 1
        }
  
        it(`responds with 400 missing '${field}' if not supplied`, () => {
          delete newTea[field]
  
          return supertest(app)
            .post(`/api/tea`)
            .send(newTea)
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
      
      it('adds a new tea to the database', () => {
        const newTea = {
          year: 1990,
          name: 'test-name',
          vendor: 'Dayi',
          quantity: 357,
          cost: 69,
          link: 'dayi.com',
          collectionid: 1
        }
        return supertest(app)
          .post(`/api/tea`)
          .send(newTea)
          .expect(201)
          .expect(res => {
            expect(res.body.year).to.eql(newTea.year)
            expect(res.body.name).to.eql(newTea.name)
            expect(res.body.vendor).to.eql(newTea.vendor)
            expect(res.body.quantity).to.eql(newTea.quantity)
            expect(res.body.cost).to.eql(newTea.cost)
            expect(res.body.link).to.eql(newTea.link)
            expect(res.body.collectionid).to.eql(newTea.collectionid)
            expect(res.body).to.have.property('id')
            expect(res.headers.location).to.eql(`/api/tea/${res.body.id}`)
          })
          .then(res =>
            supertest(app)
              .get(`/api/tea/${res.body.id}`)
              .expect(res.body)
          )
      })
    })
    describe('DELETE /api/tea/:id', () => {
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
  
        it('removes the tea by ID from the store', () => {
          const idToRemove = 2
          const expectedTeas = testTeas.filter(ta => ta.id !== idToRemove)
          return supertest(app)
            .delete(`/api/tea/${idToRemove}`)
            .expect(204)
            .then(() =>
              supertest(app)
                .get(`/api/tea`)
                .expect(expectedTeas)
            )
        })
      })
    })
    describe(`PATCH /api/tea/:id`, () => {
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
      
            it('responds with 204 and updates the teas', () => {
              const idToUpdate = 2
              const updateTea= {
                id: 2,
                year: 1990,
                name: 'updated-test-name',
                vendor: 'Crimson',
                quantity: 357,
                cost: 69,
                link: 'dayi.com',
                collectionid: 1
              }
              
              const expectedTea = {
                ...testTeas[idToUpdate - 1],
                ...updateTea
              }
              return supertest(app)
                .patch(`/api/tea/${idToUpdate}`)
                .send(updateTea)
                .expect(204)
                .then(res => 
                    supertest(app)
                    .get(`/api/tea/${idToUpdate}`)
                    .expect(expectedTea)
                  )
            })
            it(`responds with 400 when no required fields supplied`, () => {
              const idToUpdate = 2
              return supertest(app)
                .patch(`/api/tea/${idToUpdate}`)
                .send({ irrelevantField: 'foo' })
                .expect(400, {
                  error: {
                    message: `Request body must contain either 'name' or 'collectionid'`
                  }
                })
            })
            it(`responds with 204 when updating only a subset of fields`, () => {
              const idToUpdate = 2
              const updateTea = {
                name: 'updated name test',
              }
              const expectedTea = {
                ...testTeas[idToUpdate - 1],
                ...updateTea
              }
        
              return supertest(app)
                .patch(`/api/tea/${idToUpdate}`)
                .send({
                  ...updateTea,
                  fieldToIgnore: 'should not be in GET response'
                })
                .expect(204)
                .then(res =>
                  supertest(app)
                    .get(`/api/tea/${idToUpdate}`)
                    .expect(expectedTea)
                )
            })
          })  
     })
})