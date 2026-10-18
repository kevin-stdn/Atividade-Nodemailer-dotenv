const express = require('express');
const { body, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');

const router = express.Router();

router.get('/', (req, res) => {
    res.render('pages/index');
});

router.post('/enviar', [
    body('nome').notEmpty().withMessage('O campo nome é obrigatório.'),
    body('email').isEmail().withMessage('Digite um e-mail válido.'),
    body('assunto').notEmpty().withMessage('O campo assunto é obrigatório.'),
    body('mensagem').notEmpty().withMessage('O campo mensagem é obrigatório.')
], async (req, res) => {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const mappedErrors = errors.mapped();
        return res.render('pages/index', { 
            errors: mappedErrors, 
            oldData: req.body 
        });
    }

    const { nome, email, telefone, assunto, mensagem } = req.body;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER, 
        subject: `Novo Contato: ${assunto}`,
        text: `Você recebeu uma nova mensagem de contato:\n\n` +
              `Nome: ${nome}\n` +
              `E-mail: ${email}\n` +
              `Telefone: ${telefone || 'Não informado'}\n` +
              `Assunto: ${assunto}\n` +
              `Mensagem:\n${mensagem}`
    };

    try {
        await transporter.sendMail(mailOptions);
        res.render('index', { sucesso: true });
    } catch (error) {
        console.error('Erro ao enviar e-mail:', error);
        res.render('index', { 
            errors: { mensagem: { msg: 'Erro ao enviar o e-mail. Tente novamente mais tarde.' } }, 
            oldData: req.body 
        });
    }
});

module.exports = router;