const testServer = require('../utils/testServer')
const { postUser, getAdminUserById, login } = require('../utils/user')
const { rotaCarrinhos } = require('../utils/rotas')
const { criarProduto } = require('../utils/produto')
const { criarCarrinho } = require('../utils/carrinho')

let userId
let authorization
let idProduto

describe('Listar carrinhos rota GET', () => {
  beforeEach(async () => {
    const responseUser = await postUser()
    userId = responseUser._id

    const { email, password } = await getAdminUserById(userId)
    authorization = await login(email, password)

    const produto = await criarProduto(authorization)
    expect(produto).toHaveProperty('message', 'Cadastro realizado com sucesso')
    idProduto = produto._id
  })

  describe('Listar carrinhos', () => {
    it('Listar carrinhos cadastrados', async () => {
      const response = await testServer.get(rotaCarrinhos)
      expect(response.status).toBe(200)
    })
  })

  describe('Listar carrinho por ID', () => {
    it('Listar carrinho por ID Válido', async () => {
      const carrinho = await criarCarrinho(idProduto, authorization)
      expect(carrinho).toHaveProperty('message', 'Cadastro realizado com sucesso')

      const { _id: _idCarrinho } = carrinho

      const response = await testServer.get(`${rotaCarrinhos}/${_idCarrinho}`)
      expect(response.body).toHaveProperty('quantidadeTotal', 1)
    })

    it('Listar carrinho por ID Incorreto', async () => {
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
})
