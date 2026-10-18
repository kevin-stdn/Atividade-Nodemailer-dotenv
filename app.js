const dotenv = require('dotenv').config();
const express = require('express');
const app = express();

const PORT = process.env.APP_PORT

app.use(express.static("./app/public"));
app.set('view engine', 'ejs');
app.set("views","./app/views");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const rotas = require('./app/routes/router');
app.use('/', rotas);

app.listen(PORT, () => {
    console.log(`Servidor rodando com sucesso em http://localhost:${PORT}`);
});