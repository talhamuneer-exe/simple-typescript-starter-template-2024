import { asyncABC } from '../async';

describe('async utilities', () => {
  describe('asyncABC', () => {
    it('should return array of letters a, b, c', async () => {
      // Act
      const result = await asyncABC();

      // Assert
      expect(result).toEqual(['a', 'b', 'c']);
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(3);
    });

    it('should return correct order', async () => {
      // Act
      const result = await asyncABC();

      // Assert
      expect(result[0]).toBe('a');
      expect(result[1]).toBe('b');
      expect(result[2]).toBe('c');
    });
  });
});

