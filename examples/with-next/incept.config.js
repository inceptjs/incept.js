module.exports = {
  language: 'en_US',
  schema: {
    build: './schemas',
    casing: 'snake', //snake|camel, 
    prefix: '[table]' //[table]|custom (wo snake)
  },
  fieldset: {
    build: './fieldsets'
  },
  plugins: [
    '@inceptjs/prisma'
  ]
}