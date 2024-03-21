import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {PageManager} from "../../../services/page-manager";
import {BsModalService} from "ngx-bootstrap/modal";
import {CustomValidators} from "../../../shared/custom-validators";
import {Utils} from "ngx-bootstrap/utils";
import {SuccessDialogComponent} from "../../../shared/components/success-dialog/success-dialog.component";
import {CountryISO, SearchCountryField} from "ngx-intl-tel-input";
import {User} from "../search-users/search-users.component";
import moment from "moment";
import {environment} from "../../../../environments/environment";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit{
  @Input() title = 'Add User';
  //create an Observable to emit the created when the user is created
  @Output() userCreated = new EventEmitter<any>();
  @Output() formCleared = new EventEmitter<void>();

  showPassword = false;
  form: FormGroup;
  errorMessage: string;
  showErrorMessageTrigger = false;
  gettingUser = false;
  fetchingRoles = false;
  fetchingPortalAccounts = false;
  creatingUser = false;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  userFound: boolean;
  formSubmitted = false;

  countryISO: CountryISO = CountryISO.Nigeria;
  preferredCountries: string[] = ['ng'];
  SearchCountryField = SearchCountryField;
  roles = [];
  presentRoles: Array<string> = [];
  selectedRoles: Array<string> = [];
  userPojos = [];
  id: number;
  accountType: any;
  accountCode: string;
  nameRegex = "^[\\w'\\-,.][^0-9_!¡?÷?¿/\\\\+=@#$%ˆ&*(){}|~<>;:[\\]]{1,}$";
  passwordHasMinLength = false;
  passwordHasNumber = false;
  passwordHasUpperAndLowerCase = false;
  passwordValidation: { isStrong: boolean; value: number };
  message: string;
  color: string;
  validPassword: boolean;
  minimumPasswordScore = '10';

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private pageManager: PageManager,
    private bsModalService: BsModalService,
    private router: Router,
    private httpClient: HttpClient
  ) {
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      email: [
        '',
        [Validators.required, CustomValidators.notBlank, Validators.email],
      ],
      phoneNumber: [''],
      firstName: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(40),
          Validators.pattern(this.nameRegex)
        ])
      ],
      lastName: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(40),
          Validators.pattern(this.nameRegex)
        ])
      ],
      dob:["", Validators.required],
      password: [
        '',
        [
          Validators.required,
          CustomValidators.notBlank,
          CustomValidators.minLength(4),
          Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d].{8,}$')
        ]
      ]
    });

    this.form.get('password').valueChanges.subscribe((value) => {
      const password = value as string;
      if (!value || (password?.trim()?.length || 0) < 1) {
        return;
      }

      this.passwordHasMinLength = password.length >= 8;
      this.passwordHasUpperAndLowerCase =
        !!password.match('(?=.*[A-Z])') && !!password.match('(?=.*[a-z])');
      this.passwordHasNumber = !!password.match('(?=.*\\d)');

      if (this.minimumPasswordScore) {
        console.log('this.passwordValidation?.value: ' + this.passwordValidation?.value);
        this.validPassword = this.passwordValidation?.value >= Number(this.minimumPasswordScore);
      }
    });
  }




  createNewUser(): void {
    this.creatingUser = true;
    this.form.markAllAsTouched();
    if(!this.form.valid){
      this.creatingUser = false;
      return;
    }

    const params: User = {
      ...this.form.value
    }

    params.displayName = this.form.get('firstName').value + " " + this.form.get('lastName').value;
    params.username = this.form.get('firstName').value + " " + this.form.get('lastName').value;
    params.dateOfBirth =  moment(this.form.get('dob').value).format('YYYY-MM-DD');
    params.phoneNumber = this.form.get('phoneNumber').value?.e164Number;

    Object.keys(params).forEach(v=> {
      if(v=='dob'){
        delete params[v];
      }
    })

    this.httpClient.post<any>(`${environment.apiBaseUrl}/users/add`, params).subscribe(v => {
      this.showSuccessModal("User created successfully");
      this.creatingUser = false;
      setTimeout(() => this.router.navigate(['/']), 4000);

    }, (error: unknown) => {
      this.creatingUser = false;
      if (
        error instanceof HttpErrorResponse &&
        error.error &&
        typeof error.error == 'object' &&
        error.error.message
      ) {
        this.errorMessage = error.error.object.errors[0]?.message;
        this.showErrorMessage(this.errorMessage);
        return;
      }
      this.errorMessage = 'Something went wrong. Please try again later.';
      return;
    });


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

  getInvalidFormFields(): string[] {
    const invalidControls = [];

    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      if (control.invalid) {
        invalidControls.push({
          name: controlName,
          errors: control.errors
        });
      }
    }
    console.log(invalidControls);

    return invalidControls;
  }

  onItemSelect(item: any): void {
    console.log(item);
  }

  onSelectAll(items: any): void {
    console.log(items);
  }

  clearForm(): void {
    this.form.reset();;
  }

  resetForm(): void {
    this.formSubmitted = false;
    this.form.reset();

    this.form.get('emailAddress').enable();
    this.form.get('firstName').enable();
    this.form.get('lastName').enable();
    this.form.get('phoneNumber').enable();
  }

  showSuccessModal(message: string): void {
    const bsModalRef = this.bsModalService.show(SuccessDialogComponent, {
      initialState: {
        title: 'Success',
        message: message,
        onClose: () => {
          this.bsModalService.hide();
        }
      },
      class: 'modal-md modal-dialog-centered',
      keyboard: false,
      backdrop: 'static'
    });
    bsModalRef.content.closeEvent.subscribe((result: any) => {
      this.userCreated.emit();
      this.form.reset();
      this.formSubmitted = false;
      this.showErrorMessageTrigger = false;
      this.errorMessage = '';
    });
  }

  clearItemsInForm(): void {
    this.formCleared.emit();
  }

  now(): Date {
    return new Date();
  }

  checkPasswordStrength(event: { isStrong: boolean; value: number }): void {
    this.passwordValidation = event;
  }

  getMessage(event: string): void {
    this.message = event;
  }

  getColor(event: string): void {
    this.color = event;
  }

  setShowPassword(): void {
    this.showPassword = !this.showPassword;
  }

}

/**
 *
 * @param obj
 */
export function removeUndefinedOrNullFields(obj: any): any {
  Object.keys(obj).forEach((key) => {
    if (
      obj[key] === undefined ||
      obj[key] === 'null' ||
      obj[key] === null ||
      obj[key] === '' ||
      obj[key] < 1
    ) {
      delete obj[key];
    }
  });

  return obj;
}
