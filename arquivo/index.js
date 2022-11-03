const xl = require('excel4node');
const wb = new xl.Workbook();
const ws = wb.addWorksheet('Arquivo');
const Config = require('../config');
const config = new Config()

const Cabecalho = [
    "id",
    "ficha",
    "codigoOcorrencia",
    "codigoCredor",
    "codigoCliente",
    "codigoOperador",
    "complemento",
    "dataAgenda",
    "telefoneDiscado",
    "codigoContrato",
    "codigoProduto",
    "bloqueioContrato"
];

async function GerarArquivo(dados, nome_arquivo, cabecalho) {

    let headingColumnIndex = 1; //diz que começará na primeira linha
    cabecalho.forEach(heading => { //passa por todos itens do array
        // cria uma célula do tipo string para cada título
        ws.cell(1, headingColumnIndex++).string(heading);
    });

    let rowIndex = 2;
    dados.forEach(record => {
        let columnIndex = 1;
        Object.keys(record).forEach(columnName => {
            ws.cell(rowIndex, columnIndex++)
                .string(String(record[columnName]))
        });
        rowIndex++;
    });

    wb.write('./ArquivosGerados/' + nome_arquivo);
    return true;
}

async function GerarRegistros(dados, nome_arquivo) {    
    const data_atual = config.moment().tz(config.local_gmt).format('YYYYMMDDHHmmss');
    const arquivo_nome = (nome_arquivo) ? nome_arquivo : 'arquivo_' + data_atual + '.xlsx';
    const retorno = await GerarArquivo(dados, arquivo_nome, Cabecalho);
    return retorno;
}

module.exports = {GerarRegistros};