import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'abbreviateNumber'
})
export class AbbreviateNumberPipe implements PipeTransform {

  transform(value: number, fixed: number): unknown {
    return this.abbreviateNumber(value,fixed);

  }


  abbreviateNumber(value: number, fixed: number): string {

    if (value == null) {
      return null;
    } // terminate early
    if (value === 0) {
      return '0';
    } // terminate early
    fixed = (!fixed || fixed < 0) ? 0 : fixed; // number of decimal places to show
    const powerToRaise = (value).toPrecision(2).split("e"), //get power
    floorOrCeiling = powerToRaise.length === 1 ? 0 : Math.floor(Math.min(Number(powerToRaise[1].slice(1)), 14) / 3), // floor at decimals, ceiling at trillions
    dividedByPower = floorOrCeiling < 1 ? value.toExponential(0 + fixed) : (value / Math.pow(10, floorOrCeiling * 3)).toFixed(1 + fixed), //divide by power
    result = Number(dividedByPower) < 0 ? dividedByPower : Math.abs(Number(dividedByPower)); //enforce -0 is 0

    return result + ['', 'K', 'M', 'B', 'T'][floorOrCeiling];  //append power & return
  }

}
