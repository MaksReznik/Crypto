import { Component } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
enum Mode {
  Caesar = 1,
  Transposition = 2,
  Binary = 3,
  All = 4,
}

enum TranspositionMode {
  ByWord = 1,
  Full = 2,
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  resultValue: string = '';
  mode: Mode = 1;
  shiftValue: number = 1;
  transpositionMode: TranspositionMode = 1;

  constructor(public clipboard: Clipboard) {}

  caesarCipher(inputValue: string, isReverseProcess: boolean) {
    inputValue = inputValue.toUpperCase();
    const shiftValue = isReverseProcess ? -this.shiftValue : +this.shiftValue;
    this.resultValue = inputValue?.replace(/[A-Z]/g, (symbol) => {
      const charCode = symbol.charCodeAt(0);
      return String.fromCharCode(
        charCode + shiftValue <= 90
          ? charCode + shiftValue
          : ((charCode + shiftValue) % 90) + 64
      );
    });
  }

  transpositionCipher(inputValue: string) {
    this.resultValue =
      this.transpositionMode === 1
        ? inputValue
            .split(' ')
            .map((word) => word.split('').reverse().join(''))
            .join(' ')
        : inputValue.split('').reverse().join('');
  }

  toBinaryCipher(inputValue: string, isReverseProcess: boolean) {
    this.resultValue = isReverseProcess
      ? inputValue
          .split(' ')
          .map((code) => String.fromCharCode(parseInt(code, 2)))
          .join('')
      : inputValue
          .split('')
          .map((symbol) => symbol.charCodeAt(0).toString(2))
          .join(' ');
  }

  encrypt(inputValue: string, isReverseProcess = false) {
    switch (this.mode) {
      case 1:
        this.caesarCipher(inputValue, isReverseProcess);
        break;
      case 2:
        this.transpositionCipher(inputValue);
        break;
      case 3:
        this.toBinaryCipher(inputValue, isReverseProcess);
        break;
      case 4:
        if (!isReverseProcess) {
          this.caesarCipher(inputValue, isReverseProcess);
          setTimeout(() => {
            this.transpositionCipher(this.resultValue);
            setTimeout(() => {
              this.toBinaryCipher(this.resultValue, isReverseProcess);
            }, 1000);
          }, 1000);
        } else {
          this.toBinaryCipher(inputValue, isReverseProcess);
          setTimeout(() => {
            this.transpositionCipher(this.resultValue);
            setTimeout(() => {
              this.caesarCipher(this.resultValue, isReverseProcess);
            }, 1000);
          }, 1000);
        }
        break;
      default:
        break;
    }
  }

  copyToClipboard(value: string) {
    const pending = this.clipboard.beginCopy(value);
    let remainingAttempts = 3;
    const attempt = () => {
      const result = pending.copy();
      if (!result && --remainingAttempts) {
        setTimeout(attempt);
      } else {
        pending.destroy();
      }
    };
    attempt();
  }
}
