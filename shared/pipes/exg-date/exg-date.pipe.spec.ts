import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ExgDatePipe } from './exg-date.pipe';

import { ExgTranslateService } from '../../services/common/exg-translate.service';

import { ExgCultureEnum } from '../../models/common/exg-culture.model';

@Component({
    selector: 'exg-test',
    template: `<p>{{ text | exgDate:'shortDate' }}</p>`
})
class TestComponent {
    text: string;
}

describe('ExgDatePipe (en) tests', () => {

    let comp: TestComponent;
    let fixture: ComponentFixture<TestComponent>;
    let element: HTMLElement;

    beforeEach(() => {

        const translateServiceStub = { getCurrentLang() { return ExgCultureEnum.English; } };

        TestBed.configureTestingModule({
            declarations: [TestComponent, ExgDatePipe],
            providers: [
                { provide: ExgTranslateService, useValue: translateServiceStub }
            ]
        });

        fixture = TestBed.createComponent(TestComponent);
        comp = fixture.componentInstance;
        element = fixture.debugElement.query(By.css('p')).nativeElement;
    });

    it('Should show long date in specified format', () => {
        comp.text = '2014-11-27T01:22:34';
        fixture.detectChanges();

        expect(element.textContent).toBe('11/27/14');
    });

    it('Should show short date in specified format', () => {
        comp.text = '2014-05-27';
        fixture.detectChanges();

        expect(element.textContent).toBe('5/27/14');
    });

    it('Should show epoch date in specified format', () => {
        comp.text = '1527170220';
        fixture.detectChanges();

        expect(element.textContent).toBe('5/24/18');
    });

    it('Should show date in non-ISO format as wrong (blank line)', () => {
        comp.text = '05/27/2014';
        fixture.detectChanges();

        expect(element.textContent).toBe('', 'non ISO format considered as wrong');
    });

    it('Should show empty value as blank line', () => {
        comp.text = '';
        fixture.detectChanges();

        expect(element.textContent).toBe('');
    });

    it('Should show wrong value as blank line', () => {
        comp.text = 'qwerty';
        fixture.detectChanges();

        expect(element.textContent).toBe('');
    });
});
