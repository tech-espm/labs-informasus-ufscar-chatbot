﻿import express = require("express");
import wrap = require("express-async-error-wrapper");
import Bot = require("../models/bot");
import Usuario = require("../models/usuario");
import appsettings = require("../appsettings");
import Texto = require("../models/texto");

const router = express.Router();

router.all("/", wrap(async (req: express.Request, res: express.Response) => {
	let u = await Usuario.cookie(req);
	if (!u) {
		res.redirect(appsettings.root + "/login");
	} else {
		res.render("home/dashboard", { titulo: "Dashboard", usuario: u });
	}
}));

router.all("/chat", wrap(async (req: express.Request, res: express.Response) => {
	res.render("home/chat", {
		layout: "layout-externo",
		idconversa: Bot.iniciarConversa(),
		texto : await Texto.obter()
	});
}));

router.all("/login", wrap(async (req: express.Request, res: express.Response) => {
	let u = await Usuario.cookie(req);
	if (!u) {
		let mensagem: string = null;

		if (req.body.login || req.body.senha) {
			[mensagem, u] = await Usuario.efetuarLogin(req.body.login as string, req.body.senha as string, res);
			if (mensagem)
				res.render("home/login", { layout: "layout-externo", mensagem: mensagem });
			else
				res.redirect(appsettings.root + "/");
		} else {
			res.render("home/login", { layout: "layout-externo", mensagem: null });
		}
	} else {
		res.redirect(appsettings.root + "/");
	}
}));

router.get("/acesso", wrap(async (req: express.Request, res: express.Response) => {
	let u = await Usuario.cookie(req);
	if (!u)
		res.redirect(appsettings.root + "/login");
	else
		res.render("home/acesso", { titulo: "Sem Permissão", usuario: u });
}));

router.get("/perfil", wrap(async (req: express.Request, res: express.Response) => {
	let u = await Usuario.cookie(req);
	if (!u)
		res.redirect(appsettings.root + "/");
	else
		res.render("home/perfil", { titulo: "Meu Perfil", usuario: u });
}));

router.get("/conteudo", wrap(async (req: express.Request, res: express.Response) => {
	let u = await Usuario.cookie(req);
	if (!u)
		res.redirect(appsettings.root + "/");
	else if (!u.admin)
		res.redirect(appsettings.root + "/acesso");
	else
		res.render("home/conteudo", {
			titulo: "Conteúdo do Chat",
			usuario: u,
			texto : await Texto.obter()
		});
}));

router.get("/logout", wrap(async (req: express.Request, res: express.Response) => {
	let u = await Usuario.cookie(req);
	if (u)
		await u.efetuarLogout(res);
	res.redirect(appsettings.root + "/");
}));

export = router;
