// __tests__/conversion.test.js
const { convertUnits } = require('../index'); // Adjust path if necessary

describe('Unit Conversion', () => {
    test('Convert meters to kilometers', () => {
        expect(convertUnits(1000, 'm', 'km')).toBe(1);
    });

    test('Convert kilometers to meters', () => {
        expect(convertUnits(1, 'km', 'm')).toBe(1000);
    });

    test('Convert grams to kilograms', () => {
        expect(convertUnits(1000, 'g', 'kg')).toBe(1);
    });

    test('Convert Celsius to Fahrenheit', () => {
        expect(convertUnits(0, 'C', 'F')).toBe(32);
    });

    test('Convert Fahrenheit to Celsius', () => {
        expect(convertUnits(32, 'F', 'C')).toBe(0);
    });

    test('Convert invalid units', () => {
        expect(convertUnits(100, 'abc', 'xyz')).toBe(null);
    });
});


module.exports = { convertUnits };
