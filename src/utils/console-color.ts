/* eslint-disable @typescript-eslint/no-explicit-any */
export const consoleColor = (color: string) => {
  const colors: Record<string, string> = {
    black: '\x1b[30m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    green: '\x1b[32m',
    white: '\x1b[37m',
    cyan: '\x1b[36m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
  };
  return colors[color] ? colors[color] : colors;
};

export const chunkArray = (arr: any, size: number) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
    arr.slice(i * size, i * size + size),
  );
