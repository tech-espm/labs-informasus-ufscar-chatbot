import Sql = require("../infra/sql");

export =  class Texto {
    id : number;
    texto : string;

    public static async alterar(t: Texto): Promise<void> {
        await Sql.conectar(async (sql: Sql) => {
            await sql.query("update textochat set texto = ? where id = ?", [t.texto, t.id]);
        });
    }
    public static async obter(): Promise<Texto[]> {
        let lista = [];
        await Sql.conectar(async (sql: Sql) => {
        
        lista = (await sql.query("select id, texto from textochat")) as Texto[];
    });

    return lista || [];
}
}