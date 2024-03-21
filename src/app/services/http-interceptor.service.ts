import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {EventEmitter, Injectable} from '@angular/core';
import * as moment from 'moment';
import {ToastrService} from 'ngx-toastr';
import {AsyncSubject, from, Observable, Observer} from 'rxjs';
import {AuthenticationService} from './authentication.service';
import {KeycloakService} from 'keycloak-angular';
import {mergeMap} from 'rxjs/operators';
import {PageManager} from './page-manager';
import {environment} from "../../environments/environment";

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {

  private static TOKEN_NAME = 'TOKEN';
  private static headers: any = {};
  private _lastSeen!: moment.Moment;
  private accountCode:string|undefined;

  constructor(
    private toastr: ToastrService,
    private keycloakService: KeycloakService,
    private pageManager: PageManager,
    private authenticationService: AuthenticationService) {
    const lastSeen = localStorage.getItem(HttpInterceptorService.name + '.lastSeen');
    if (lastSeen) {
      this._lastSeen = moment.unix(parseInt(lastSeen, 10));
    }
    this.authenticationService.getAccount().subscribe(value => {
      this.accountCode=value?.accountCode;
    })
  }

  private _httpError: EventEmitter<HttpErrorResponse> = new EventEmitter();

  public get httpError() {
    return this._httpError;
  }

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const httpHeaders = {} as any;
    const handled: Observable<HttpEvent<any>> = from(this.keycloakService.getToken().catch(reason => console.log(reason)))
      .pipe(mergeMap(token => {
        if (token) {
          httpHeaders['Authorization'] = 'bearer ' + token;
        }
        if(this.accountCode){
          httpHeaders['X-ACCOUNT-CODE'] = this.accountCode;
        }
        if (token && moment().subtract(environment.sessionTimeout, 'minutes').isAfter(this._lastSeen)) {
          this.toastr.info(`Session timed out after ${environment.sessionTimeout} mins of inactivity`, 'Session Timeout',
            {
              disableTimeOut: false
            });
          // TODO: Update logout link to '/login'
          this.authenticationService.logout(window.location.origin);
        }
        this._lastSeen = moment();
        localStorage.setItem(HttpInterceptorService.name + '.lastSeen', `${this._lastSeen.valueOf() / 1000}`);
        return next.handle(req.clone({setHeaders: httpHeaders}));
      }));

    const subject: AsyncSubject<HttpEvent<any>> = new AsyncSubject();
    handled.subscribe(subject);


    subject.subscribe(async (event: HttpEvent<any>) => {

      if (event instanceof HttpErrorResponse) {
        // if (event.status === 401) {
        //   await this.authenticationService.login({
        //     redirectUri: window.location.origin
        //   });
        //   return;
        // }
        this._httpError.emit(event);
      }
    }, async (err: HttpEvent<any>) => {
      if (err instanceof HttpErrorResponse) {
        if (err.status < 1) {
          this.toastr.error('Please check your internet connection', 'Failed to contact server');
        } else if (err.status === 401) {
          // await this.authenticationService.logout();
          // await this.authenticationService.login({
          //   redirectUri: window.location.origin+'/dashboard'
          // });
          return;
        } else if (err.status === 404) {
          return;
        } else if (err.status === 403) {
          this.authenticationService.forbidAccess();
          return;
        }
        this._httpError.emit(err);
      }
    });
    return Observable.create((obs: Observer<HttpEvent<any>>) => {
      subject.subscribe(obs);
    });
  }
}
