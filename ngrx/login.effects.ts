import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { EMPTY, of } from "rxjs";
import { map, mergeMap, catchError, exhaustMap, tap } from "rxjs/operators";
import { AuthService } from "../../../../../../services/src/public-api";
import {
  login,
  loginSuccess,
  loginFailure,
} from "../../../Actions/Authentication/Login/login.action";
import { appLoader } from "../../../Actions/Loader/loader.action";
import { GetAllSubscribedInsurers } from "../../../Actions/Subscription/getAllSubscribers.action";
import { AppState } from "../../../AppStates/app.states";
// import { }
@Injectable()
export class LoginEffects {
  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private store: Store<AppState>,
    private router: Router
  ) {}

  LoginEffect$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(login),
      exhaustMap((action) => {
        console.log(action);
        return this.authService.loginUser(action.user).pipe(
          map((user) => {
            this.store.dispatch(appLoader({ loaderStatus: false }));
            return loginSuccess({ user });
          }),
          catchError((error: any) => {
            let errorMessage = error.statusText;
            this.store.dispatch(appLoader({ loaderStatus: false }));
            console.log(errorMessage);
            return of(loginFailure({ message: errorMessage }));
          })
        );
      })
    );
  });

  loginRedirect$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(loginFailure),
        tap((action) => {
          this.router.navigate(["/insurerLayout"]);
        })
      );
    },
    { dispatch: false }
  );
}
