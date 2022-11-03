const Config = require('../config');
const Api = require('../api');
const FuncoesSQL = require('../banco');
const Arquivo = require('../arquivo');

class Aplicacao {
    constructor() {
        this.config = new Config();
        this.data_atual = new Config().data_atual();
        this.data_gmt = new Config().data_gmt();
        this.api = new Api();
        this.api_endereco = process.env.API_ENDERECO;
        this.app_name = process.env.APP_NAME;
    }
    main = async () => {
        console.log('Iniciando a aplicação: ' + this.data_atual)
        //console.log(this.app_name)
        //console.log('Endereço da API: ' + this.api_endereco)

        const sql = new FuncoesSQL();
        //await sql.GerarRegistrosIntegracao()
        const listaderegistros = await sql.ListarRegistrosIntegracao()
        if (listaderegistros) {
            console.log('Registros encontrados: ' + listaderegistros.length)
            const RegistrosOK = [];
            await Promise.all(listaderegistros.map(async (registro, x) => {
                console.log('Registro: ' + (x+1), 'ID: '+registro.id)
                const retorno = await this.api.EnvioDados(this.api_endereco, registro);
                if (retorno) {
                    if (retorno.status === 200) {
                        RegistrosOK.push(registro);
                        const retornoUpdate = await sql.AlterarRegistrosIntegracao(registro);
                        console.log('Alterando lista de registros: id: ' + registro.id, 'Resultado: ' + (retornoUpdate.registro) ? 'OK' : 'ERRO')
                    } else {
                        console.log('Erro ao enviar os dados para API: id: ' + registro.id, 'Erro: '+retorno.status, 'Resultado: ' + JSON.stringify(retorno.data))
                    }
                }
                console.log('Processou Registro: ' + (x+1), 'ID: '+registro.id)
            }))
            if (RegistrosOK.length > 0) {
                const retornoArquivo = await Arquivo.GerarRegistros(RegistrosOK)
                if (retornoArquivo) {
                    console.log('Arquivo gerado com sucesso!')
                } else {
                    console.log('Erro ao gerar arquivo!')
                }
            }
        }
        console.log('Finalizando ciclo da aplicação: ' + this.data_atual)
        return true;
    }
}

module.exports = Aplicacao;