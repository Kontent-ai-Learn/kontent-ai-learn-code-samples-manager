function getCodeSamplesCodename(codename) {
    const index = codename.lastIndexOf('_');

    return codename.substring(0, index);
}

module.exports = {
    getCodeSamplesCodename
}
