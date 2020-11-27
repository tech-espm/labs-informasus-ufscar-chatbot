import Sql = require("../infra/sql");

export = class Texto {
	public static async alterar(t: string): Promise<void> {
		await Sql.conectar(async (sql: Sql) => {
			await sql.query("update textochat set texto = ?", [t]);
		});
	}

	public static async obter(): Promise<string> {
		let texto: string = null;
		await Sql.conectar(async (sql: Sql) => {
			texto = (await sql.scalar("select texto from textochat")) as string;
		});

		return texto;
	}
};
