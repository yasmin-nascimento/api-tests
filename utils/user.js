const faker = require('faker')
const testServer = require('../utils/testServer')

const jsonUsuario = () => {
  return {
    nome: faker.name.firstName() + ' ' + faker.name.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    administrador: `${faker.random.boolean()}`
  }
}

const criarUsuario = async usuario => {
  return await testServer.post('/usuarios').send(usuario)
}

const jsonAdmin = () => {
  return {
    nome: faker.name.firstName() + ' ' + faker.name.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    administrador: 'true'
  }
}

const adminUsuario = async admin => {
  return await testServer.post('/usuarios').send(admin)
}

const postUser = async () => {
  const { body } = await testServer.post('/usuarios').send(jsonAdmin())

  return body
}

const getAdminUserById = async id => {
  const { body } = await testServer.get(`${'/usuarios'}/${id}`)
  return body
}

const login = async (email, password) => {
  const { body } = await testServer.post('/login').send({ email, password }).expect(200)
  return body.authorization
}

module.exports = {
  criarUsuario,
  jsonUsuario,
  adminUsuario,
  jsonAdmin,
  postUser,
  getAdminUserById,
  login
}
