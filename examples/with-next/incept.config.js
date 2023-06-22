module.exports = {
  language: 'en_US',
  schema: {
    build: './schemas',
    casing: 'camel', //snake|camel, 
    prefix: '[table]' //[table]|custom (wo snake)
  },
  prisma: {
    provider: 'cockroachdb',
    url: 'DATABASE_URL'
  },
  fieldset: {
    build: './fieldsets',
    casing: 'camel', //snake|camel, 
    prefix: '[table]' //[table]|custom (wo snake)
  },
  plugins: [
    '@inceptjs/prisma'
  ]
}