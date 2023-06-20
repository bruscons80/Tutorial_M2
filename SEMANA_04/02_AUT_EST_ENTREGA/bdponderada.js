const express = require('express');
const sqlite3 = require('sqlite3').verbose();

// Crie uma conexão com o banco de dados SQLite
const db = new sqlite3.Database(':memory:', (err) => {
  if (err) {
    console.log('Erro ao conectar ao banco de dados:', err);
  } else {
    console.log('Conexão com o banco de dados estabelecida com sucesso.');
  }
});

// Crie a tabela "formacao" no banco de dados SQLite
db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS formacao (id INTEGER PRIMARY KEY AUTOINCREMENT, descricao TEXT)');
});

const app = express();
const server = app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000.');
});

// Endpoint para listar todas as formações
app.get('/listaFormacao', (req, res) => {
  const sql = 'SELECT * FROM formacao';
  db.all(sql, [], (error, results) => {
    if (error) {
      console.log('Erro ao listar as formações:', error);
      res.status(500).send('Erro ao listar as formações.');
    } else {
      res.status(200).json(results);
    }
  });
});

// Endpoint para inserir uma nova formação
app.post('/insereFormacao', (req, res) => {
  const { descricao } = req.body;
  const sql = 'INSERT INTO formacao (descricao) VALUES (?)';
  db.run(sql, [descricao], (error, result) => {
    if (error) {
      console.log('Erro ao inserir a formação:', error);
      res.status(500).send('Erro ao inserir a formação.');
    } else {
      res.status(201).send('Formação inserida com sucesso.');
    }
  });
});

// Endpoint para atualizar uma formação existente
app.put('/atualizaFormacao/:id', (req, res) => {
  const { descricao } = req.body;
  const id = req.params.id;
  const sql = 'UPDATE formacao SET descricao = ? WHERE id = ?';
  db.run(sql, [descricao, id], (error, result) => {
    if (error) {
      console.log('Erro ao atualizar a formação:', error);
      res.status(500).send('Erro ao atualizar a formação.');
    } else {
      res.status(200).send('Formação atualizada com sucesso.');
    }
  });
});

// Endpoint para buscar uma formação pelo ID
app.get('/buscaFormacao/:id', (req, res) => {
  const id = req.params.id;
  const sql = 'SELECT * FROM formacao WHERE id = ?';
  db.get(sql, [id], (error, result) => {
    if (error) {
      console.log('Erro ao buscar a formação:', error);
      res.status(500).send('Erro ao buscar a formação.');
    } else if (!result) {
      res.status(404).send('Formação não encontrada.');
    } else {
      res.status(200).json(result);
    }
  });
});

// Endpoint para remover uma formação existente
app.delete('/removeFormacao/:id', (req, res) => {
  const id = req.params.id;
  const sql = 'DELETE FROM formacao WHERE id = ?';
  db.run(sql, [id], (error, result) => {
    if (error) {
      console.log('Erro ao remover a formação:', error);
      res.status(500).send('Erro ao remover a formação.');
    } else {
      res.status(204).send('Formação removida com sucesso.');
    }
  });
});