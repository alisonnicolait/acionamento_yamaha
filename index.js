const moment = require('moment-timezone');
const local_gmt = "America/Sao_Paulo";
const server_gmt = "Africa/Abidjan";
const Aplicacao = require('./aplicacao');
require('dotenv').config({
    path: process.env.NODE_ENV = "./configuracao/.env"
})
const aplicacao = new Aplicacao();

//AGENDAMENTO DE EXECUCAO
let inicio_operacao = 0;
const Agenda = require('node-schedule');
Agenda.scheduleJob('*/1 * * * *', async function () {
    const data_execucao_real = String(moment(moment.tz(moment(), local_gmt)).format('YYYY-MM-DD[T]HH:mm:ss.SSS[Z]'));

    if (parseInt(inicio_operacao) === 0) global.data_loop = data_execucao_real;
    let minutes = moment(data_execucao_real).diff(global.data_loop, 'minutes');
    if ((inicio_operacao === 2) && (parseInt(minutes) > 30)) {
        //REINICIA A APLICACAO
        //await email.Envio_Email(process.env.APP_NAME + ' | Erro Aplicação - ZEROU LOOP', String('********* ZEROU LOOP ************\n' + inicio_operacao));
        inicio_operacao = 0;
    } else {
        console.log(inicio_operacao, 'Execução: ' + data_execucao_real, global.data_loop)
    }

    //EXECUTA A APLICAÇÃO
    if (inicio_operacao === 0) {
        inicio_operacao = 2;
        global.data_loop = data_execucao_real;
        console.log(inicio_operacao, 'Iniciando a execução: ' + data_execucao_real)

        await aplicacao.main()
        inicio_operacao = 0;
    }
});    