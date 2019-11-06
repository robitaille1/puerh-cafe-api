// const path = require('path')
const express = require('express')
const CollectionService = require('./collection-service')

const collectionRouter = express.Router()
// const jsonParser = express.json()

const serializeCollection = collection => ({
    id: collection.id,
    name: collection.name,
    userid: collection.userid
})

collectionRouter
    .route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        CollectionService.getAllCollections(knexInstance)
            .then(collections => {
                res.json(collections.map(serializeCollection))
            })
            .catch(next)
    })

module.exports = collectionRouter