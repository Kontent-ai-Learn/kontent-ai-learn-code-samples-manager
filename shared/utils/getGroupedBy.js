function getGroupedBy(elements, key) {
    const groups = {};
    const result = [];

    for (const element of elements) {
        if (!(element[key] in groups)) {
            groups[element[key]] = [];
            result.push(groups[element[key]]);
        }

        groups[element[key]].push(element);
    }

    return result;
}

module.exports = {
    getGroupedBy,
};
