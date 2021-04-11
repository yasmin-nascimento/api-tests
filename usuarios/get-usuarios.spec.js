const faker = require('faker')
const testServer = require('../utils/testServer')
const { jsonUsuario } = require('../utils/user')

const rotaUsuarios = '/usuarios'

describe('Consultar usuário através da rota GET', () => {
  it('Listar usuários cadastrados', async () => {
    const response = await testServer.get(rotaUsuarios)
    expect(response.status).toBe(200)
  })

  it('Listar usuário por id inválido', async () => {
    const response = await testServer.get(rotaUsuarios).query({ _id: '123' })
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('quantidade', 0)
  })

  it('Listar usuário por id com sucesso', async () => {
    const { body } = await testServer.post(rotaUsuarios).send(jsonUsuario()).expect(201)
    const { body: bodyGet } = await testServer
      .get(rotaUsuarios)
      .query({ _id: `${body._id}` })
      .expect(200)
    expect(bodyGet).toHaveProperty('quantidade', 1)
  })
})
