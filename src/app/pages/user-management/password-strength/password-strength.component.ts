import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChange,
  SimpleChanges
} from '@angular/core';

@Component({
  selector: 'password-strength',
  templateUrl: './password-strength.component.html',
  styleUrls: ['./password-strength.component.css']
})
export class PasswordStrengthComponent implements OnChanges {
  firstBar: string;
  secondBar: string;
  thirdBar: string;
  fourthBar: string;

  @Input() public password: string;

  @Output() strength = new EventEmitter<{ isStrong: boolean; value: number }>();
  @Output() text = new EventEmitter<string>();
  @Output() textColor = new EventEmitter<string>();

  private colors = ['darkred', 'orangered', 'orange', 'yellowgreen'];
  message: string;
  messageColor: string;

  validatePasswordStrength(password: string): number {
    let strength = 0;
    const regex = /[$-/:-?{-~!"^_@`[\]]/g;
    const lowerLetters = /[a-z]+/.test(password);
    const upperLetters = /[A-Z]+/.test(password);
    const numbers = /[0-9]+/.test(password);
    const symbols = regex.test(password);

    const validationCriteria = [lowerLetters, upperLetters, numbers, symbols];

    let valid = 0;
    for (const validationCriterion of validationCriteria) {
      valid += validationCriterion === true ? 1 : 0;
    }

    strength += 2 * password.length + (password.length >= 10 ? 1 : 0);

    strength += valid * 10;

    strength = password.length <= 6 ? Math.min(strength, 10) : strength;

    strength = valid === 1 ? Math.min(strength, 10) : strength;
    strength = valid === 2 ? Math.min(strength, 20) : strength;
    strength = valid === 3 ? Math.min(strength, 30) : strength;
    strength = valid === 4 ? Math.min(strength, 40) : strength;
    return strength;
  }

  ngOnChanges(changes: { [propName: string]: SimpleChange }): void {
    const password = changes['password'].currentValue;
    this.setBarColors(4, '#DDD');
    if (password) {
      const pwdStrength = this.validatePasswordStrength(password);
      pwdStrength === 40
        ? this.strength.emit({ isStrong: true, value: pwdStrength })
        : this.strength.emit({ isStrong: false, value: pwdStrength });
      const color = this.getBarColor(pwdStrength);
      this.setBarColors(color.index, color.color);

      switch (pwdStrength) {
        case 10:
          this.message = 'Weak';
          break;
        case 20:
          this.message = 'Not Good';
          break;
        case 30:
          this.message = 'Average';
          break;
        case 40:
          this.message = 'Great';
          break;
      }
    } else {
      this.message = '';
    }
    this.text.emit(this.message);
  }

  getBarColor(strength: number): { color: string; index: number } {
    let index = 0;
    if (strength === 10) {
      index = 0;
    } else if (strength === 20) {
      index = 1;
    } else if (strength === 30) {
      index = 2;
    } else if (strength === 40) {
      index = 3;
    } else {
      index = 4;
    }

    this.messageColor = this.colors[index];
    this.textColor.emit(this.messageColor);
    return {
      index: index + 1,
      color: this.colors[index]
    };
  }

  setBarColors(count: number, color: string): void {
    const barProperties = ['firstBar', 'secondBar', 'thirdBar', 'fourthBar', 'fifthBar'];
    for (let n = 0; n < count && n < barProperties.length; n++) {
      (this as any)[barProperties[n]] = color;
    }
  }
}
