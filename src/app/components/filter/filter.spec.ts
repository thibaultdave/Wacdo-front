import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Filter } from './filter';

describe('Filter', () => {
  let component: Filter;
  let fixture: ComponentFixture<Filter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Filter],
    }).compileComponents();

    fixture = TestBed.createComponent(Filter);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('label', 'Nom');
    fixture.componentRef.setInput('inputId', 'name-filter');
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // INPUT

  describe('Ouptut', () => {

    it('should have default input values', () => {
      expect(component.placeholder()).toBe('');
      expect(component.value()).toBe('');
      expect(component.inputType()).toBe('text');
    });

    it('should receive input values', () => {
      fixture.componentRef.setInput('label', 'Email');
      fixture.componentRef.setInput('placeholder', 'Entrez votre email');
      fixture.componentRef.setInput('value', 'test@test.fr');
      fixture.componentRef.setInput('inputType', 'email');
      fixture.componentRef.setInput('inputId', 'email-filter');

      fixture.detectChanges();

      expect(component.label()).toBe('Email');
      expect(component.placeholder()).toBe('Entrez votre email');
      expect(component.value()).toBe('test@test.fr');
      expect(component.inputType()).toBe('email');
      expect(component.inputId()).toBe('email-filter');
    });

    it('should display the label and input correctly', () => {
      const label = fixture.nativeElement.querySelector('label');
      const input = fixture.nativeElement.querySelector('input');

      expect(label.textContent.trim()).toBe('Nom');
      expect(label.getAttribute('for')).toBe('name-filter');

      expect(input.id).toBe('name-filter');
      expect(input.type).toBe('text');
    });
  });

  // OUTPUT

  describe('Ouptut', () => {

    it('should emit valueChange', () => {
      const valueChangeSpy = vi.fn();

      component.valueChange.subscribe(valueChangeSpy);

      component.valueChange.emit('Jean');

      expect(valueChangeSpy).toHaveBeenCalledWith('Jean');
    });

    it('should emit valueChange when typing in the input', () => {
      const valueChangeSpy = vi.fn();

      component.valueChange.subscribe(valueChangeSpy);

      const input = fixture.nativeElement.querySelector('input');

      input.value = 'Jean';
      input.dispatchEvent(new Event('input'));

      expect(valueChangeSpy).toHaveBeenCalledWith('Jean');
    });
  });

  // CLEAR BUTTON

  describe('Ouptut', () => {

    it('should not display clear button when value is empty', () => {
      const button = fixture.nativeElement.querySelector('.clear-filter');

      expect(button).toBeNull();
    });

    it('should emit an empty value when clicking the clear button', () => {
      fixture.componentRef.setInput('value', 'Jean');
      fixture.detectChanges();

      const valueChangeSpy = vi.fn();
      component.valueChange.subscribe(valueChangeSpy);

      const button = fixture.nativeElement.querySelector('.clear-filter');

      expect(button).not.toBeNull();

      button.click();

      expect(valueChangeSpy).toHaveBeenCalledWith('');
    });
  });
});