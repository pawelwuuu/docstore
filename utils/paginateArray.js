function paginate(perPage, recordsNum, page, data) {
    let pages = parseInt(recordsNum / perPage)
    if (recordsNum % perPage !== 0) {
        pages++;
    }

    const dataPage = data.slice(
        (page - 1) * perPage,
        (page) * perPage
    );

    return dataPage
}

module.exports = paginate