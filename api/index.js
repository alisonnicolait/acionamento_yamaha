const axios = require('axios');

class ApiEnvio {
    async EnvioRegistros(endereco, dados) {
        const request_data = {
            url: `${endereco}`,
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            data: dados
        };
        const result = await axios(request_data);
        const statusText = result.statusText;
        const status = result.status;
        const data = result.data;
        return { "statusText": statusText, "status": status, "data": data };
    }
}
class Api {
    EnvioDados = async (endereco, dados) => {
        try {
            const obj = {
                "codigoOcorrencia": String(dados.codigoOcorrencia),
                "codigoCredor": String(dados.codigoCredor),
                "codigoCliente": String(dados.codigoCliente),
                "codigoOperador": String(dados.codigoOperador),
                "complemento": String(dados.complemento),
                "dataAgenda": String(dados.dataAgenda),
                "telefoneDiscado": String(dados.telefoneDiscado),
                "codigoContrato": String(dados.codigoContrato),
                "codigoProduto": String(dados.codigoProduto),
                "bloqueioContrato": String(dados.bloqueioContrato) === "true" ? true : false
            }
            //console.log(endereco, JSON.stringify(obj))
            const api = new ApiEnvio();
            const resposta = await api.EnvioRegistros(endereco, obj);
            if (resposta) {
                if (resposta.status === 200) {
                    const resposta_api = resposta.data;
                    if (resposta_api) {
                        if (parseInt(resposta_api.codigo) === 0) {
                            return resposta;
                        } else {
                            return { "statusText": "Erro na API", "status": resposta_api.codigo, "data": resposta_api.descricao };
                        }
                    }
                    return { "statusText": "Erro na API", "status": 500, "data": resposta.data };
                } else {
                    return { "statusText": "Erro na API", "status": 500, "data": resposta };
                }
            }
            return resposta;
        } catch (err) {
            //console.log(err);
            return { "statusText": "Erro na API", "status": 500, "data": err.message };
        }
    };
}
module.exports = Api;