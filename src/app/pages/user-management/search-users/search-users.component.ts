import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CreateUserComponent, removeUndefinedOrNullFields} from "../create-user/create-user.component";
import {BsModalService} from "ngx-bootstrap/modal";
import {Router} from "@angular/router";
import {NameValuePair} from "../../../models/etc/name-value-pair.model";
import {PageManager} from "../../../services/page-manager";
import * as moment from "moment";
import {SelectionManager} from "../../../models/etc/selection-manager";
import {BehaviorSubject} from "rxjs";
import {PageChangedEvent} from "ngx-bootstrap/pagination";
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'app-search-users',
  templateUrl: './search-users.component.html',
  styleUrls: ['./search-users.component.css']
})
export class SearchUsersComponent implements OnInit{

  @ViewChild('dismissButton') dismissButton!: ElementRef;
  @ViewChild('closeCreateInvite') closeCreateInvite!: ElementRef;
  @ViewChild(CreateUserComponent) formComponent: CreateUserComponent;
  @ViewChild('dismissEditButton') dismissEditButton!: ElementRef;

  @HostListener('window:resize', ['$event'])
  onResize(event): void {
    this.setScreenSize(event.target.innerWidth);
  }

  form: FormGroup;
  defaultPageSize = 10;
  loading = false;
  fetchingRoles = false;
  roles: string[] = [];
  minDate: any;
  addUser = false;
  userId: number;
  showFilters = false;
  isXsScreen: boolean;
  isSmScreen: boolean;
  isMdScreen: boolean;
  isLgScreen: boolean;
  errorMessage: string;
  successMessage: string;
  showErrorMessageTrigger = false;
  showSuccessMessageTrigger = false;
  selectionManager: SelectionManager<User, number>;
  limit = 10;
  offset: number;
  page: any;
  queryResults!: QueryResultsUsers;

  resultArray: any[];
  resultSubject = new BehaviorSubject<QueryResultsUsers>({});
  filterData: UserSearchFilter;

  tabIDs: {
    USERS: string;
    INVITES: string;
  } = {
    USERS: 'USERS',
    INVITES: 'INVITES'
  };

  activeTab: string = this.tabIDs.USERS;
  selectedUserIds: number[] = [];
  static searchFilter: string = 'Search';
  data: any;
  searching = false;
  totalRecords: number;

  constructor(
    private fb: FormBuilder,
    private pageManager: PageManager,
    private router: Router,
    private httpClient: HttpClient
  ) {

    this.setScreenSize(window.innerWidth)
    class ItemsSelect extends SelectionManager<any, any> {

      getIdentifier(e: any) {
        return e;
      }

      getState(e: any): number {
        return e.id;
      }

      // isSelectable(e: any): boolean {
      //   return true;
      // }
    }

    this.selectionManager = new ItemsSelect();
  }

  ngOnInit(): void {
    this.data = JSON.parse(<string>sessionStorage.getItem(SearchUsersComponent.searchFilter)) || '';
    const {startDate, EndDate, limit, offset} = this.data;
    this.initializeForm();
    this.form.get('startDate')?.setValue(null);
    this.form.get('endDate')?.setValue(null);
    this.form.get('startDate')?.valueChanges.subscribe((v) => {
      this.minDate = v;
      if (this.form.get('endDate')?.value < v) {
        this.form.get('endDate')?.setValue(null);
      }
    });
    this.loadSearchData();
    this.onSearchClick();
  }

  initializeForm(): void {
    this.form = this.fb.group({
      name: [''],
      startDate: [''],
      endDate: [''],
      limit: [],
      offset: ['']
    });
  }

  private loadSearchData(): void {
    const data = this.pageManager.getData(SearchUsersComponent.name, 'search');
    if (data) {
      this.form.patchValue(data);
      this.showFilters = true;
    }
  }


  now(): Date {
    return new Date();
  }

  getMinDate(): Date {
    return this.minDate;
  }


  submit(): void {
    if (!this.form.valid) {
      return;
    }
  }


