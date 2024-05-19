import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {TOTS_CORE_PROVIDER, TotsCoreModule} from '@tots/core';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {TOTS_AUTH_PROVIDER, TotsAuthConfig, TotsAuthInterceptor, TotsAuthModule} from '@tots/auth';
import {TOTS_CLOUD_STORAGE_PROVIDER} from '@tots/cloud-storage';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  TOTS_FORM_BUTTONS_CONFIG,
  TOTS_FORM_DEFAULT_CONFIG,
  TotsFormButtonsConfig,
  TotsFormDefaultConfig,
} from "@tots/form";
import {MatDialogModule} from "@angular/material/dialog";
import {MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule} from "@angular/material/snack-bar";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,

    /** Tots Libraries */
    TotsCoreModule,
    TotsAuthModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  providers: [
    {
      provide: TOTS_CORE_PROVIDER,
      useValue: {
        baseUrl: 'https://agency-coda.uc.r.appspot.com/'
      }
    },
    {
      provide: TOTS_CLOUD_STORAGE_PROVIDER,
      useValue: {
        bucket: 'codahub-files'
      }
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TotsAuthInterceptor,
      multi: true
    },
    {
      provide: TOTS_AUTH_PROVIDER,
      useValue: {
        signInPath: 'oauth/token',
        changePasswordPath: 'users/me/password',
      } as TotsAuthConfig
    },
    {
      provide: TOTS_FORM_DEFAULT_CONFIG,
      useClass: TotsFormDefaultConfig,

    },
    {
      provide: TOTS_FORM_BUTTONS_CONFIG,
      useClass: TotsFormButtonsConfig,
    },
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: {
        duration: 2500
      }
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
