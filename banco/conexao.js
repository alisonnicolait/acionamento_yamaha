const sql = require('mssql')

class SqlServer {
    constructor() {
        this.user_SQLSERVER = 'importacaoss';
        this.password_SQLSERVER = 'ss#38%';
        this.database_SQLSERVER = process.env.SERVER_SQL_DATABASE;
        this.server_SQLSERVER = process.env.SERVER_SQL;
        this.sqlConfig = {
            user: this.user_SQLSERVER,
            password: this.password_SQLSERVER,
            database: this.database_SQLSERVER,
            server: this.server_SQLSERVER,
            pool: {
                max: 10,
                min: 0,
                idleTimeoutMillis: 30000
            },
            options: {
                encrypt: false, // Para azure = true
                //     trustServerCertificate: false
            }
        }
        this.StringConnection = `Server=${this.server_SQLSERVER};Database=${this.database_SQLSERVER};User Id=${this.user_SQLSERVER};Password=${this.password_SQLSERVER};Encrypt=false`;
    }
    QuerySQL = async (comando) => {
        let LinhasProcessadas = [];
        await sql.connect(this.StringConnection).then(async () => {
            return await new sql.Request().query(comando)
        }).then((result) => { 
            LinhasProcessadas = result.recordset;
            return LinhasProcessadas;
        }).catch((err) => {
            console.log(err);
            return [];
        });
        return LinhasProcessadas;
    } 
    ExecuteSQL = async (comando) => {
        let LinhasProcessadas = [];
        await sql.connect(this.StringConnection).then(async () => {
            return await new sql.Request().query(comando)
        }).then((result) => { 
            if (result.rowsAffected) {
                LinhasProcessadas = {registros: result.rowsAffected[0]};
            } else {
                LinhasProcessadas = {registros: 0};
            }
            return LinhasProcessadas;
        }).catch((err) => {
            console.log(err);
            return [];
        });
        return LinhasProcessadas;
    }        
    ProcedureSQL = async (comando) => {
        const retorno = await sql.connect(this.StringConnection).then((pool) => {
            return pool.request().execute(comando)
        })
        return retorno.recordset;
    }
}


module.exports = SqlServer;