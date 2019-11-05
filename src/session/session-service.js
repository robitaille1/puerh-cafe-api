const SessionService = {
    getAllSessions(knex) {
        return knex.select('*').from('sessions')
    } 
}

module.exports = SessionService