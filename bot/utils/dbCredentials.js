module.exports = {
    testing: {
        host: "locahost",
        storage: "db.sqlite",
        dialect: "sqlite",
        logging: false
    },
    real: {
        dialect: "mysql",
        host: "199.127.60.203",
        logging: false,
        pool: {
            max: 1000,
            min: 0,
            idle: 10000,
            acquire: 120000
        }
    }
}