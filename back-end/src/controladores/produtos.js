const conexao = require('../conexao');

const listarProdutos = async (req, res) => {
    const { usuario } = req;

    try {
        const produtos = await conexao.query('select * from produtos where usuario_id = $1', [usuario.id]);

        return res.status(200).json({ mensagem: produtos.rows });
    } catch (error) {
        res.status(500).json({ mensagem: "Ocorreu um erro inesperado. - " + error.message });
        return;
    }
}

const detalharUmProduto = async (req, res) => {
    const { id } = req.params;
    const { usuario } = req;

    try {
        const query = 'select * from produtos where id = $1';
        const produto = await conexao.query(query, [id]);

        if (produto.rowCount === 0) {
            return res.status(404).json({ mensagem: "Não existe produto cadastrado com ID " + id });
        }

        if (produto.rows[0].usuario_id !== usuario.id) {
            return res.status(403).json({ mensagem: "O usuário logado não tem permissão para acessar este produto." });
        }

        return res.status(200).json({ mensagem: produto.rows[0] });
    } catch (error) {
        res.status(500).json({ mensagem: "Ocorreu um erro inesperado. - " + error.message });
        return;
    }
}

const cadastrarProduto = async (req, res) => {
    const { nome, quantidade, categoria, preco, descricao, imagem } = req.body;
    const { usuario } = req;

    if (!nome) {
        return res.status(400).json({ mensagem: 'O nome do produto deve ser informado.' });
    }

    if (!quantidade) {
        return res.status(400).json({ mensagem: 'A quantidade de produtos deve ser informada.' });
    }

    if (!preco) {
        return res.status(400).json({ mensagem: 'O preço do produto deve ser informado.' });
    }

    if (!descricao) {
        return res.status(400).json({ mensagem: 'A descrição do produto deve ser informada.' });
    }

    if (quantidade <= 0) {
        return res.status(400).json({ mensagem: 'O campo quantidade precisa ser maior que 0.' });
    }

    try {
        const query = 'insert into produtos (usuario_id, nome, quantidade, categoria, preco, descricao, imagem) values ($1, $2, $3, $4, $5, $6, $7)';
        const produto = await conexao.query(query, [usuario.id, nome, quantidade, categoria, preco, descricao, imagem]);

        if (produto.rowCount === 0) {
            return res.status(400).json({ mensagem: 'Não foi possível cadastrar o produto.' });
        }

        return res.status(201).json();
    } catch (error) {
        res.status(500).json({ mensagem: "Ocorreu um erro inesperado. - " + error.message });
        return;
    }
}

const atualizarProduto = async (req, res) => {
    const { nome, quantidade, categoria, preco, descricao, imagem } = req.body;
    const { usuario } = req;
    const { id } = req.params;

    if (!nome) {
        return res.status(400).json({ mensagem: 'O nome do produto deve ser informado.' });
    }

    if (!quantidade) {
        return res.status(400).json({ mensagem: 'A quantidade de produtos deve ser informada.' });
    }

    if (!preco) {
        return res.status(400).json({ mensagem: 'O preço do produto deve ser informado.' });
    }

    if (!descricao) {
        return res.status(400).json({ mensagem: 'A descrição do produto deve ser informada.' });
    }

    if (quantidade <= 0) {
        return res.status(400).json({ mensagem: 'O campo quantidade precisa ser maior que 0.' });
    }

    try {
        const queryConsulta = 'select * from produtos where id = $1';
        const produto = await conexao.query(queryConsulta, [id]);

        if (produto.rowCount === 0) {
            return res.status(404).json({ mensagem: "Não existe produto cadastrado com ID " + id });
        }

        if (produto.rows[0].usuario_id !== usuario.id) {
            return res.status(403).json({ mensagem: "O usuário logado não tem permissão para acessar este produto." });
        }

        const queryAtualizacao = 'update produtos set nome = $1, quantidade = $2, categoria = $3, preco = $4, descricao = $5, imagem = $6 where usuario_id = $7';
        const ProdutoAtualizado = await conexao.query(queryAtualizacao, [nome, quantidade, categoria, preco, descricao, imagem, usuario.id]);

        if (ProdutoAtualizado.rowCount === 0) {
            return res.status(400).json({ mensagem: 'Não foi possível atualizar o produto.' });
        }

        return res.status(201).json();
    } catch (error) {
        res.status(500).json({ mensagem: "Ocorreu um erro inesperado. - " + error.message });
        return;
    }
}

const excluirProduto = async (req, res) => {
    const { usuario } = req;
    const { id } = req.params;

    try {
        const queryConsulta = 'select * from produtos where id = $1';
        const produto = await conexao.query(queryConsulta, [id]);

        if (produto.rowCount === 0) {
            return res.status(404).json({ mensagem: "Não existe produto cadastrado com ID " + id });
        }

        if (produto.rows[0].usuario_id !== usuario.id) {
            return res.status(403).json({ mensagem: "O usuário autenticado não tem permissão para excluir este produto." });
        }

        const queryExclusao = 'delete from produtos where id = $1';
        const { rowCount } = await conexao.query(queryExclusao, [id]);

        if (rowCount === 0) {
            return res.status(400).json({ mensagem: 'Não foi possível excluir o produto.' });
        }

        return res.status(201).json();
    } catch (error) {
        res.status(500).json({ mensagem: "Ocorreu um erro inesperado. - " + error.message });
        return;
    }
}

const filtrarProdutoPorCategoria = async (req, res) => {
    const { categoria } = req.query;
    const { usuario } = req;

    try {
        const query = 'select * from produtos where categoria = $1 and usuario_id = $2';
        const produto = await conexao.query(query, [categoria, usuario.id]);

        return res.status(200).json(produto.rows);

    } catch (error) {
        res.status(500).json({ mensagem: "Ocorreu um erro inesperado. - " + error.message });
        return;
    }
}

module.exports = {
    listarProdutos,
    detalharUmProduto,
    cadastrarProduto,
    atualizarProduto,
    excluirProduto,
    filtrarProdutoPorCategoria
}