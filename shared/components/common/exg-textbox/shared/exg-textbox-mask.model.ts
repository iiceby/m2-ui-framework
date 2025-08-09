import * as imask from 'imask';

export class InputMask {
    public type: 'confirmationCode' | 'number' | 'percent' | 'phone' | 'udid' | 'smscode' | 'hashtag' | 'letters' | 'letters-spaces';
    public scale?: number;
    public allowNegative?: boolean;
    public min?: number;
    public max?: number;
    public thousandsSeparator?: string;
    public radixChar?: string;
    public mapToRadix?: string[];
}

export abstract class ExgInputMask {
    public abstract get maskOptions(): any;

    public static createInputMask(inputMask: InputMask): ExgInputMask {
        if (!inputMask) {
            //@ts-ignore
            return null;
        }
        switch (inputMask.type) {
            case 'confirmationCode':
                return new ConfirmationCodeMask();
            case 'number':
                return new NumberMask(inputMask.scale, inputMask.allowNegative, inputMask.min, inputMask.max, inputMask.thousandsSeparator, inputMask.radixChar);
            case 'percent':
                //@ts-ignore
                return new PercentMask(inputMask.radixChar);
            case 'phone':
                return new PhoneMask();
            case 'smscode':
                return new SmscodeMask();
            case 'udid':
                return new UdidMask();
            case 'letters':
                return new LettersMask();
            case 'letters-spaces':
                return new LettersSpacesMask();
            case 'hashtag':
                return new HashTagMask();
        }
        //@ts-ignore
        return null;
    }
}

export class ConfirmationCodeMask extends ExgInputMask {
    public get maskOptions() {
        return {
            mask: '0 0 0 – 0 0 0'
        };
    }
}

export class NumberMask extends ExgInputMask {
    public get maskOptions() {
        return {
            mask: Number,
            scale: this.scale,
            signed: this.allowNegative,
            thousandsSeparator: this.thousandsSeparator,
            padFractionalZeros: false,
            normalizeZeros: true,
            min: this.min,
            max: this.max,
            radix: this.radixChar,
            mapToRadix: ['.', ','],
            lazy: true
        };
    }

    constructor(private scale?: number, private allowNegative?: boolean, private min?: number, private max?: number, private thousandsSeparator?: string, private radixChar?: string) {
        super();
        this.thousandsSeparator = thousandsSeparator === null || thousandsSeparator === undefined ? ' ' : thousandsSeparator;
        this.radixChar = radixChar || ',';
    }
}

export class PercentMask extends ExgInputMask {
    private mask = '`XX %';

    private blocks = {
        XX: {
            mask: Number,
            scale: 0,
            signed: false,
            min: 0,
            max: 100,
            radix: this.radixChar,
            mapToRadix: ['.', ',']
        }
    };

    public get maskOptions() {
        return {
            mask: this.mask,
            blocks: this.blocks,
            lazy: false
        };
    }

    constructor(private radixChar: string) {
        super();
        this.radixChar = radixChar || ',';
    }
}

export class PhoneMask extends ExgInputMask {
    public get maskOptions() {
        return {
            mask: (val: string) => !/[^0-9\,\-\(\) ]+/g.test(val),
            lazy: true
        };
    }
}

export class SmscodeMask extends ExgInputMask {
    public get maskOptions() {
        return {
            mask: '0000',
            lazy: true
        };
    }
}

export class UdidMask extends ExgInputMask {
    private mask = '`XX{:}XX{:}XX{:}XX{:}XX{:}XX';

    private blocks = {
        X: {
            mask: (<any>imask).MaskedEnum,
            enum: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'],
            //@ts-ignore
            prepare: str => str.toUpperCase()
        }
    };

    public get maskOptions() {
        return {
            mask: this.mask,
            blocks: this.blocks,
            lazy: false
        };
    }
}

export class HashTagMask extends ExgInputMask {
    public get maskOptions() {
        return {
            mask: (val: string) => !(/[^A-Za-zа-яёА-ЯЁ0-9]+/g.test(val)),
            lazy: true
        };
    }
}

export class LettersMask extends ExgInputMask {
    public get maskOptions() {
        return {
            mask: (val: string) => !(/[^A-Za-zа-яёА-ЯЁ0-9\.\-]+/g.test(val)),
            lazy: true
        };
    }
}

export class LettersSpacesMask extends ExgInputMask {
    public get maskOptions() {
        return {
            mask: (val: string) => !(/[^A-Za-zа-яёА-ЯЁ0-9\.\- ]+/g.test(val)),
            lazy: true
        };
    }
}
