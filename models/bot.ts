// Para funcionar, precisa acrescentar a dependência "ibm-watson": "^5.6.0" ao package.json

// Se o projeto não compilar, pelo erro Cannot find name 'File', precisa
// acrescentar a lib DOM ao array compilerOptions.lib no arquivo tsconfig.json
import { randomBytes } from "crypto";
//import AssistantV2 = require("ibm-watson/assistant/v2");
//import { IamAuthenticator } from "ibm-watson/auth";
import appsettings = require("../appsettings");
import Sql = require("../infra/sql");

export = class Bot {
	/*
	public static async iniciarConversa(): Promise<{ idconversa: string, mensagem: any[] }> {
		// Pega o idconversa da API da IBM, e a resposta da mensagem de boas vindas,
		// que deveria ser o id de um assunto...
		const assistant = new AssistantV2({
			version: appsettings.assistantVersion,
			authenticator: new IamAuthenticator({
				apikey: appsettings.serviceCredentials.apikey,
			}),
			url: appsettings.serviceCredentials.url,
		});

		const respostaSessao = await assistant.createSession({ assistantId: appsettings.assistantId });

		const idconversa = respostaSessao.result.session_id;

		// Como a conversa é simples, o diálogo só tem um nível de profundidade,
		// daria para utilizar a versão sem estado, mais simples???
		// https://cloud.ibm.com/apidocs/assistant/assistant-v2?code=node#send-user-input-to-assistant-stateless
		// https://cloud.ibm.com/apidocs/assistant/assistant-v2?code=node#send-user-input-to-assistant-stateful
		const respostaMensagem = await assistant.message({
			assistantId: appsettings.assistantId,
			sessionId: idconversa,
			input: { message_type: "text", text: "" }
		});

		if (!respostaMensagem || !respostaMensagem.result || !respostaMensagem.result.output || !respostaMensagem.result.output.generic || !respostaMensagem.result.output.generic.length)
			throw new Error("Resposta vazia");

		return {
			idconversa: idconversa,
			mensagem: respostaMensagem.result.output.generic
		};
	}

	public static async enviarMensagem(idconversa: string, mensagem: string): Promise<any[]> {
		// Envia a mensagem para a API da IBM, usando idconversa,
		// e pega a resposta, que deveria ser o id de um assunto...
		const assistant = new AssistantV2({
			version: appsettings.assistantVersion,
			authenticator: new IamAuthenticator({
				apikey: appsettings.serviceCredentials.apikey,
			}),
			url: appsettings.serviceCredentials.url,
		});

		// Como a conversa é simples, o diálogo só tem um nível de profundidade,
		// daria para utilizar a versão sem estado, mais simples???
		// https://cloud.ibm.com/apidocs/assistant/assistant-v2?code=node#send-user-input-to-assistant-stateless
		// https://cloud.ibm.com/apidocs/assistant/assistant-v2?code=node#send-user-input-to-assistant-stateful

		let resposta: any[] = null;

		try {
			const respostaMensagem = await assistant.message({
				assistantId: appsettings.assistantId,
				sessionId: idconversa,
				input: { message_type: "text", text: mensagem }
			});

			// Loga só o que não gerou uma exceção
			await Sql.conectar(async (sql: Sql) => {
				await sql.query("insert into chatlog (data, idconversa, conteudo) value (now(), ?, ?)", [idconversa, mensagem]);
			});

			if (!respostaMensagem || !respostaMensagem.result || !respostaMensagem.result.output || !respostaMensagem.result.output.generic || !respostaMensagem.result.output.generic.length)
				throw new Error("Resposta vazia");

			resposta = respostaMensagem.result.output.generic;
		} catch (e) {
			if (e.status == 404 || e.message == "Invalid Session")
				resposta = null;
			else
				throw e;
		}

		return resposta;// || "Não sei o que dizer sobre isso 😥\nPoderia falar de novo, por favor, de outra forma? 😊";
	}
	*/

	public static iniciarConversa(): string {
		// Apenas gera um id de conversa aleatório
		return randomBytes(16).toString("hex");
	}

	public static async enviarMensagem(idconversa: string, ip: string, mensagem: string): Promise<boolean> {
		if (!idconversa ||
			(idconversa = idconversa.trim()).length !== 32 ||
			!mensagem ||
			!(mensagem = mensagem.trim()) ||
			mensagem.length > 65535)
			return false;

		await Sql.conectar(async (sql: Sql) => {
			await sql.query("insert into chatlog (data, idconversa, ip, conteudo) value (now(), ?, ?, ?)", [idconversa, ip, mensagem]);
		});

		return true;
	}
};
