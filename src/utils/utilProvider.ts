export const utilProvider = {
  replaceDoubleQouteToSingle(input: string): string {
     
    const result = input.replace(/"/g, "'");
    return result;
  },
};
