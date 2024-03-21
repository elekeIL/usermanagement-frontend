import { Observable } from "rxjs";
import { QueryResults } from "./query-results";

export interface SearchHandler<E, F> {

    search(page: number|undefined, filter?: F): Observable<any>
}
