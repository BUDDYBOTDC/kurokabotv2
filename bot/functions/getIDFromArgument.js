module.exports = (arg = new String()) => {

    if (arg.startsWith("<@&") && arg.endsWith(">")) {
        return arg.split("<@&")[1].split(">")[0]
    }

    return arg
}