var mysql = require('mysql');
var conexao = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'db_nodejs_crud_master'
});
conexao.connect(function(error) {
    if (!!error) {
        console.log(error);
    } else {
        console.log('Conectado..!');
    }
});

module.exports = conexao;