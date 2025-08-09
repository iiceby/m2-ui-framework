import { animate, style, transition, trigger } from '@angular/animations';

export const formErrorAnimation = [
    trigger(
        'formErrorAnimation', [
            transition(':enter', [style({ opacity: 0, height: 0 }), animate('300ms', style({ opacity: 1, height: '*' }))]),
            transition(':leave', [style({ opacity: 1, height: '*' }), animate('300ms', style({ opacity: 0, height: 0 }))])
        ])
];
