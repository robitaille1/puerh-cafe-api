const CollectionService = {
    getAllCollections(knex) {
        return knex.select('*').from('collections')
    } 
}

module.exports = CollectionService