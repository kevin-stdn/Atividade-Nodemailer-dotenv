const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const { body, validationResult } = require("express-validator");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    secure: false,
    ignoreTLS: true,
    rejectUnauthorized: false,
  },
});

router.get("/", (req, res) => {
  res.render("pages/index", {
    erros: null,
    valores: { nome: "", email: "", telefone: "", assunto: "", mensagem: "" },
    sucesso: null,
  });
});

router.post(
  "/contato",
  body("nome")
    .isLength({ min: 3, max: 30 })
    .withMessage("Nome deve ter de 3 a 30 caracteres!")
    .notEmpty()
    .withMessage("O campo nome é obrigatório!"),
  body("email").isEmail().withMessage("Deve ser um email válido!"),
  body("assunto").notEmpty().withMessage("O assunto não pode estar vazio!"),
  body("mensagem").notEmpty().withMessage("A mensagem não pode estar vazia!"),
  (req, res) => {
    const { nome, email, telefone, assunto, mensagem } = req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      console.log(errors);
      return res.render("pages/index", {
        erros: errors.array(),
        valores: { nome, email, telefone, assunto, mensagem },
        sucesso: null,
      });
    }

    const mailOptions = {
      from: email,
      to: email,
      subject: assunto,
      text: "Mensagem em formato de texto",
      html: "<h1>Mensagem em formato HTML</h1>",
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.render("pages/index", {
          erros: [{ msg: "Ocorreu um erro, tente novamente" }],
          valores: {
            nome,
            email,
            telefone,
            assunto,
            mensagem,
          },
          sucesso: null,
        });
        console.log(error);
      } else {
        console.log(info);
        console.log("Email enviado");
      }
    });
    res.render("pages/index", {
      erros: null,
      valores: {
        nome,
        email,
        telefone,
        assunto,
        mensagem,
      },
      sucesso: "Mensagem enviada com sucesso",
    });
  },
);

module.exports = router;
