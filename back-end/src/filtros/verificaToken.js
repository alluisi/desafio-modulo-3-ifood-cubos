const jwt = require('jsonwebtoken');
const segredo = require('../segredo');
const conexao = require('../conexao');

const verificaToken = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ mensagem: 'Para acessar este recurso um token de autenticação válido deve ser enviado.' });
    }

    try {
        const token = authorization.replace('Bearer', '').trim();

        const { id } = jwt.verify(token, segredo);

        const query = 'select * from usuarios where id = $1';
        const { rows, rowCount } = await conexao.query(query, [id]);

        if (rowCount === 0) {
            return res.status(404).json({ mensagem: 'Usuário não encontrado!' });
        }

        const { senha, ...usuario } = rows[0];

        req.usuario = usuario;

        next();
    } catch (error) {
        if (
            error.message === 'invalid token' ||
            error.message === 'jwt malformed' ||
            error.message === 'invalid signature'
        ) {
            return res.status(401).json('O token informado não é válido');
        }

        if (error.message === 'jwt must be provided' ||
            error.message === 'JsonWebTokenError' ||
            error.message === 'TokenExpiredError'
        ) {
            return res.status(401).json({ mensagem: 'Para acessar este recurso um token de autenticação válido deve ser enviado.' });
        }

        return res.status(500).json({ mensagem: "Ocorreu um erro inesperado. - " + error.message });
    }
}

module.exports = verificaToken;