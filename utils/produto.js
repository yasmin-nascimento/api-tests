const faker = require('faker')
const testServer = require('../utils/testServer')

const criarProduto = async authorization => {
  const { body } = await testServer
    .post('/produtos')
    .set('Content-type', 'application/json')
    .set('Authorization', `${authorization}`)
    .send({
      nome: faker.commerce.productName(),
      preco: faker.commerce.price(),
      descricao: faker.commerce.productDescription(),
      quantidade: faker.random.number()
    })

  return body
}

module.exports = {
  criarProduto
}
