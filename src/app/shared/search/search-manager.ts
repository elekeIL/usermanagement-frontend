import {SearchHandler} from "./search-handler";
import {SearchFilterSource} from "./search-filter-source";
import {QueryResults} from './query-results';

export class SearchManager<E, S> {

  _working: boolean | undefined;
  private _filter: S | undefined;

  private _queryResult: QueryResults<E> | undefined;

  private searchHandler: SearchHandler<E, S>;
  public filterSource: SearchFilterSource<S> | undefined;

  private _page: number | undefined;
  private _itemsPerPage: number = 10;

  constructor(searchHandler: SearchHandler<E, S>, filterSource?: SearchFilterSource<S>) {
    this.searchHandler = searchHandler;
    this.filterSource = filterSource;
  }

  getQueryResult() {
    return this._queryResult;
  }

  private set queryResult(queryResult: QueryResults<E>) {
    this._queryResult = queryResult;
    this._page = (this.offset / this.itemsPerPage) + 1;
  }

  get working() {
    return this._working;
  }

  get offset() {
    if (!this._queryResult) {
      return 0;
    }
    return this._queryResult.offset;
  }

  get totalAmount() {
    if (!this._queryResult) {
      return 0;
    }
    if (!this._queryResult.totalAmount) {
      return 0;
    }
    return this._queryResult.totalAmount;
  }

  get list(): E[] {
    return this._queryResult ? this._queryResult.results : [];
  }

  get totalCount() {
    if (!this._queryResult) {
      return 0;
    }
    return this._queryResult.total;
  }

  set itemsPerPage(value: number) {
    this._itemsPerPage = value;
  }

  get itemsPerPage() {
    return this._itemsPerPage;
  }

  get page(): number | undefined {
    return this._page;
  }

  set page(page: number | undefined) {
    this._page = page;
    this.goToPage(page);
  }

  public reloadAndShowFirstPage() {
    const f: S | undefined = this.filterSource && this.filterSource.getFilter();
    // if (this._sessionStoreService) {
    //     this._sessionStoreService.saveData('searchFilter', location.href, f);
    // }
    if (typeof f === 'string' || typeof f === 'number') {
      this._filter = f;
    } else if (f) {
      this._filter = Object.assign({}, f);
    }
    this.page = 1;
  }

  private goToPage(page: number | undefined) {
    this._working = true;
    if (this._filter && (typeof this._filter === 'string' || typeof this._filter === 'number')) {
      this.searchHandler.search(page, this._filter).subscribe(queryResult => {
        this.doneWorking();
        this.queryResult = queryResult;
      }, () => {
        this.doneWorking();
      });
    } else {
      this.searchHandler.search(page, this.filter).subscribe(queryResult => {
        this.doneWorking();
        this.queryResult = queryResult;
      }, () => {
        this.doneWorking();
      });
    }
    this.saveFilterData();

    console.log(this.getSavedFilterData())
  }

  get filter() {
    return Object.assign({}, this._filter);
  }

  private doneWorking() {
    setTimeout(() => {
      this._working = false;
    });
  }

  private saveFilterData() {
    localStorage.setItem(this.filterSource.getPersistentKey(), JSON.stringify(this._filter));
  }

  getSavedFilterData(): S {
    return JSON.parse(localStorage.getItem(this.filterSource.getPersistentKey()));
  }
}
