import {NameValuePair} from "../../models/etc/name-value-pair.model";

export interface SearchFilterSource<E> {

  getFilter(): E
  getPersistentKey():string;
  getSearchDescriptor(filter: E): NameValuePair[]
}
