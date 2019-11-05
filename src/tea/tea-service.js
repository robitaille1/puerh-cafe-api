const TeaService = {
    getAllTeas(knex) {
        return knex.select('*').from('teas')
    } 
}

module.exports = TeaService