import {AbstractControl, AsyncValidatorFn, ValidationErrors, ValidatorFn} from "@angular/forms";
import {Observable, of} from "rxjs";


export class CustomValidators {

  static supportedExtensions(extensions: string[]): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      let fileName!: string;
      if (typeof control.value == 'string') {
        fileName = control.value;
      } else if (control.value instanceof File) {
        fileName = control.value.name;
      }

      if (!fileName) {
        return null;
      }
      for (let extension of extensions) {
        if (fileName.endsWith(extension)) {
          return null;
        }
      }
      return {'unsupportedFileType': true};
    };
  }

  static sameValue(siblingControlPath: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (!control || !control.value) {
        return null;
      }
      const sibling = control?.parent?.get(siblingControlPath);

      return control.value === sibling?.value ? {'sameValue': true} : null;
    };
  }

  /**
   * @description
   * Checks that a string input is not blank. This implementation trims all whitespace characters before checking for
   * length.
   *
   * This validator works for only string inputs.
   *
   * @returns A validator error map with the
   * `notBlank` property if the validation check fails (the length of the string is less than 1 after trimming), otherwise `null`.
   * Note that this validator passes for null|undefined values but fails for empty strings
   */
  static notBlank(control: AbstractControl): ValidationErrors | null {
    return notBlankValidator(control);
  }


  /**
   * @description
   * Validator that requires the length of the control's value to be greater than or equal
   * to the provided minimum length. This validator is also provided by default if you use the
   * the HTML5 `minlength` attribute. Note that the `minLength` validator is intended to be used
   * only for strings. The
   * `minLength` validator logic is also not invoked for values when their `length` property is 0
   * (for example in case of an empty string), to support optional controls. You
   * can use the standard `required` validator if empty values should not be considered valid.
   *
   * @usageNotes
   *
   * ### Validate that the field has a minimum of 3 characters
   *
   * ```typescript
   * const control = new FormControl('ng', Validators.minLength(3));
   *
   * console.log(control.errors); // {minlength: {requiredLength: 3, actualLength: 2}}
   * ```
   *
   * ```html
   * <input minlength="5">
   * ```
   *
   * @returns A validator function that returns an error map with the
   * `minlength` property if the validation check fails, otherwise `null`.
   *
   * @see `updateValueAndValidity()`
   *
   */
  static minLength(minLength: number, trimFirst = true): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value == null || control.value.length === 0) {
        // don't validate empty values to allow optional controls
        // don't validate values without `length` property
        return null;
      }

      return control.value.trim().length < minLength ?
        {'minlength': {'requiredLength': minLength, 'actualLength': control.value.trim().length}} :
        null;
    };
  }

  static async(obs: (control: AbstractControl) => Observable<ValidationErrors>): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors> => {
      if (!control.value) {
        return of(null);
      }
      return obs.call(control);
    };
  }



}

export interface CustomAsyncValidator {
  validate(control: AbstractControl): Observable<ValidationErrors>;
}

export function notBlankValidator(control: AbstractControl): ValidationErrors | null {
  if (control.value == null || control.value.length == 0) {
    return null;
  }
  return control.value.trim().length > 0 ? null : {'notBlank': true};
}

// export class PhoneNumberUtils {
//
//   public static isValid(value: string): boolean {
//     if (!value) { return true; }
//     if (value.startsWith('0')) {
//       return /^0\d{10}$/.test(value);
//     }
//     const phoneNumber: ParsedNumber = parse(value);
//     // console.log('phoneNumber: ', phoneNumber);
//     if (phoneNumber.country && phoneNumber.country.toString() === 'NG') {
//       // console.log(`0${phoneNumber.phone.toString()}`);
//       return /^\d{10}$/.test(phoneNumber.phone.toString());
//     }
//     return false;
//   }
//
//   public static countryCode(value: string): string | null {
//     if (!value) { return null; }
//     const phoneNumber: ParsedNumber = parse(value);
//     // console.log(value, phoneNumber);
//     if (phoneNumber.country) {
//       return phoneNumber.country.toString();
//     }
//     return null;
//   }
// }
