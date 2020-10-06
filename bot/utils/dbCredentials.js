module.exports = {
    testing: {
        host: "locahost",
        storage: "database.sqlite",
        dialect: "sqlite",
        logging: false
    },
    real: {
        dialect: "mysql",
        host: "199.127.60.203",
        logging: false
    }
}