module.exports = {
  language: 'en_US',
  schema: {
    build: './schemas',
    casing: 'camel', //snake|camel, 
    prefix: '[table]' //[table]|custom (wo snake)
  },
  fieldset: {
    build: './fieldsets'
  },
  plugins: [
    '@inceptjs/prisma'
  ]
}