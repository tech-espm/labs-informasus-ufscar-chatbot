import express = require("express");
import wrap = require("express-async-error-wrapper");
import jsonRes = require("../../utils/jsonRes");
import Bot = require("../../models/bot");

const router = express.Router();

// Se utilizar router.xxx() mas não utilizar o wrap(), as exceções ocorridas
// dentro da função async não serão tratadas!!!
router.get("/iniciarConversa", wrap(async (req: express.Request, res: express.Response) => {
	res.json(await Bot.iniciarConversa());
}));

router.post("/enviarMensagem", wrap(async (req: express.Request, res: express.Response) => {
	const idconversa = req.query["idconversa"] as string;
	const mensagem = ((req.body && req.body.mensagem) || "").toString().normalize().trim();
	if (!idconversa || !mensagem) {
		res.status(400).json("Dados inválidos");
		return;
	}
	res.json(await Bot.enviarMensagem(idconversa, mensagem));
}));

export = router;
