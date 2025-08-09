import { CompareUtils } from './compare-utils';

describe('CompareUtils tests', () => {

    it('Should correctly compare objects', () => {
        const obj1 = {
            prop1: 1,
            prop2: 'str',
            prop3: 'str2',
            prop4: 42,
            prop5: false,
            prop6: null,
            prop7: true,
            prop8: undefined,
            prop9: '',
            prop10: {
                p1: true,
                p2: 'qwerty',
                p3: null,
                p4: 123
            }
        };
        const obj2 = {
            prop2: 'str',
            prop1: 1,
            prop3: 'str2',
            prop4: 42,
            prop6: null,
            prop5: false,
            prop10: {
                p4: 123,
                p2: 'qwerty',
                p1: true,
                p3: null
            },
            prop7: true,
            prop8: undefined,
            prop9: ''
        };

        let isEqual = CompareUtils.isObjectsEqual(obj1, obj2, true);
        expect(isEqual).toBeTruthy('objects are equal strictly');

        obj2.prop6 = undefined;
        isEqual = CompareUtils.isObjectsEqual(obj1, obj2, true);
        expect(isEqual).toBeFalsy('objects are not equal strictly');

        obj2.prop6 = null;
        isEqual = CompareUtils.isObjectsEqual(obj1, obj2, true);
        expect(isEqual).toBeTruthy('objects are equal strictly');

        obj2.prop10.p4 = <any>'123';
        isEqual = CompareUtils.isObjectsEqual(obj1, obj2, true);
        expect(isEqual).toBeFalsy('objects are not equal strictly');

        isEqual = CompareUtils.isObjectsEqual(obj1, obj2, false);
        expect(isEqual).toBeTruthy('objects are equal not strictly');

        isEqual = CompareUtils.isObjectsEqual(obj1, obj2, false);
        expect(isEqual).toBeTruthy('objects are equal not strictly');

        obj2.prop1++;
        isEqual = CompareUtils.isObjectsEqual(obj1, obj2, false);
        expect(isEqual).toBeFalsy('objects are not equal not strictly');

        isEqual = CompareUtils.isObjectsEqual(null, undefined, false);
        expect(isEqual).toBeTruthy('objects are equal not strictly');

        isEqual = CompareUtils.isObjectsEqual(null, undefined, true);
        expect(isEqual).toBeFalsy('objects are not equal strictly');
    });
});
