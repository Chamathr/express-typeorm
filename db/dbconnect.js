const {createConnection, Connection} = require('typeorm');

const connection = async () => await createConnection({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "Kumar_123",
    database: "prisma_test",
    synchronize: true,
    entities: [
        require("../entity/User")
    ]
})

// const connection = async () => await createConnection({
//     type: "mysql",
//     host: "mysql-server-rec.mysql.database.azure.com",
//     port: 3306,
//     username: "chamath",
//     password: "Kumar_123",
//     database: "users-reg",
//     synchronize: true,
//     entities: [
//         require("../entity/User")
//     ]
// })

module.exports = {connection}