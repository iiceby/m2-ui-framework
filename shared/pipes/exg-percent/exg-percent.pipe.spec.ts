import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ExgPercentPipe } from './exg-percent.pipe';

import { ExgTranslateService } from '../../services/common/exg-translate.service';

import { ExgCultureEnum } from '../../models/common/exg-culture.model';

@Component({
    selector: 'exg-test',
    template: `<p>{{ text | exgPercent }}</p>`
})
class TestComponent {
    text: any;
}

describe('ExgPercentPipe tests', () => {

    let comp: TestComponent;
    let fixture: ComponentFixture<TestComponent>;
    let element: HTMLElement;

    beforeEach(() => {

        const translateServiceStub = { getCurrentLang() { return ExgCultureEnum.English; } };

        TestBed.configureTestingModule({
            declarations: [TestComponent, ExgPercentPipe],
            providers: [
                { provide: ExgTranslateService, useValue: translateServiceStub }
            ]
        });

        fixture = TestBed.createComponent(TestComponent);
        comp = fixture.componentInstance;
        element = fixture.debugElement.query(By.css('p')).nativeElement;
    });

    it('Should show percents in en format', () => {
        comp.text = '29.34756';
        fixture.detectChanges();

        expect(element.textContent).toMatch(/29\.35\s?%/);
    });

    it('Should show empty value as blank line', () => {
        comp.text = '';
        fixture.detectChanges();

        expect(element.textContent).toBe('');
    });

    it('Should show zero value as zero', () => {
        comp.text = '0';
        fixture.detectChanges();
        expect(element.textContent).toMatch(/0\.00\s?%/, 'string "0" should be shown as 0.00%');

        comp.text = 0;
        fixture.detectChanges();
        expect(element.textContent).toMatch(/0\.00\s?%/, 'number (0) should be shown as 0.00%');
    });

    it('Should show wrong value as blank line', () => {
        comp.text = 'qwerty';
        fixture.detectChanges();

        expect(element.textContent).toBe('');
    });
});
