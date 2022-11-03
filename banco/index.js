const SqlServer = require('./conexao');

class FuncoesSQL {
    GerarRegistrosIntegracao = async () => {
        try {
            console.log('Gerando registros de integração')
            const sql = new SqlServer();
            const retorno = await sql.ProcedureSQL('Cobranca.dbo.SP_InsereRegistroAcionamentoYamaha');
            return retorno;
        } catch (error) {
            console.log(error);
            return []
        }
    }
    ListarRegistrosIntegracao = async () => {
        try {
            console.log('Gerando lista de registros')

            let mySQL = `SELECT TOP 100 TRIM(CAST(id AS NVARCHAR(20))) AS id, Ficha, codigoOcorrencia, codigoCredor, codigoCliente, codigoOperador`
            + `, CASE WHEN TRIM(complemento)=''THEN TRIM(CONVERT(CHAR(30), telefoneDiscado)) ELSE complemento END AS complemento, TRIM(CONVERT(CHAR(30), dataAgenda, 127)) AS dataAgenda, telefoneDiscado, codigoContrato, codigoProduto, bloqueioContrato`
            + ` FROM LogYamaha.dbo.EnvioAcionamento`
            + ` WHERE (enviado=0 OR enviado IS NULL)`
            + ` AND codigoOcorrencia<>'TEL_CP'`
            + ` ORDER BY dataAgenda ASC`; 
            const sql = new SqlServer();
            const retorno = await sql.QuerySQL(mySQL);
            return retorno;
        } catch (error) {
            console.log(error);
            return []
        }
    }
    async AlterarRegistrosIntegracao(registro) {
        try {
            const comando = `UPDATE LogYamaha.dbo.EnvioAcionamento SET enviado=1, enviadoData=GETDATE()`
            + ` WHERE id=${registro.id}`
            + ` AND Ficha=${registro.Ficha}`
            + ` AND telefoneDiscado=${registro.telefoneDiscado}`
            + ` AND codigoOcorrencia='${registro.codigoOcorrencia}'`
            const sql = new SqlServer();
            const retorno = await sql.ExecuteSQL(comando);
            return retorno;
        } catch (error) {
            console.log(error);
            return []
        }
    }        
}
module.exports = FuncoesSQL;