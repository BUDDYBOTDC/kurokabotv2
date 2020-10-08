module.exports = () => {
    const r = ["qwertyuiopañsldkfjghcmvnbxz1234567890", "qwertyuiopañsldkfjghcmvnbxz1234567890".toUpperCase()].join("")

    const times = Math.floor(Math.random() * 2) + 10

    let key = ""

    for (let i = 0; i < times; i++) {
        key += r[Math.floor(Math.random() * r.length)]
    }

    return key
}