const faker = require('faker')
const testServer = require('../utils/testServer')
const { jsonUsuario } = require('../utils/user')

const rotaUsuarios = '/usuarios'

describe('Editar um usuário através da rota PUT', () => {
  it('Editar um usuário com id não encontrado', async () => {
    const response = await testServer.put(`${rotaUsuarios + '/123'}`).send(jsonUsuario())
    expect(response.status).toBe(201)
  })

  it('Registro alterado com sucesso', async () => {
    const { body } = await testServer.post(rotaUsuarios).send(jsonUsuario()).expect(201)
    const { body: bodyPut } = await testServer.put(`${rotaUsuarios}/${body._id}`).send(jsonUsuario()).expect(200)
    expect(bodyPut).toHaveProperty('message', 'Registro alterado com sucesso')
  })

  it('Editar um usuário com um email já em uso', async () => {
    const usuario = jsonUsuario()
    usuario.email = 'fulano@qa.com'

    const response = await testServer.put(`${rotaUsuarios + '/P2Jvc1FKQnlUs2F'} `).send(usuario)
    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty('message', 'Este email já está sendo usado')
  })
})
