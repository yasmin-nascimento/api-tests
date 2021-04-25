const testServer = require('../utils/testServer')
const { postUser, getAdminUserById, login } = require('../utils/user')
const { rotaUsuarios } = require('../utils/rotas')
const { criarProduto } = require('../utils/produto')
const { removerCarrinho, criarCarrinho } = require('../utils/carrinho')

let userId

describe('Deletar um usuário através da rota DELETE', () => {
  beforeEach(async () => {
    const responseUser = await postUser()
    userId = responseUser._id
  })

  describe('quando usuário não possui carrinho', () => {
    it('Deletar um usuário com id não encontrado', async () => {
      const response = await testServer.delete(`${rotaUsuarios + '/123'}`)

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('message', 'Nenhum registro excluído')
    })

    it('Registro deletado com sucesso', async () => {
      const response = await testServer.delete(`${rotaUsuarios}/${userId}`).expect(200)
      expect(response.body).toHaveProperty('message', 'Registro excluído com sucesso')
    })
  })

  describe('quando usuário possui carrinho', () => {
    beforeEach(async () => {
      const { email, password } = await getAdminUserById(userId)
      const authorization = await login(email, password)

      const produto = await criarProduto(authorization)
      expect(produto).toHaveProperty('message', 'Cadastro realizado com sucesso')

      const carrinhoRemovido = await removerCarrinho(authorization)
      expect(carrinhoRemovido).toHaveProperty('message', 'Não foi encontrado carrinho para esse usuário')

      const { _id: _idProduto } = produto

      const carrinho = await criarCarrinho(_idProduto, authorization)
      expect(carrinho).toHaveProperty('message', 'Cadastro realizado com sucesso')
    })

    it('Deletar usuário com carrinho', async () => {
      const deletarUserResponse = await testServer.delete(`${rotaUsuarios}/${userId}`)
      expect(deletarUserResponse.status).toBe(400)
      expect(deletarUserResponse.body).toHaveProperty(
        'message',
        'Não é permitido excluir usuário com carrinho cadastrado'
      )
    })
  })
})
