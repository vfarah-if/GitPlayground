import { ShoutPipe } from './shout.pipe';

describe('ShoutPipe', () => {
  let pipe: ShoutPipe;
  beforeEach(() => {
    pipe = new ShoutPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should uppercase and add exclamation mark to string', () => {
    const actual = pipe.transform('Test');
    expect(actual).toBe('TEST!');
  });

  it('should not fail when undefined or null is passed and return empty', () => {
    const actual = pipe.transform(undefined);
    expect(actual).toBe('');
  });
});
