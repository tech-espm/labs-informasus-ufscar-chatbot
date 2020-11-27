﻿import express = require("express");
import wrap = require("express-async-error-wrapper");
import Texto = require("../../models/texto");
import Usuario = require("../../models/usuario");

const router = express.Router();

// Se utilizar router.xxx() mas não utilizar o wrap(), as exceções ocorridas
// dentro da função async não serão tratadas!!!
router.post("/alterar", wrap(async (req: express.Request, res: express.Response) => {
	let u = await Usuario.cookie(req, res, true);
	if (!u)
		return;

	let texto = req.body.texto;
	if (!texto) {
		res.status(400).json("Conteúdo inválido");
		return;
	}

	await Texto.alterar(texto);

	res.json(true);
}));

export = router;
