const conexao = require('../conexao');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const segredo = require('../segredo');

const login = async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ mensagem: 'O campo email e senha são obrigatórios.' });
    }

    try {
        const queryConsultaEmail = 'select * from usuarios where email = $1';
        const { rows, rowCount } = await conexao.query(queryConsultaEmail, [email]);

        if (rowCount === 0) {
            return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
        }

        const usuario = rows[0];

        const senhaVerificada = await bcrypt.compare(senha, usuario.senha);

        if (!senhaVerificada) {
            return res.status(401).json({ mensagem: 'Usuário e/ou senha inválido(s).' });
        }

        const token = jwt.sign({ id: usuario.id }, segredo, { expiresIn: '1d' });

        return res.status(201).json({ token: token });
    } catch (error) {
        res.status(500).json({ mensagem: "Ocorreu um erro inesperado. - " + error.message });
        return;
    }
}

module.exports = {
    login
}