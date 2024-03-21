import {Pipe, PipeTransform} from '@angular/core';
import {DatePipe} from '@angular/common';
import * as moment from 'moment';

@Pipe({
  name: 'shortestDate'
})
export class ShortestDatePipe implements PipeTransform {

  constructor(private datePipe: DatePipe) {
  }

  transform(value: any, format?: string, ...args: unknown[]): unknown {
    if (!value) {
      return '';
    }
    const date = moment(value);
    if (format) {
      return date.format(format);
    }
    if (moment().isSame(date, 'day')) {
      return date.format('hh:mm a');
    }
    if (moment().isSameOrAfter(date) && (moment().diff(date, 'days') < 7)) {
      return date.format('dddd, hh:mm a');
    }
    if (moment().isSame(date, 'years')) {
      return date.format('MMM DD, hh:mm a');
    }
    return date.format('MMM DD, YYYY hh:mm a');
  }

}
