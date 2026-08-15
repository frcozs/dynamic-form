import { SchemaIconPipe } from './schema-icon.pipe';

describe('SchemaIconPipe', () => {
  const pipe = new SchemaIconPipe();

  it('should resolve the software icon path', () => {
    expect(pipe.transform('Software')).toBe(
      'M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z'
    );
  });

  it('should resolve the hardware icon path case-insensitively', () => {
    expect(pipe.transform('HARDWARE')).toBe(
      'M6 2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm2 3v2h8V5H8zm0 4v2h8V9H8zm0 4v2h8v-2H8z'
    );
  });

  it('should fall back to the generic icon for an unrecognized label', () => {
    // This is the regression case: under the old title-substring-matching logic,
    // anything that wasn't "software" silently rendered as "hardware". Now it
    // falls back to a neutral icon instead of a wrong one.
    expect(pipe.transform('Furniture')).toBe('M4 4h16v16H4V4zm2 2v12h12V6H6z');
  });
});
