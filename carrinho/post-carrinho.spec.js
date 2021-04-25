const testServer = require('../utils/testServer')
const { postUser, getAdminUserById, login } = require('../utils/user')
const { rotaCarrinhos } = require('../utils/rotas')
const { criarProduto } = require('../utils/produto')
const { criarCarrinho } = require('../utils/carrinho')

let userId
let authorization
let idProduto

describe('Cadastrar Carrinho na rota POST', () => {
  beforeEach(async () => {
    const responseUser = await postUser()
    userId = responseUser._id

    const { email, password } = await getAdminUserById(userId)
    authorization = await login(email, password)

    const produto = await criarProduto(authorization)
    expect(produto).toHaveProperty('message', 'Cadastro realizado com sucesso')
    idProduto = produto._id
  })

  describe('quando usuário cadastra carrinho válido', () => {
    it('Cadastrar carrinho', async () => {
      const carrinho = await testServer
        .post(rotaCarrinhos)
        .set('Content-type', 'application/json')
        .set('Authorization', `${authorization}`)
        .send({
          produtos: [
            {
              idProduto: `${idProduto}`,
              quantidade: 1
            }
          ]
        })

      expect(carrinho.status).toBe(201)
      expect(carrinho.body).toHaveProperty('message', 'Cadastro realizado com sucesso')
    })
  })

  describe('quando usuário cadastra carrinho', () => {
    beforeEach(async () => {
      const carrinho = await criarCarrinho(idProduto, authorization)
      expect(carrinho).toHaveProperty('message', 'Cadastro realizado com sucesso')
    })

    it('Cadastrar mais de um carrinho', async () => {
      const novoCarrinho = await testServer
        .post(rotaCarrinhos)
        .set('Content-type', 'application/json')
        .set('Authorization', `${authorization}`)
        .send({
          produtos: [
            {
              idProduto: `${idProduto}`,
              quantidade: 1
            }
          ]
        })

      expect(novoCarrinho.status).toBe(400)
      expect(novoCarrinho.body).toHaveProperty('message', 'Não é permitido ter mais de 1 carrinho')
    })
  })
})
