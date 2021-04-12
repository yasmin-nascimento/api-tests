const faker = require('faker')
const testServer = require('../utils/testServer')
const { postUser } = require('../utils/user')
const { getAdminUserById } = require('../utils/user')

const rotaLogin = '/login'
const rotaProdutos = '/produtos'
const rotaCarrinhos = '/carrinhos'

describe('Cancelar compra na rota DELETE', () => {
  it('Cancelar Compra', async () => {
    const { _id } = await postUser()

    const { email, password } = await getAdminUserById(_id)

    const { body } = await testServer.post(rotaLogin).send({ email, password })

    const { body: bodyPost } = await testServer
      .post(rotaProdutos)
      .set('Content-type', 'application/json')
      .set('Authorization', `${body.authorization}`)
      .send({
        nome: faker.commerce.productName(),
        preco: faker.commerce.price(),
        descricao: faker.commerce.productDescription(),
        quantidade: faker.random.number()
      })

    const _idProduto = bodyPost._id

    const carrinho = await testServer
      .post(rotaCarrinhos)
      .set('Content-type', 'application/json')
      .set('Authorization', `${body.authorization}`)
      .send({
        produtos: [
          {
            idProduto: `${_idProduto}`,
            quantidade: 1
          }
        ]
      })

    expect(carrinho.status).toBe(201)

    const cancelarCompra = await testServer
      .delete(`${rotaCarrinhos}/cancelar-compra`)
      .set('Content-type', 'application/json')
      .set('Authorization', `${body.authorization}`)

    expect(cancelarCompra.status).toBe(200)
    expect(cancelarCompra.body).toHaveProperty(
      'message',
      'Registro excluído com sucesso. Estoque dos produtos reabastecido'
    )
  })

  it('Carrinho não encontrado', async () => {
    const { _id } = await postUser()

    const { email, password } = await getAdminUserById(_id)

    const { body } = await testServer.post(rotaLogin).send({ email, password })

    const { body: bodyPost } = await testServer
      .post(rotaProdutos)
      .set('Content-type', 'application/json')
      .set('Authorization', `${body.authorization}`)
      .send({
        nome: faker.commerce.productName(),
        preco: faker.commerce.price(),
        descricao: faker.commerce.productDescription(),
        quantidade: faker.random.number()
      })

    expect(bodyPost).toHaveProperty('message', 'Cadastro realizado com sucesso')

    const cancelarCompra = await testServer
      .delete(`${rotaCarrinhos}/cancelar-compra`)
      .set('Content-type', 'application/json')
      .set('Authorization', `${body.authorization}`)

    expect(cancelarCompra.status).toBe(200)
    expect(cancelarCompra.body).toHaveProperty('message', 'Não foi encontrado carrinho para esse usuário')
  })
})

describe('Concluir Compra na rota DELETE', () => {
  it('Concluir Compra', async () => {
    const { _id } = await postUser()

    const { email, password } = await getAdminUserById(_id)

    const { body } = await testServer.post(rotaLogin).send({ email, password })

    const { body: bodyPost } = await testServer
      .post(rotaProdutos)
      .set('Content-type', 'application/json')
      .set('Authorization', `${body.authorization}`)
      .send({
        nome: faker.commerce.productName(),
        preco: faker.commerce.price(),
        descricao: faker.commerce.productDescription(),
        quantidade: faker.random.number()
      })

    const _idProduto = bodyPost._id

    const carrinho = await testServer
      .post(rotaCarrinhos)
      .set('Content-type', 'application/json')
      .set('Authorization', `${body.authorization}`)
      .send({
        produtos: [
          {
            idProduto: `${_idProduto}`,
            quantidade: 1
          }
        ]
      })

    expect(carrinho.status).toBe(201)

    const concluirCompra = await testServer
      .delete(`${rotaCarrinhos}/concluir-compra`)
      .set('Content-type', 'application/json')
      .set('Authorization', `${body.authorization}`)

    expect(concluirCompra.status).toBe(200)
    expect(concluirCompra.body).toHaveProperty('message', 'Registro excluído com sucesso')
  })

  it('Carrinho não encontrado', async () => {
    const { _id } = await postUser()

    const { email, password } = await getAdminUserById(_id)

    const { body } = await testServer.post(rotaLogin).send({ email, password })

    const { body: bodyPost } = await testServer
      .post(rotaProdutos)
      .set('Content-type', 'application/json')
      .set('Authorization', `${body.authorization}`)
      .send({
        nome: faker.commerce.productName(),
        preco: faker.commerce.price(),
        descricao: faker.commerce.productDescription(),
        quantidade: faker.random.number()
      })

    expect(bodyPost).toHaveProperty('message', 'Cadastro realizado com sucesso')

    const concluirCompra = await testServer
      .delete(`${rotaCarrinhos}/concluir-compra`)
      .set('Content-type', 'application/json')
      .set('Authorization', `${body.authorization}`)

    expect(concluirCompra.status).toBe(200)
    expect(concluirCompra.body).toHaveProperty('message', 'Não foi encontrado carrinho para esse usuário')
  })
})
