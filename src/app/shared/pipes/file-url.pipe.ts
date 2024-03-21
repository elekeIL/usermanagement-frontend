import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fileUrl'
})
export class FileUrlPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return '/api/files/'+value;
  }

}
