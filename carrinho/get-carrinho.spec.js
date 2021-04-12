const faker = require('faker')
const testServer = require('../utils/testServer')
const { postUser } = require('../utils/user')
const { getAdminUserById } = require('../utils/user')

const rotaCarrinhos = '/carrinhos'
const rotaProdutos = '/produtos'
const rotaLogin = '/login'

describe('Listar carrinhos cadastrados na rota GET', () => {
  it('Listar carrinhos cadastrados', async () => {
    const response = await testServer.get(rotaCarrinhos)
    expect(response.status).toBe(200)
  })

  // it('Listar carrinho por ID válido', async () => {
  //   const { _id } = await postUser()

  //   const { email, password } = await getAdminUserById(_id)

  //   const { body } = await testServer.post(rotaLogin).send({ email, password })

  //   //cadastrar um produto
  //   const { body: bodyPost } = await testServer
  //     .post(rotaProdutos)
  //     .set('Content-type', 'application/json')
  //     .set('Authorization', `${body.authorization}`)
  //     .send({
  //       nome: faker.commerce.productName(),
  //       preco: faker.commerce.price(),
  //       descricao: faker.commerce.productDescription(),
  //       quantidade: faker.random.number()
  //     })
  //   //console.log(bodyPost)
  //   const _idProduto = bodyPost._id

  //   const carrinho = await testServer
  //     .post(rotaCarrinhos)
  //     .set('Content-type', 'application/json')
  //     .set('Authorization', `${body.authorization}`)
  //     .send({
  //       produtos: [
  //         {
  //           idProduto: `${_idProduto}`,
  //           quantidade: 1
  //         }
  //       ]
  //     })
  //   //console.log(carrinho)
  //   const idCarrinho = carrinho.body._id

  //   const response = await testServer.get(`${rotaCarrinhos}/${idCarrinho}`)
  //   console.log(response)
  //   //console.log(bodyGet)
  //   expect(response).toHaveProperty('quantidadeTotal', 1)
  // })

  it('Listar carrinho por ID incorreto', async () => {
    const response = await testServer.get(rotaCarrinhos).query({ _id: '123' })
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('quantidade', 0)
  })

  it('Listar carrinho por ID inválido', async () => {
    const response = await testServer.get(`${rotaCarrinhos + '/123'}`)
    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty('message', 'Carrinho não encontrado')
  })
})
