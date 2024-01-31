const SEMICOLON_SEPARATOR = ';';
const COMMA_SEPARATOR = ',';

type Separator = ';' | ',';

export const selectSeparator = (): Separator => {
  const separator =
    !!process.env?.CSV_SEPARATOR && process.env?.CSV_SEPARATOR === 'semicolon'
      ? SEMICOLON_SEPARATOR
      : COMMA_SEPARATOR;

  return separator;
};
