import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Router, RouterStateSnapshot} from '@angular/router';
import {KeycloakAuthGuard, KeycloakService} from 'keycloak-angular';
import {AuthenticationService} from "../../services/authentication.service";

@Injectable({
  providedIn: 'root'
})
export class LoggedInGuard extends KeycloakAuthGuard {

  constructor(
    protected readonly router: Router,
    protected readonly keycloak: KeycloakService,
    protected readonly authenticationService: AuthenticationService
  ) {
    super(router, keycloak)
  }

  public async isAccessAllowed(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (!this.authenticated) {
      await this.authenticationService.login({redirectUri: window.location.origin + state.url});
      return false;
    } else {
      const result = new Promise<boolean>((resolve, reject) => {
        this.authenticationService.getUser().subscribe(user => {
          console.log(user)
          if (!user) {
            resolve(false);
            return;
          }
          var allowedPermissions: RoutePermissionRestriction[] = (route.data.permissions as RoutePermissionRestriction[]) ?? [];
          //no permission restriction. allow
          if (!allowedPermissions || allowedPermissions.length < 1) {
            resolve(true);
            return true;
          }
          for (let i = 0; i < allowedPermissions.length; i++) {
            let hasRestrictedRoles = (allowedPermissions[i].roles?.length ?? 0) > 0;
            let hasRestrictedPermissions = (allowedPermissions[i].permissions?.length ?? 0) > 0;
            if (this.authenticationService.hasAccountType(allowedPermissions[i].accountType)) {
              if (!hasRestrictedRoles && !hasRestrictedPermissions) {
                resolve(true);
                return true;
              }
              if ((hasRestrictedRoles && this.authenticationService.hasAnyRole(allowedPermissions[i].roles))
                || (hasRestrictedPermissions && this.authenticationService.hasAnyPermission(allowedPermissions[i].permissions))) {
                resolve(true);
                return true;
              }
            }
          }
          this.authenticationService.forbidAccess();
          resolve(false);
        }, error => {
          this.authenticationService.forbidAccess();
          resolve(false);
          return null;
        });
      });
      return result;
    }
  }

  // canActivate(
  //   route: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
  //   return true;
  // }

}

export interface RoutePermissionRestriction {
  accountType: string
  roles: string[]
  permissions: string[]
}
