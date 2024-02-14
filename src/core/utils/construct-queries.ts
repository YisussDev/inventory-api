export const constructQuery = (queries: string[][]): any => {
    let queriesToSearch = {};
    if (queries && queries.length > 0) {
        for (const query of queries) {
            if (query.length >= 3) {
                queriesToSearch[query[0]] = { $regex: new RegExp(query[2].slice(1, -1).toString(), 'i') };
            }
        }
    }
    return queriesToSearch;
}

export const contructLinksMeta = (totalDocuments: number): any[] => {
    const links: any[] = [];
    for (let i = 0; i < (Math.trunc(totalDocuments / 10) + 1); i++) {
        if (i == 0) {
            links.push({
                urL: null,
                label: 'test123'
            })
        }
        else if (i == (Math.trunc(totalDocuments / 10) + 1)) {
            links.push({
                urL: null,
                label: 'test123'
            })
        }
        else {
            links.push({
                urL: `http://test.com?page=${i + 1}`,
                label: i + 1
            })
        }
    }
    return links;
}