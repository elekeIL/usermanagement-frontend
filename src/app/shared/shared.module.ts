import {NgModule} from '@angular/core';
import {NgChartsModule} from "ng2-charts";
import { MinTwoDigitsPipePipe } from './pipes/min-two-digits-pipe.pipe';
import { AbbreviateNumberPipe } from './pipes/abbreviate-number.pipe';
import {AmountPipe} from "./pipes/amount.pipe";
import {ShortestDatePipe} from "./pipes/shortest-date.pipe";
import {UnderscoreToSpacePipe} from "./pipes/underscore-to-space.pipe";
import {LoaderComponent} from "./loader/loader.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {FullPageLoaderComponent} from "./loader/full-page-loader/full-page-loader.component";
import {FileUrlPipe} from "./pipes/file-url.pipe";
import {CamelCaseToSpacePipe} from "./pipes/camel-case-to-space.pipe";
import {CommonModule, DatePipe} from "@angular/common";
import {EnumToArrayPipe} from "./pipes/enum-to-array.pipe";
import {ConfirmDialogComponent} from "./confirm-dialog/confirm-dialog.component";
import {SuccessDialogComponent} from "./components/success-dialog/success-dialog.component";
import { ErrorMessageComponent } from './error-message/error-message.component';
import { PageLengthComponent } from './page-length/page-length.component';


@NgModule({
  declarations: [
    FullPageLoaderComponent,
    LoaderComponent,
    UnderscoreToSpacePipe,
    ShortestDatePipe,
    EnumToArrayPipe,
    CamelCaseToSpacePipe,
    FileUrlPipe,
    ConfirmDialogComponent,
    MinTwoDigitsPipePipe,
    AbbreviateNumberPipe,
    AmountPipe,
    SuccessDialogComponent,
    ErrorMessageComponent,
    PageLengthComponent
  ],
  providers: [DatePipe],
    imports: [
        CommonModule,
        FormsModule,
        NgChartsModule,
        ReactiveFormsModule,
        // NgBootstrapFormValidationModule
    ],
    exports: [
        CommonModule,
        FullPageLoaderComponent,
        ReactiveFormsModule,
        LoaderComponent,
        ConfirmDialogComponent,
        UnderscoreToSpacePipe,
        ShortestDatePipe,
        EnumToArrayPipe,
        FileUrlPipe,
        MinTwoDigitsPipePipe,
        AbbreviateNumberPipe,
        AmountPipe,
        CamelCaseToSpacePipe,
        SuccessDialogComponent,
        ErrorMessageComponent,
        PageLengthComponent
    ]
})
export class SharedModule {
}
