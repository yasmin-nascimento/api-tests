const testServer = require('../utils/testServer')
const { jsonUsuario } = require('../utils/user')

const rotaUsuarios = '/usuarios'

describe('Criar um usuário através da rota POST', () => {
  it('Cadastrar um novo usuário com sucesso', async () => {
    const response = await testServer.post(rotaUsuarios).send(jsonUsuario())
    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('message', 'Cadastro realizado com sucesso')
  })

  it('Cadastrar um novo usuário com um email já em uso', async () => {
    const usuario = jsonUsuario()
    usuario.email = 'fulano@qa.com'

    const response = await testServer.post(rotaUsuarios).send(usuario)
    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty('message', 'Este email já está sendo usado')
  })
})
