const TeaService = {
    getAllTeas(knex) {
        return knex.select('*').from('teas')
    }, 
    insertTea(knex, newSession) {
        return knex
            .insert(newSession)
            .into('teas')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    getById(knex, id) {
        return knex.from('teas').select('*').where('id', id).first()
    },
    deleteTea(knex, id) {
        return knex('teas')
            .where({ id })
            .delete()
    },
    updateTea(knex, id, newTeaFields) {
        return knex('teas')
          .where({ id })
          .update(newTeaFields)
    }
}

module.exports = TeaService