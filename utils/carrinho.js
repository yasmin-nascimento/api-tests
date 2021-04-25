const testServer = require('../utils/testServer')
const { rotaCarrinhos } = require('../utils/rotas')

const removerCarrinho = async authorization => {
  const { body } = await testServer
    .delete(`${rotaCarrinhos}/cancelar-compra`)
    .set('Content-type', 'application/json')
    .set('Authorization', authorization)

  return body
}

const criarCarrinho = async (_idProduto, authorization) => {
  const { body } = await testServer
    .post(rotaCarrinhos)
    .set('Content-type', 'application/json')
    .set('Authorization', authorization)
    .send({
      produtos: [
        {
          idProduto: `${_idProduto}`,
          quantidade: 1
        }
      ]
    })

  return body
}

module.exports = {
  removerCarrinho,
  criarCarrinho
}
