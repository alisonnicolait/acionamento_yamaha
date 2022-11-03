const moment = require('moment-timezone');
const local_gmt = "America/Sao_Paulo";
const server_gmt = "Africa/Abidjan";

class Config {
    constructor() {
        this.moment = moment;
        this.local_gmt = local_gmt;
        this.server_gmt = server_gmt;        
    }
    data_atual = () => {
        return this.moment().tz(this.local_gmt).format("YYYY-MM-DD HH:mm:ss");
    }
    data_gmt = () => {
        return this.moment().tz(this.server_gmt).format("YYYY-MM-DD HH:mm:ss");
    }
}
module.exports = Config;