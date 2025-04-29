import { Injectable } from "@angular/core";
import { AuthService } from "./auth.service";
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class PermissionService implements CanActivate {

  constructor(private authService: AuthService, private router: Router
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const requiredPermission = next.data['permission'];
    return this.hasPermission(requiredPermission).then(hasPermission => {
      if (hasPermission) {
        return true;
      } else {
        this.router.navigate(['/login']);
        return false;
      }
    });
    return false;
  }

  public async hasPermission(permission: string): Promise<boolean> {
    return this.verifyPermission(permission);
  }

  hasPermissionButton(permission: string): boolean {
    return this.verifyPermission(permission);
  }

  verifyPermission(permission: string) {
    try {
      // Verifica se o token expirou
      if (this.authService.tokenExpire()) {
        return false;
      }

      return this.authService?.currentUserTokenDetails?.roles?.includes(permission);
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}