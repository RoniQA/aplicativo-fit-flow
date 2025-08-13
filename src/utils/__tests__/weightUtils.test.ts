import { 
  calculateBMI, 
  getWeightCategory, 
  getBMIDescription, 
  getWeightTheme 
} from '../weightUtils';

describe('weightUtils', () => {
  describe('calculateBMI', () => {
    it('should calculate BMI correctly for normal values', () => {
      expect(calculateBMI(70, 170)).toBeCloseTo(24.22, 2);
      expect(calculateBMI(80, 180)).toBeCloseTo(24.69, 2);
      expect(calculateBMI(60, 165)).toBeCloseTo(22.04, 2);
    });

    it('should handle edge cases', () => {
      expect(calculateBMI(0, 170)).toBe(0);
      expect(calculateBMI(70, 0)).toBe(Infinity);
      expect(calculateBMI(0, 0)).toBe(NaN);
    });

    it('should calculate BMI for extreme values', () => {
      expect(calculateBMI(120, 150)).toBeCloseTo(53.33, 2);
      expect(calculateBMI(40, 180)).toBeCloseTo(12.35, 2);
    });
  });

  describe('getWeightCategory', () => {
    it('should return underweight category for BMI < 18.5', () => {
      const category = getWeightCategory(50, 170);
      expect(category.label).toBe('Abaixo do Peso');
      expect(category.bgColor).toBe('bg-purple-50');
      expect(category.borderColor).toBe('border-purple-200');
      expect(category.color).toBe('text-purple-600');
    });

    it('should return ideal weight category for BMI 18.5-24.9', () => {
      const category = getWeightCategory(70, 170);
      expect(category.label).toBe('Peso Ideal');
      expect(category.bgColor).toBe('bg-green-50');
      expect(category.borderColor).toBe('border-green-200');
      expect(category.color).toBe('text-green-600');
    });

    it('should return overweight category for BMI 25-29.9', () => {
      const category = getWeightCategory(85, 170);
      expect(category.label).toBe('Acima do Peso');
      expect(category.bgColor).toBe('bg-orange-50');
      expect(category.borderColor).toBe('border-orange-200');
      expect(category.color).toBe('text-orange-600');
    });

    it('should return obese category for BMI >= 30', () => {
      const category = getWeightCategory(120, 170);
      expect(category.label).toBe('Sobrepeso');
      expect(category.bgColor).toBe('bg-red-50');
      expect(category.borderColor).toBe('border-red-200');
      expect(category.color).toBe('text-red-600');
    });

    it('should handle boundary values correctly', () => {
      // BMI = 18.5 (boundary)
      const category1 = getWeightCategory(53.4, 170);
      expect(category1.label).toBe('Abaixo do Peso');

      // BMI = 25 (boundary)
      const category2 = getWeightCategory(72.25, 170);
      expect(category2.label).toBe('Acima do Peso');

      // BMI = 30 (boundary)
      const category3 = getWeightCategory(86.7, 170);
      expect(category3.label).toBe('Sobrepeso');
    });
  });

  describe('getBMIDescription', () => {
    it('should return appropriate description for underweight', () => {
      const description = getBMIDescription(17);
      expect(description).toContain('abaixo do peso');
      expect(description).toContain('nutricionista');
    });

    it('should return appropriate description for ideal weight', () => {
      const description = getBMIDescription(22);
      expect(description).toContain('saudável');
      expect(description).toContain('háb');
    });

    it('should return appropriate description for overweight', () => {
      const description = getBMIDescription(27);
      expect(description).toContain('acima do peso');
      expect(description).toContain('exercícios regulares');
    });

    it('should return appropriate description for obese', () => {
      const description = getBMIDescription(32);
      expect(description).toContain('sobrepeso');
      expect(description).toContain('profissional de saúde');
    });
  });

  describe('getWeightTheme', () => {
    it('should return purple theme for underweight', () => {
      const theme = getWeightTheme(50, 170);
      expect(theme.gradient).toBe('from-purple-500 to-purple-700');
      expect(theme.cardBg).toBe('bg-purple-50');
      expect(theme.cardBorder).toBe('border-purple-200');
      expect(theme.primary[500]).toBe('#a855f7');
      expect(theme.accent[500]).toBe('#d946ef');
    });

    it('should return green theme for ideal weight', () => {
      const theme = getWeightTheme(70, 170);
      expect(theme.gradient).toBe('from-green-500 to-green-700');
      expect(theme.cardBg).toBe('bg-green-50');
      expect(theme.cardBorder).toBe('border-green-200');
      expect(theme.primary[500]).toBe('#22c55e');
      expect(theme.accent[500]).toBe('#f97316');
    });

    it('should return orange theme for overweight', () => {
      const theme = getWeightTheme(85, 170);
      expect(theme.gradient).toBe('from-orange-500 to-orange-700');
      expect(theme.cardBg).toBe('bg-orange-50');
      expect(theme.cardBorder).toBe('border-orange-200');
      expect(theme.primary[500]).toBe('#f97316');
      expect(theme.accent[500]).toBe('#ef4444');
    });

    it('should return red theme for obese', () => {
      const theme = getWeightTheme(120, 170);
      expect(theme.gradient).toBe('from-red-500 to-red-700');
      expect(theme.cardBg).toBe('bg-red-50');
      expect(theme.cardBorder).toBe('border-red-200');
      expect(theme.primary[500]).toBe('#ef4444');
      expect(theme.accent[500]).toBe('#ec4899');
    });

    it('should have complete color palette for all themes', () => {
      const theme = getWeightTheme(70, 170);
      
      // Check primary colors
      expect(theme.primary).toHaveProperty('50');
      expect(theme.primary).toHaveProperty('100');
      expect(theme.primary).toHaveProperty('200');
      expect(theme.primary).toHaveProperty('300');
      expect(theme.primary).toHaveProperty('400');
      expect(theme.primary).toHaveProperty('500');
      expect(theme.primary).toHaveProperty('600');
      expect(theme.primary).toHaveProperty('700');
      expect(theme.primary).toHaveProperty('800');
      expect(theme.primary).toHaveProperty('900');

      // Check accent colors
      expect(theme.accent).toHaveProperty('50');
      expect(theme.accent).toHaveProperty('100');
      expect(theme.accent).toHaveProperty('200');
      expect(theme.accent).toHaveProperty('300');
      expect(theme.accent).toHaveProperty('400');
      expect(theme.accent).toHaveProperty('500');
      expect(theme.accent).toHaveProperty('600');
      expect(theme.accent).toHaveProperty('700');
      expect(theme.accent).toHaveProperty('800');
      expect(theme.accent).toHaveProperty('900');
    });
  });
});
