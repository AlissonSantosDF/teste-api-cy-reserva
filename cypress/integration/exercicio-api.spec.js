/// <reference types="cypress" />
import contrato2 from '../contracts/usuarios.contract'

describe('Testes da Funcionalidade Usuários', () => {

     it('Deve validar contrato de usuários', () => {
          cy.request('usuarios').then(response =>{
               return contrato2.validateAsync(response.body)
          })
           
     });

     it('Deve listar usuários cadastrados', () => {
          cy.request({
               method: 'GET',
               url: 'usuarios'
               // Parâmetro redundante afim de aperfeiçoar o conhecimento     
          }).then((response) => {
               cy.log(response.body.quantidade)
          })
          
     });

     it('Deve cadastrar um usuário com sucesso', () => {
          //Sem o uso de Custom Command para melhor assimilar o conhecimento
          let emails = `teste${Math.floor(Math.random() * 1000)}@teste.com`
          cy.request({
               method: 'POST',
               url: 'usuarios',
               body: {
                    "nome": "teste888 da Silva",
                    "email": emails,
                    "password": "teste",
                    "administrador": "true"
               }

          }).then((response) => {
               expect(response.status).to.equal(201)
               expect(response.body.message).to.equal('Cadastro realizado com sucesso')
               // Parâmetro redundante afim de aperfeiçoar o conhecimento
               cy.log(response.body._id)
          })

     });

     it('Deve validar um usuário com email inválido', () => {
          cy.request({
               method: 'POST',
               url: 'usuarios',
               body: {
                    "nome": "teste888 da Silva",
                    "email": "exercicio888@qa.com.br",
                    "password": "teste",
                    "administrador": "true"
               },
               failOnStatusCode: false

          }).then((response) => {
               expect(response.status).to.equal(400)
               expect(response.body.message).to.equal('Este email já está sendo usado')

          })

     });

     it('Deve editar um usuário previamente cadastrado', () => {
          cy.request('usuarios').then(response => {
               //cy.log(response.body.usuarios[0]._id) - redundante
               let id = response.body.usuarios[0]._id
               cy.request({
                    method: 'PUT',
                    url: `usuarios/${id}`,
                    body: {
                         "nome": "Usuário editado",
                         "email": "usuarioeditado@qa.com.br",
                         "password": "teste",
                         "administrador": "true"
                    }
               }).then(response => {
                    expect(response.body.message).to.equal('Registro alterado com sucesso')
                    expect(response.status).to.equal(200)
               })
          })
     });

     it('Deve deletar um usuário previamente cadastrado', () => {
          //Fazendo uso de boas práticas da engenharia de software usando Custom Command 
          let emails = `teste${Math.floor(Math.random() * 1000)}@teste.com`

          cy.cadastrarUsuario('teste333', emails, 'teste', 'true')
               .then(response => {
                    let id = response.body._id
                    cy.request({
                         method: 'DELETE',
                         url: `usuarios/${id}`
                    }).then(response => {
                         expect(response.body.message).to.equal('Registro excluído com sucesso')
                         expect(response.status).to.equal(200)
                    })
               })

     });


});
