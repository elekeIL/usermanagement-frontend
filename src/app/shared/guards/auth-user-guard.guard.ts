import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable, of} from 'rxjs';
import {catchError, map} from "rxjs/operators";
import {AuthenticationService} from "../../services/authentication.service";

@Injectable({
  providedIn: 'root'
})
export class AuthUserGuardGuard implements CanActivate {

  constructor(private router: Router, private authenticationService: AuthenticationService) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return this.authenticationService.getUser()
      .pipe(map((user => {
        if (!user) {
          this.router.navigate(['/login']);
        }
        const permissions: string[] = route.data.permissions;
        if (!permissions || !permissions.length || permissions.filter(it => user.hasPermission(it)).length) {
          return true;
        }
        return !!user;
      })))
      .pipe(catchError((err: any, caught: Observable<any>) => {
        this.router.navigate(['/login']);
        return of(false);
      }));

    return true;
  }

}