  onDismiss(): void {
    this.dismissButton.nativeElement.click();
    this.formComponent.showErrorMessageTrigger = false;
    this.formComponent.errorMessage = '';
    this.onSearchClick();
  }
  clearForm(): void {
    this.formComponent.resetForm();
  }
  setScreenSize(width: number): void {
    this.isXsScreen = width < 576;
    this.isSmScreen = width >= 576 && width < 768;
    this.isMdScreen = width >= 768 && width < 992;
    this.isLgScreen = width >= 992;
  }

  showErrorMessage(error: any): void {
    this.errorMessage = error;
    this.showErrorMessageTrigger = true;
    window.scroll(0, 0);
    setTimeout(() => {
      this.showErrorMessageTrigger = false;
    }, 20000);
  }

  getErrorMessage(): string {
    return this.errorMessage;
  }


  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  showSuccessMessage(msg): void {
    this.successMessage = msg;
    this.showSuccessMessageTrigger = true;
    window.scroll(0, 0);
    setTimeout(() => {
      this.showSuccessMessageTrigger = false;
    }, 10000);
  }

  getSuccessMessage(): string {
    return this.successMessage;
  }

  change(row: any): void {
    console.log('selected user', row);
  }


  onPageChange(event: PageChangedEvent) {
    let filter = this.getFilter(this.limit);
    filter.offset = getOffset(event.page, event.itemsPerPage);
    this.offset = filter.offset;
    this.page = event?.page;
    this.search(filter);
  }

  changeLimit($event: number) {
    this.limit = $event;
    let filter = this.getFilter($event);
    filter.offset = getOffset(0, $event);
    this.offset = filter.offset;
    this.search(filter)
  }

  onClearFilterClick() {
    this.form.reset();
    sessionStorage.removeItem(SearchUsersComponent.searchFilter);
    let filter = this.getFilter(this.limit);
    filter.offset = getOffset(this.data.page || 0, this.limit);
    this.offset = filter.offset;
    this.search(filter);
  }

  getFilter(limit?: number): UserSearchFilter{
    const data = this.form!.value;


    let filter: UserSearchFilter = {};
    filter.startDate = data.startDate ? moment(data.startDate).format('YYYY-MM-DD') : undefined;
    filter.endDate = data.endDate ? moment(data.endDate).format('YYYY-MM-DD') : undefined;
    filter.limit = limit || 10;
    return removeUndefinedOrNullFields(filter);
  }

  search(filter: UserSearchFilter) {
    this.selectionManager.clearSelection();
    this.searching = true;
    let params = new HttpParams();
    Object.keys(filter).forEach((key) => {
        params = params.set(key, filter[key]);
    });

    // params = params.append('page', this.page.toString());
    this.httpClient.get<any>(`${environment.apiBaseUrl}/users`, {params: params}).subscribe(v => {
      this.filterData = filter;
      Object.keys(this.filterData).forEach(v => {
        if (v == 'limit' || v == 'offset') {
          delete this.filterData![v]
        }
      })
      this.searching = false;
      this.resultArray = v?.object?.list;
      this.totalRecords =v?.object?.count;
      console.log(this.resultArray)
      this.resultSubject.next(v);
    }, () => {

    });

    this.data = filter;
    this.data.page = this.page;
    sessionStorage.setItem(SearchUsersComponent.searchFilter, JSON.stringify(this.data));
  }

  onSearchClick() {
    if (!this.form?.valid) {
      return;
    }
    let filter = this.getFilter(this.limit);
    filter.offset = getOffset(this.data.page || 0, this.limit);
    this.offset = filter.offset;
    this.search(filter);
  }


}

export function getOffset(page: number, size: number): number {
  let offset;
  if (page == 0) {
    offset = 0;
  }
  if (page >= 1) {
    offset = (page - 1) * size;
  }
  // @ts-ignore
  return offset;
}

export interface User {
  email: string,
  username: string ,
  firstName: string,
  lastName: string,
  password: string,
  phoneNumber: string,
  displayName: string,
  type: string,
  dateOfBirth: string,
}

export interface QueryResultsUsers{
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  email?: string;
  dob?: string;
  offset?: number;
  limit?: number
  results?: []
}

interface UserSearchFilter{
  sortBy?: string;
  offset?: number;
  limit?:number;
  startDate?: string;
  endDate?: string;
}
