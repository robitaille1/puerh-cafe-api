const path = require('path')
const express = require('express')
const CollectionService = require('./collection-service')
// const { requireAuth } = require('../middleware/basic-auth')

const collectionRouter = express.Router()
const jsonParser = express.json()

const serializeCollection = collection => ({
    id: collection.id,
    name: collection.name,
    userid: collection.userid
})

collectionRouter
    .route('/')
    // .all(requireAuth)
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        CollectionService.getAllCollections(knexInstance)
            .then(collections => {
                res.json(collections.map(serializeCollection))
            })
            .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const { name, userid } = req.body
        const newCollection = { name, userid }

        for (const [key, value] of Object.entries(newCollection))
            if (value == null)
                return res.status(400).json({
                error: { message: `Missing '${key}' in request body` }
                })

            CollectionService.insertCollection(
                req.app.get('db'),
                newCollection
            )
                .then(collection => {
                    res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${collection.id}`))
                    .json(serializeCollection(collection))
                })
                .catch(next)
    })


collectionRouter
    .route('/:collectionId')
    .get((req, res, next) => {
        CollectionService.getById(
            req.app.get('db'),
            req.params.collectionId
        )
        .then(collection => {
            if(!collection) {
                return res.status(404).json({
                    error: { message: `Collection doesn't exist`}
                })
            }
            res.collection = collection
            next()
        })
        .catch(next)
    })
    .get((req, res, next) => {
        res.json(serializeCollection(res.collection))
    })
    .delete((req, res, next) => {
        CollectionService.deleteCollection(
            req.app.get('db'),
            req.params.collectionId
        )
        .then(numRowsAffected => {
            res.status(204).end()
        })
        .catch(next)
    })
    .patch(jsonParser, (req, res, next) => {
        const { name, userid } = req.body
        const collectionToUpdate = { name, userid } 

        const numberOfValues = Object.values(collectionToUpdate).filter(Boolean).length

        if (numberOfValues === 0) {
            return res.status(400).json({
            error: {
                message: `Request body must contain either 'name' or 'userid'`
            }
            })
        }
        CollectionService.updateCollection(
            req.app.get('db'),
            req.params.collectionId,
            collectionToUpdate
        )
        .then(numRowsAffected => {
            res.status(204).end()
        })
        .catch(next)
    })

module.exports = collectionRouter