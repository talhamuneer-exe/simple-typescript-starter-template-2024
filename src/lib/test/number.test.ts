import { double, power } from '../number';

describe('number utilities', () => {
  describe('double', () => {
    it('should double a positive number', () => {
      // Act
      const result = double(2);

      // Assert
      expect(result).toBe(4);
    });

    it('should double a negative number', () => {
      // Act
      const result = double(-3);

      // Assert
      expect(result).toBe(-6);
    });

    it('should return zero when input is zero', () => {
      // Act
      const result = double(0);

      // Assert
      expect(result).toBe(0);
    });

    it('should handle decimal numbers', () => {
      // Act
      const result = double(2.5);

      // Assert
      expect(result).toBe(5);
    });
  });

  describe('power', () => {
    it('should calculate power correctly', () => {
      // Act
      const result = power(2, 4);

      // Assert
      expect(result).toBe(16);
    });

    it('should return 1 when exponent is 0', () => {
      // Act
      const result = power(5, 0);

      // Assert
      expect(result).toBe(1);
    });

    it('should handle negative base', () => {
      // Act
      const result = power(-2, 3);

      // Assert
      expect(result).toBe(-8);
    });

    it('should handle negative exponent', () => {
      // Act
      const result = power(2, -2);

      // Assert
      expect(result).toBe(0.25);
    });
  });
});

