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

//cadastrar usuário administrador
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

//cadastrar um produto
const jsonProduto = () => {
  return {
    nome: faker.commerce.productName(),
    preco: faker.commerce.price(),
    descricao: faker.commerce.productDescription(),
    quantidade: faker.random.number()
  }
}

// const { body } = async cadastrarProduto => {
//   return await testServer
//     .post('/produtos')
//     .set('Content-type', 'application/json')
//     .set('Authorization', `${body.authorization}`)
//     .send(cadastrarProduto)
// }

module.exports = {
  criarUsuario,
  jsonUsuario,
  adminUsuario,
  jsonAdmin,
  jsonProduto,
  postUser,
  getAdminUserById
}
