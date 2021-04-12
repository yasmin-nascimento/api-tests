const faker = require('faker')
const testServer = require('../utils/testServer')
const { postUser } = require('../utils/user')
const { getAdminUserById } = require('../utils/user')

const rotaLogin = '/login'
const rotaProdutos = '/produtos'
const rotaCarrinhos = '/carrinhos'

describe('Cadastrar Carrinho na rota POST', () => {
  it('Cadastrar carrinho válido', async () => {
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
    expect(carrinho.body).toHaveProperty('message', 'Cadastro realizado com sucesso')
  })

  // it('Cadastrar mais de um carrinho', async () => {
  // const carrinho = await testServer
  //   .post(rotaCarrinhos)
  //   .set('Content-type', 'application/json')
  //   .set('Authorization', `${body.authorization}`)
  //   .send({
  //     produtos: [
  //       {
  //         idProduto: `${_idProduto}`,
  //         quantidade: 1
  //       }
  //     ]
  //   })

  // expect(carrinho.status).toBe(201)

  // const { body } = await testServer
  //   .post(rotaCarrinhos)
  //   .set('Content-type', 'application/json')
  //   .set('Authorization', `${body.authorization}`)
  //   .send({
  //     produtos: [
  //       {
  //         idProduto: `${_idProduto}`,
  //         quantidade: 1
  //       }
  //     ]
  //   })
  // expect(400)

  // expect(body).toHaveProperty('message', 'Não é permitido ter mais de 1 carrinho')
  // })
})
