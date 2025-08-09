import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ExgCurrencyPipe } from './exg-currency.pipe';

import { ExgTranslateService } from '../../services/common/exg-translate.service';

import { ExgCultureEnum } from '../../models/common/exg-culture.model';

@Component({
    selector: 'exg-test',
    template: `
<p class="c1">{{ text | exgCurrency:'EUR':'code' }}</p>
<p class="c2">{{ text | exgCurrency:'USD' }}</p>`
})
class TestComponent {
    text: any;
}

describe('ExgCurrencyPipe tests', () => {

    let comp: TestComponent;
    let fixture: ComponentFixture<TestComponent>;
    let debugElement: DebugElement;

    beforeEach(() => {

        const translateServiceStub = { getCurrentLang() { return ExgCultureEnum.English; } };

        TestBed.configureTestingModule({
            declarations: [TestComponent, ExgCurrencyPipe],
            providers: [
                { provide: ExgTranslateService, useValue: translateServiceStub }
            ]
        });

        fixture = TestBed.createComponent(TestComponent);
        comp = fixture.componentInstance;
        debugElement = fixture.debugElement;
    });

    it('Should show currency in specified format', () => {
        comp.text = '5.123456';
        fixture.detectChanges();

        const element1 = debugElement.query(By.css('.c1')).nativeElement;
        expect(element1.textContent).toMatch(/EUR\s?5\.12/);

        const element2 = debugElement.query(By.css('.c2')).nativeElement;
        expect(element2.textContent).toBe('$5.12');
    });

    it('Should show empty value as blank line', () => {
        comp.text = '';
        fixture.detectChanges();

        const element1 = debugElement.query(By.css('.c1')).nativeElement;
        expect(element1.textContent).toBe('');

        const element2 = debugElement.query(By.css('.c2')).nativeElement;
        expect(element2.textContent).toBe('');
    });

    it('Should show zero string value as zero', () => {
        comp.text = '0';
        fixture.detectChanges();

        const element1 = debugElement.query(By.css('.c1')).nativeElement;
        expect(element1.textContent).toMatch(/EUR\s?0\.00/, 'string "0" should not be shown as blank line');

        const element2 = debugElement.query(By.css('.c2')).nativeElement;
        expect(element2.textContent).toBe('$0.00', 'string "0" should not be shown as blank line');
    });

    it('Should show zero number value as zero', () => {
        comp.text = 0;
        fixture.detectChanges();

        const element1 = debugElement.query(By.css('.c1')).nativeElement;
        expect(element1.textContent).toMatch(/EUR\s?0\.00/, 'number (0) should not be shown as blank line');

        const element2 = debugElement.query(By.css('.c2')).nativeElement;
        expect(element2.textContent).toBe('$0.00', 'number (0) should not be shown as blank line');
    });

    it('Should show wrong value as blank line', () => {
        comp.text = 'qwerty';
        fixture.detectChanges();

        const element1 = debugElement.query(By.css('.c1')).nativeElement;
        expect(element1.textContent).toBe('');

        const element2 = debugElement.query(By.css('.c2')).nativeElement;
        expect(element2.textContent).toBe('');
    });
});
