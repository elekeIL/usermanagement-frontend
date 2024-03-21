import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {AppRoutesRoutingModule} from "./app-routes-routing.module";
import { SiteHeaderComponent } from './layout/site-header/site-header.component';
import { SiteFooterComponent } from './layout/site-footer/site-footer.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SearchUsersComponent } from './pages/user-management/search-users/search-users.component';
import { CreateUserComponent } from './pages/user-management/create-user/create-user.component';
import {SharedModule} from "./shared/shared.module";
import {PaginationModule} from "ngx-bootstrap/pagination";
import {BsDatepickerModule} from "ngx-bootstrap/datepicker";
import {NgxIntlTelInputModule} from "ngx-intl-tel-input";
import {ModalModule} from "ngx-bootstrap/modal";
import {PasswordStrengthComponent} from "./pages/user-management/password-strength/password-strength.component";

@NgModule({
  declarations: [
    AppComponent,
    SiteHeaderComponent,
    SiteFooterComponent,
    SearchUsersComponent,
    CreateUserComponent,
    PasswordStrengthComponent
  ],
  imports: [
    AppRoutesRoutingModule,
    BrowserModule,
    ModalModule.forRoot(),
    HttpClientModule, FormsModule, ReactiveFormsModule, BrowserAnimationsModule, SharedModule, PaginationModule, BsDatepickerModule, NgxIntlTelInputModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
