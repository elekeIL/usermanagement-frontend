import { Serializable } from '../models/serializable';


export class Pagination extends Serializable {
    public offset = 0;
    public limit = 10;
    public pageSize = 10;
    public totalCount = 0;
}
