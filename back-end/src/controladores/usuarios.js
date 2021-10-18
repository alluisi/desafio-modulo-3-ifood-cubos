const conexao = require('../conexao');
const bcrypt = require('bcrypt');

const cadartrarUsuario = async (req, res) => {
    const { nome, email, senha, nome_loja } = req.body;

    if (!nome) {
        return res.status(400).json({ mensagem: 'O campo nome é obrigatório.' });
    }

    if (!email) {
        return res.status(400).json({ mensagem: 'O campo email é obrigatório.' });
    }

    if (!senha) {
        return res.status(400).json({ mensagem: 'O campo senha é obrigatório.' });
    }

    if (!nome_loja) {
        return res.status(400).json({ mensagem: 'O campo nome_loja é obrigatório.' });
    }

    try {
        const queryConsultaEmail = 'select * from usuarios where email = $1';
        const { rowCount } = await conexao.query(queryConsultaEmail, [email]);

        if (rowCount > 0) {
            return res.status(400).json({ mensagem: 'O email informado já existe.' });
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const query = 'insert into usuarios (nome, email, senha, nome_loja) values ($1, $2, $3, $4)';
        const usuarioCadastrado = await conexao.query(query, [nome, email, senhaCriptografada, nome_loja]);

        if (usuarioCadastrado.rowCount === 0) {
            return res.status(500).json({ mensagem: 'Não foi possível cadastrar o usuário.' });
        }

        return res.status(201).send();
    } catch (error) {
        return res.status(500).json({ mensagem: "Ocorreu um erro inesperado. - " + error.message });
    }
}

const detalharUsuario = async (req, res) => {
    const { usuario } = req;

    try {
        return res.status(200).json(usuario);
    } catch (error) {
        return res.status(500).json({ mensagem: "Ocorreu um erro inesperado. - " + error.message });
    }
}

const atualizarusuario = async (req, res) => {
    const { nome, email, senha, nome_loja } = req.body;
    const { usuario } = req;

    if (!nome) {
        return res.status(400).json({ mensagem: 'O campo nome é obrigatório.' });
    }

    if (!email) {
        return res.status(400).json({ mensagem: 'O campo email é obrigatório.' });
    }

    if (!senha) {
        return res.status(400).json({ mensagem: 'O campo senha é obrigatório.' });
    }

    if (!nome_loja) {
        return res.status(400).json({ mensagem: 'O campo nome_loja é obrigatório.' });
    }

    try {
        const queryConsultaEmail = 'select * from usuarios where email = $1';
        const { rowCount, rows } = await conexao.query(queryConsultaEmail, [email]);

        if (rowCount > 0 && usuario.id !== rows[0].id) {
            return res.status(400).json({ mensagem: 'O e-mail informado já está sendo utilizado por outro usuário.' });
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const query = 'update usuarios set nome = $1, email = $2, senha = $3, nome_loja = $4 where id = $5';
        const usuarioAtualizado = await conexao.query(query, [nome, email, senhaCriptografada, nome_loja, usuario.id]);

        if (usuarioAtualizado.rowCount === 0) {
            return res.status(400).json({ mensagem: 'Não foi possível atualizar o usuário.' });
        }

        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({ mensagem: "Ocorreu um erro inesperado. - " + error.message });
    }
}

module.exports = {
    cadartrarUsuario,
    detalharUsuario,
    atualizarusuario
}