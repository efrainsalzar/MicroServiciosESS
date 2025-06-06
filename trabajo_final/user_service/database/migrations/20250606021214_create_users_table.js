// database/migrations/[timestamp]_create_users_table.js

exports.up = function(knex) {
  return knex.schema.createTable('users', (table) => {
    // ID autoincremental
    table.increments('id').primary();
    
    // Nombre (como en tu modelo original)
    table.string('name', 255).notNullable();
    
    // Email con validación de unicidad
    table.string('email', 255).notNullable().unique();
    
    // Password hash
    table.string('password_hash', 255).notNullable();
    
    // Rol del usuario
    table.string('role', 50).notNullable();
    
    // Fecha de creación (como en tu SELECT original)
    table.timestamp('created_at').defaultTo(knex.fn.now());
    
    // Índices para mejor performance
    table.index(['email'], 'idx_users_email');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('users');
};