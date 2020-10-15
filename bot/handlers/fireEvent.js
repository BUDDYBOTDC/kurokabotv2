module.exports = (client = new Client()) => {

    if (client.eventsFired === 0) {
        setTimeout(() => {
            client.eventsFired = 0
        }, 60000);
    }

    client.eventsFired++
}