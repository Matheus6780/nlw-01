import Knex from 'knex'

export const up = async (knex: Knex) => {
    //Criar a tabela
    return knex.schema.createTable('items', table => {
        table.increments('id').primary(),
        table.string('image').notNullable(),
        table.string('title').notNullable()
    })
}

export const down = async (knex: Knex) => {
 // Voltar atrás (deletar) 
    return knex.schema.dropTable('items')
}
