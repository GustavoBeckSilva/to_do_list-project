const express = require('express');
const db = require('../models');
const { Tarefa } = db;

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/* 
    POST /tarefas 
    Criar uma nova tarefa
*/

app.post('/tarefas', async (req, res) => {

    try {

        const {descricao, prazo} = req.body;

        if(!descricao || typeof descricao !== 'string' || descricao.trim() === '')
            return res.status(400).json({error: 'Descrição não pode estar vazia.'});

        let prazoValido = null;

        if(prazo){
            const dataPrazo = new Date(prazo);

            if(isNaN(dataPrazo.getTime()))
                return res.status(400).json({error: 'Prazo não pode estar vazio ou em formato inválido.'})

            prazoValido = dataPrazo;

        }

        const novaTarefa = await Tarefa.create({
            descricao: descricao.trim(),
            prazo: prazoValido
        });

        res.status(201).json(novaTarefa);

    } catch (error) {
        console.error('Erro ao criar tarefa:', error);
            
        if(error.name == 'SequelizeValidationError'){
            const messages = error.errors.map(e => e.messages);
            return res.status(400).json({error: 'Erro de validação', details: messages });
        }

        res.status(500).json({error: 'Erro interno ao criar tarefa.', details: error.message});

    }
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/* 
    GET /tarefas 
    Listar todas tarefas
*/

app.get('/tarefas', async (req, res) => {

    try{
        const tarefas = await Tarefa.findAll({
            order: [['id', 'ASC']]
        });

        res.status(200).json(tarefas);

    } catch(error){
        console.error('Erro ao listar tarefas: ', error);
        res.status(500).json({error: 'Erro interno ao listar tarefas.', details: error.message});
    }

});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/* 
    GET /tarefas/pendentes
    Listar tarefas pendentes
*/

app.get('/tarefas/pendentes', async (req, res) => {

    try{
        const tarefasPendentes = await Tarefa.findAll({
            where: {concluida: false},
            order: [['id', 'ASC']]
        });

        res.status(200).json(tarefasPendentes);

    } catch(error){
        console.error('Erro ao listar tarefas pendentes: ', error);
        res.status(500).json({error: 'Erro interno ao listar tarefas pendentes.', details: error.message});
    }

});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/* 
    GET /tarefas/concluidas
    Listar tarefas concluídas
*/

app.get('/tarefas/concluidas', async (req, res) => {

    try{
        const tarefasConcluidas = await Tarefa.findAll({
            where: {concluida: true},
            order: [['id', 'ASC']]
        });

        res.status(200).json(tarefasConcluidas);

    } catch(error){
        console.error('Erro ao listar tarefas concluidas: ', error);
        res.status(500).json({error: 'Erro interno ao listar tarefas concluidas.', details: error.message});
    }

});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/* 
    GET /tarefas/:id
    Obter tarefa específica
*/

app.get('/tarefas/:id', async(req, res) => {
    
    try{
        const id = parseInt(req.params.id);

        if(isNaN(id))
            return res.status(400).json({error: 'ID da tarefa inválido, deve ser um número.'});

        const tarefa = await Tarefa.findByPk(id);

        if(tarefa)
            res.status(200).json(tarefa);

        else
            res.status(404).json({error: 'Tarefa não encontrada.'})

    } catch(error){
        console.error('Erro ao obter tarefa: ', error);
        res.status(500).json({error: 'Erro interno ao obter tarefa.', details: error.message});
    }

});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*
    PUT /tarefas/:id
    Editar tarefa
*/

app.put('/tarefas/:id', async(req, res) => {

    try{
        const {descricao, prazo, concluida} = req.body;
        const [atualizada] = await Tarefa.update({descricao, prazo, concluida}, {where: {id: req.params.id}});

        if(atualizada){
            const tarefaAtualizada = await Tarefa.findByPk(req.params.id);
            res.json(tarefaAtualizada);
        }

        else
            res.status(404).json({error: 'Tarefa não encontrada para atualização.'});

    } catch(error){
        res.status(500).json({error: 'Erro ao atualizar tarefa.', details: error.message})
    }

});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*
    PATCH /tarefas/:id/concluida
    Marcar tarefa como concluída
*/

app.patch('/tarefas/:id/concluida', async(req, res) => {

    try{
        const [concluida] = await Tarefa.update({concluida: true}, {where: {id: req.params.id}});

        if(concluida){
            const tarefaConcluida = await Tarefa.findByPk(req.params.id);
            res.json(tarefaConcluida);
        }
        else
            res.status(404).json({error: 'Tarefa não encontrada para marcá-la como pendente.'});
        
    } catch(error){
        res.status(500).json({error: 'Erro ao marcar uma tarefa como concluída.', details: error.message})
    }
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*
    PATCH /tarefas/:id/pendente
    Marcar tarefa como pendente
*/

app.patch('/tarefas/:id/pendente', async(req, res) => {

    try{
        const [atualizada] = await Tarefa.update({concluida: false}, {where: {id: req.params.id}});

        if(atualizada){
            const tarefaAtualizada = await Tarefa.findByPk(req.params.id);
            res.json(tarefaAtualizada);
        }
        else
            res.status(404).json({error: 'Tarefa não encontrada para marcá-la como pendente.'});

    } catch(error){
        res.status(500).json({error: 'Erro ao marcar uma tarefa como pendente.', details: error.message});
    }
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*
    DELETE /tarefas/:id
    Deletar tarefa
*/

app.delete('/tarefas/:id', async(req, res) => {

    try{
        const id = parseInt(req.params.id);

        if(isNaN(id))
            return res.status(400).json({error: 'ID da tarefa é inválido.'});

        const tarefa = await Tarefa.findByPk(id);

        if(!tarefa)
            return res.status(404).json({error: 'Tarefa não encontrada para excluí-la.'});

        await tarefa.destroy();
        res.status(204).send();

    } catch(error){
        console.error('Erro ao excluir tarefa: ', error);
        res.status(500).json({error: 'Erro interno ao excluir tarefa.', details: error.message});
    }
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

db.sequelize.authenticate().then(() => {
    console.log('Conexão com o banco estabelecida com sucesso.');

    app.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}`);
        console.log(`API disponível em: http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error("Não foi possível se conectar com o banco de dados: ", err);
});