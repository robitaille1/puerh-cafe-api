// const path = require('path')
const express = require('express')
const TeaService = require('./tea-service')

const teaRouter = express.Router()
// const jsonParser = express.json()

const serializeTea = tea => ({
    id: tea.id,
    year: tea.year,
    name: tea.name,
    vendor: tea.vendor,
    quantity: tea.quantity,
    cost: tea.cost,
    collectionId: tea.collectionid
})

teaRouter
    .route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        TeaService.getAllTeas(knexInstance)
            .then(teas => {
                res.json(teas.map(serializeTea))
            })
            .catch(next)
    })

module.exports = teaRouter