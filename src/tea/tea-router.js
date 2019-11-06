const path = require('path')
const express = require('express')
const TeaService = require('./tea-service')

const teaRouter = express.Router()
const jsonParser = express.json()

const serializeTea = tea => ({
    id: tea.id,
    year: tea.year,
    name: tea.name,
    vendor: tea.vendor,
    quantity: tea.quantity,
    cost: tea.cost,
    link: tea.link,
    collectionid: tea.collectionid
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
    .post(jsonParser, (req, res, next) => {
        const { year, name, vendor, quantity, cost, link, collectionid } = req.body
        const newTea = { year, name, vendor, quantity, cost, link, collectionid } 

            if (name == null)
                return res.status(400).json({
                error: { message: `Missing 'name' in request body` }
                })
            
            if (collectionid == null)
                return res.status(400).json({
                error: { message: `Missing 'collectionid' in request body` }
            })

            TeaService.insertTea(
                req.app.get('db'),
                newTea
            )
                .then(tea => {
                    res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${tea.id}`))
                    .json(serializeTea(tea))
                })
                .catch(next)
    })

teaRouter
    .route('/:teaId')
    .get((req, res, next) => {
        TeaService.getById(
            req.app.get('db'),
            req.params.teaId
        )
        .then(tea => {
            if(!tea) {
                return res.status(404).json({
                    error: { message: `Tea doesn't exist`}
                })
            }
            res.tea = tea
            next()
        })
        .catch(next)
    })
    .get((req, res, next) => {
        res.json(serializeTea(res.tea))
    })
    .delete((req, res, next) => {
        TeaService.deleteTea(
            req.app.get('db'),
            req.params.teaId
        )
        .then(numRowsAffected => {
            res.status(204).end()
        })
        .catch(next)
    })
    .patch(jsonParser, (req, res, next) => {
        const { year, name, vendor, quantity, cost, link, collectionid } = req.body
        const teaToUpdate = { year, name, vendor, quantity, cost, link, collectionid } 

        const numberOfValues = Object.values(teaToUpdate).filter(Boolean).length

        if (numberOfValues === 0) {
            return res.status(400).json({
            error: {
                message: `Request body must contain either 'name' or 'collectionid'`
            }
            })
        }
        TeaService.updateTea(
            req.app.get('db'),
            req.params.teaId,
            teaToUpdate
        )
        .then(numRowsAffected => {
            res.status(204).end()
        })
        .catch(next)
    })

module.exports = teaRouter