
export class PaginatedSearch<E> {

    private filter: E;
    private limit: number;
    private offset = 0;

    constructor(filter: E, limit: number, offset = 0) {
        this.filter = filter;
        this.limit = limit;
        this.offset = offset;
    }

    public static removeNullFields(filter:any) {
        Object.keys(filter).forEach(fieldName => {
            // if (filter[fieldName] && typeof filter[fieldName] === 'string') {
            //     filter[fieldName] = filter[fieldName].trim;
            // }
            if (!filter[fieldName]) {
                delete filter[fieldName];
                return;
            }
        });
        return filter;
    }

    public static createSimplePager(limit: number, offset = 0) {
        return new PaginatedSearch({}, limit, offset);
    }

    public static createCleanFilter<E>(filter: E, limit: number, offset = 0) {
        return new PaginatedSearch<E>(PaginatedSearch.removeNullFields(filter), limit, offset);
    }

    // public static toQueryParamString(obj, prefix?: string) {
    //     const str = [];
    //     for (const p in obj) {
    //         if (!obj.hasOwnProperty(p)) {
    //             continue;
    //         }
    //         const k = prefix ? prefix + '[' + p + ']' : p;
    //         const v = obj[p];
    //         // console.log(k);
    //         if (isArray(v)) {
    //             for (let i = 0; i < v.length; i++) {
    //                 const vi = v[i];
    //                 // console.log(k, vi, typeof vi);
    //                 str.push((vi !== null && typeof vi === 'object') ?
    //                     PaginatedSearch.toQueryParamString(vi, prefix + '[' + i + ']') :
    //                     encodeURIComponent(k) + '=' + encodeURIComponent(vi));
    //             }
    //         } else {
    //             str.push((v !== null && typeof v === 'object') ?
    //                 PaginatedSearch.toQueryParamString(v, k) :
    //                 encodeURIComponent(k) + '=' + encodeURIComponent(v));
    //         }
    //     }
    //     return str.join('&');
    // }

    public getSearchParams(): any {
        return Object.assign({}, this.filter, { offset: this.offset, limit: this.limit });
    }
}
