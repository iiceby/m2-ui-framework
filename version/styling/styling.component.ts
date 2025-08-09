import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';

@Component({
    templateUrl: './styling.component.html',
    styleUrls: ['./styling.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class StylingComponent {
    @HostBinding('class.black-theme') blackTheme: boolean;

    public changeTheme(darkTheme: boolean) {
        this.blackTheme = darkTheme;

        if (darkTheme) {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }
    }
}
