// Se o projeto não compilar, pelo erro Cannot find name 'File', precisa
// acrescentar a lib DOM ao array compilerOptions.lib no arquivo tsconfig.json
import AssistantV2 = require("ibm-watson/assistant/v2");
import { IamAuthenticator } from "ibm-watson/auth";
import appsettings = require("../appsettings");
import Sql = require("../infra/sql");

export = class Bot {
	public static async iniciarConversa(): Promise<{ idconversa: string, resposta: string }> {
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

		const resposta = ((respostaMensagem.result && respostaMensagem.result.output && respostaMensagem.result.output.generic && respostaMensagem.result.output.generic[0] && respostaMensagem.result.output.generic[0].text) || "");

		return {
			idconversa: idconversa,
			resposta: resposta || "Olá!"
		};
	}

	public static async enviarMensagem(idconversa: string, mensagem: string): Promise<string> {
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

		let resposta: string = null;

		try {
			const respostaMensagem = await assistant.message({
				assistantId: appsettings.assistantId,
				sessionId: idconversa,
				input: { message_type: "text", text: mensagem }
			});

			resposta = ((respostaMensagem.result && respostaMensagem.result.output && respostaMensagem.result.output.generic && respostaMensagem.result.output.generic[0] && respostaMensagem.result.output.generic[0].text) || "");

			// Loga só o que não gerou uma exceção
			await Sql.conectar(async (sql: Sql) => {
				await sql.query("insert into chatlog (data, idconversa, conteudo) value (now(), ?, ?)", [idconversa, mensagem]);
			});
		} catch (e) {
			if (e.status == 404 || e.message == "Invalid Session")
				resposta = "-1";
			else
				throw e;
		}

		return resposta || "Não sei o que dizer sobre isso 😥\nPoderia falar de novo, por favor, de outra forma? 😊";
	}
};
