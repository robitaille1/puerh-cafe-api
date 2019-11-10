const path = require('path')
const express = require('express')
const SessionService = require('./session-service')

const sessionRouter = express.Router()
const jsonParser = express.json()

const serializeSession = session => ({
    id: session.id,
    name: session.name,
    teaid: session.teaid,
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
    .post(jsonParser, (req, res, next) => {
        const { name, teaid, quantity, parameters, notes, rating } = req.body
        const newSession = { name, teaid, quantity, parameters, notes, rating }

            if (name == null)
                return res.status(400).json({
                error: { message: `Missing 'name' in request body` }
                })

            if (teaid == null)
                return res.status(400).json({
                error: { message: `Missing 'teaid' in request body` }
            })

            SessionService.insertSession(
                req.app.get('db'),
                newSession
            )
                .then(session => {
                    res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${session.id}`))
                    .json(serializeSession(session))
                })
                .catch(next)
    })

sessionRouter
    .route('/:sessionId')
    .get((req, res, next) => {
        SessionService.getById(
            req.app.get('db'),
            req.params.sessionId
        )
        .then(session => {
            if(!session) {
                return res.status(404).json({
                    error: { message: `Session doesn't exist`}
                })
            }
            res.session = session
            next()
        })
        .catch(next)
    })
    .get((req, res, next) => {
        res.json(serializeSession(res.session))
    })
    .delete((req, res, next) => {
        SessionService.deleteSession(
            req.app.get('db'),
            req.params.sessionId
        )
        .then(numRowsAffected => {
            res.status(204).end()
        })
        .catch(next)
    })
    .patch(jsonParser, (req, res, next) => {
        const { name, teaid, quantity, parameters, notes, rating } = req.body
        const sessionToUpdate = { name, teaid, quantity, parameters, notes, rating }  

        const numberOfValues = Object.values(sessionToUpdate).filter(Boolean).length

        if (numberOfValues === 0) {
            return res.status(400).json({
            error: {
                message: `Request body must contain either 'name' or 'teaid'`
            }
            })
        }
        SessionService.updateSession(
            req.app.get('db'),
            req.params.sessionId,
            sessionToUpdate
        )
        .then(numRowsAffected => {
            res.status(204).end()
        })
        .catch(next)
    })

module.exports = sessionRouter