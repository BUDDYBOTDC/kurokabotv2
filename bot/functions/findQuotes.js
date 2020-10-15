module.exports = (arg = new String()) => {
    return ["“", "”", "“", '"', "'"].find(i => arg.startsWith(i))
}