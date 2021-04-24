const testServer = require('../utils/testServer')
const { postUser, getAdminUserById, login } = require('../utils/user')
const { rotaCarrinhos } = require('../utils/rotas')
const { criarProduto } = require('../utils/produto')
const { criarCarrinho } = require('../utils/carrinho')

let userId

describe('Cancelar compra na rota DELETE', () => {
  beforeEach(async () => {
    const responseUser = await postUser()
    userId = responseUser._id
  })

  describe('quando usuário possui carrinho', () => {
    it('Cancelar Compra', async () => {
      const { email, password } = await getAdminUserById(userId)
      const authorization = await login(email, password)

      const produto = await criarProduto(authorization)
      expect(produto).toHaveProperty('message', 'Cadastro realizado com sucesso')

      const { _id: _idProduto } = produto

      const carrinho = await criarCarrinho(_idProduto, authorization)
      expect(carrinho).toHaveProperty('message', 'Cadastro realizado com sucesso')

      const cancelarCarrinho = await testServer
        .delete(`${rotaCarrinhos}/cancelar-compra`)
        .set('Content-type', 'application/json')
        .set('Authorization', authorization)

      expect(200)
      expect(cancelarCarrinho.body).toHaveProperty(
        'message',
        'Registro excluído com sucesso. Estoque dos produtos reabastecido'
      )
    })
  })

  describe('quando usuário não possui carrinho', () => {
    it('Carrinho não encontrado', async () => {
      const { email, password } = await getAdminUserById(userId)
      const authorization = await login(email, password)

      const produto = await criarProduto(authorization)
      expect(produto).toHaveProperty('message', 'Cadastro realizado com sucesso')

      const { _id: _idProduto } = produto

      const cancelarCarrinho = await testServer
        .delete(`${rotaCarrinhos}/cancelar-compra`)
        .set('Content-type', 'application/json')
        .set('Authorization', authorization)

      expect(200)
      expect(cancelarCarrinho.body).toHaveProperty('message', 'Não foi encontrado carrinho para esse usuário')
    })
  })

  describe('Concluir Compra na rota Delete', () => {
    it('Concluir Compra para cliente com carrinho', async () => {
      const { email, password } = await getAdminUserById(userId)
      const authorization = await login(email, password)

      const produto = await criarProduto(authorization)
      expect(produto).toHaveProperty('message', 'Cadastro realizado com sucesso')

      const { _id: _idProduto } = produto

      const carrinho = await criarCarrinho(_idProduto, authorization)
      expect(carrinho).toHaveProperty('message', 'Cadastro realizado com sucesso')

      const concluirCompra = await testServer
        .delete(`${rotaCarrinhos}/concluir-compra`)
        .set('Content-type', 'application/json')
        .set('Authorization', `${authorization}`)

      expect(concluirCompra.status).toBe(200)
      expect(concluirCompra.body).toHaveProperty('message', 'Registro excluído com sucesso')
    })

    it('Concluir Compra para cliente sem carrinho', async () => {
      const { email, password } = await getAdminUserById(userId)
      const authorization = await login(email, password)

      const produto = await criarProduto(authorization)
      expect(produto).toHaveProperty('message', 'Cadastro realizado com sucesso')

      const { _id: _idProduto } = produto

      const concluirCompra = await testServer
        .delete(`${rotaCarrinhos}/concluir-compra`)
        .set('Content-type', 'application/json')
        .set('Authorization', `${authorization}`)

      expect(concluirCompra.status).toBe(200)
      expect(concluirCompra.body).toHaveProperty('message', 'Não foi encontrado carrinho para esse usuário')
    })
  })
})
