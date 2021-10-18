const express = require('express');
const { login } = require('./controladores/login');
const verificaToken = require('./filtros/verificaToken');
const {
    cadartrarUsuario,
    detalharUsuario,
    atualizarusuario
} = require('./controladores/usuarios');
const {
    cadastrarProduto,
    listarProdutos,
    detalharUmProduto,
    atualizarProduto,
    excluirProduto,
    filtrarProdutoPorCategoria
} = require('./controladores/produtos');

const rotas = express();

rotas.post('/usuario', cadartrarUsuario);
rotas.post('/login', login);

rotas.use(verificaToken);

rotas.get('/usuario', detalharUsuario);
rotas.put('/usuario', atualizarusuario);

rotas.get('/produtos', listarProdutos);
rotas.get('/produtos/:id', detalharUmProduto);
rotas.post('/produtos', cadastrarProduto);
rotas.put('/produtos/:id', atualizarProduto);
rotas.delete('/produtos/:id', excluirProduto);

// EXTRA
rotas.get('/produtos/:categoria', filtrarProdutoPorCategoria);

module.exports = rotas;