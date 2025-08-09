import { animate, style, transition, trigger } from '@angular/animations';

export const enterAnimation = [
    trigger(
        'menuAnimation', [
            transition(':enter', [
                style({ opacity: 0 }),
                animate('300ms cubic-bezier(.2,.9,.3,1.3)', style({ opacity: 1 }))
            ]),
            transition(':leave', [
                style({ opacity: 1 }),
                animate('300ms cubic-bezier(.2,.9,.3,1.3)', style({ opacity: 0 }))
            ])
        ]
    )
];
