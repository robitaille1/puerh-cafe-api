// const path = require('path')
const express = require('express')
const SessionService = require('./session-service')

const sessionRouter = express.Router()
// const jsonParser = express.json()

const serializeSession = session => ({
    id: session.id,
    name: session.name,
    teaId: session.userid,
    quantity: session.quantity,
    parameters: session.parameters,
    notes: session.notes,
    rating: session.rating,
})

sessionRouter
    .route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        SessionService.getAllSessions(knexInstance)
            .then(sessions => {
                res.json(sessions.map(serializeSession))
            })
            .catch(next)
    })

module.exports = sessionRouter