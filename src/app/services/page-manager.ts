import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {BehaviorSubject, Subscription} from 'rxjs';
import {Constant} from '../models/enum/constants';

@Injectable({
  providedIn: 'root'
})

export class PageManager {

  private _storeName = '_session-store';

  private store: any;

  private _subs: Subscription[] = [];

  constructor(public router: Router) {
    // this.currentUserAccount$ = new BehaviorSubject<UserAccount>(this.getCurrentUserAccountFromStorage());
  }

  // getLanguageFromStorage() {
  //   return this.getData('LANGUAGE', 'selectedPref', Constant.Storage.LOCAL) || 'en';
  // }

  // public setLanguage(lang: string) {
  //   this.storeData('LANGUAGE', 'selectedPref', lang, Constant.Storage.LOCAL);
  //   lang = lang || 'en';
  //   if (this.language$.value === lang) {
  //     return;
  //   }
  //   this.language$.next(lang);
  // }

  getCurrentUserAccountFromStorage() {

    return this.getData('USER_ACCOUNT', 'currentAccount', Constant.Storage.LOCAL);
  }



  getStore(storageType: Constant.Storage) {
    const sessionStore = this.isLocal(storageType) ? localStorage.getItem(this._storeName) : sessionStorage.getItem(this._storeName);
    return sessionStore ? JSON.parse(sessionStore) : {};
  }

  public storeData(scope: string, key: string, data: any, storageType: Constant.Storage = Constant.Storage.LOCAL): boolean {
    // if (!this.storages.includes(storageType.toLowerCase())) return false;

    this.store = this.getStore(storageType);
    if (!this.store[scope]) {
      this.store[scope] = {};
    }
    this.store[scope][key] = JSON.stringify(data);

    this.persist(storageType);

    return this.store[scope];
  }

  public getData(scope: string, key: string, storageType: Constant.Storage = Constant.Storage.LOCAL): any | boolean {

    // if (!this.storages.includes(storageType.toLowerCase())) return false;

    this.store = this.getStore(storageType);
    if (!this.store[scope] || !this.store[scope][key]) {
      return false;
    }
    return JSON.parse(this.store[scope][key]);
  }

  public removeData(scope: string, key: string, storageType: Constant.Storage = Constant.Storage.LOCAL): boolean {

    // if (!this.storages.includes(storageType.toLowerCase())) return false;

    this.store = this.getStore(storageType);

    if (!this.store[scope] || !this.store[scope][key]) {
      return false;
    }
    delete this.store[scope][key];

    this.persist(storageType);

    return true;
  }

  public clearAllData() {
    localStorage.clear();
    sessionStorage.clear();
  }


  isLocal(type: Constant.Storage): boolean {
    return type === Constant.Storage.LOCAL;
  }

  private persist(storageType: Constant.Storage) {
    if (this.isLocal(storageType)) {
      localStorage.setItem(this._storeName, JSON.stringify(this.store));
    } else {
      sessionStorage.setItem(this._storeName, JSON.stringify(this.store));
    }
  }
}
