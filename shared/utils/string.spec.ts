import { String } from './string';

describe('String tests', () => {

    it('Should correctly format string', () => {
        expect(String.empty).toBe('');
        expect(String.format('Formatted {0} string {1}', 'arg1', 'arg2')).toBe('Formatted arg1 string arg2');
    });
});
