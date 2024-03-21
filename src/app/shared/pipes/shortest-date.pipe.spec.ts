import {ShortestDatePipe} from './shortest-date.pipe';

describe('ShortestDatePipe', () => {
  it('create an instance', () => {
    const pipe = new ShortestDatePipe();
    expect(pipe).toBeTruthy();
  });
});
