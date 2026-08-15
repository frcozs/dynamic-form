import { FormControl } from '@angular/forms';

import { requiredNotBlankValidator } from './required-not-blank.validator';

describe('requiredNotBlankValidator', () => {
  const validator = requiredNotBlankValidator();

  it('should reject an empty string', () => {
    const control = new FormControl('');
    expect(validator(control)).toEqual({ required: true });
  });

  it('should reject a whitespace-only string', () => {
    const control = new FormControl('   ');
    expect(validator(control)).toEqual({ required: true });
  });

  it('should accept a non-blank string', () => {
    const control = new FormControl('hello');
    expect(validator(control)).toBeNull();
  });

  it('should accept a string with leading/trailing spaces around real content', () => {
    const control = new FormControl('  hello  ');
    expect(validator(control)).toBeNull();
  });

  it('should not interfere with non-string values', () => {
    const control = new FormControl(null);
    expect(validator(control)).toBeNull();
  });
});
