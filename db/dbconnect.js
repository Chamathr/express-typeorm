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

module.exports = {connection}