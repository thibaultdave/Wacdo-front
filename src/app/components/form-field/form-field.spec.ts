import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormField } from './form-field';
import { FormControl, Validators } from '@angular/forms';

describe('FormField', () => {
  let component: FormField;
  let fixture: ComponentFixture<FormField>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormField],
    }).compileComponents();

    fixture = TestBed.createComponent(FormField);
    component = fixture.componentInstance;
    
    fixture.componentRef.setInput('id', 'test-field');
    fixture.componentRef.setInput('label', 'Nom');
    fixture.componentRef.setInput('control', new FormControl(''));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // default
  it('should have default values', () => {
    expect(component.options).toEqual([]);
    expect(component.type).toBe('text');
    expect(component.placeholder).toBe('');
    expect(component.isRequired).toBe(true);
    expect(component.moreInfo).toBe('');
    expect(component.errors).toEqual([]);
  });

  // TEMPLATE DISPLAY

  describe('template display', () => {

    it('should display the label and input correctly', () => {
      const label = fixture.nativeElement.querySelector('label');
      const input = fixture.nativeElement.querySelector('input');

      expect(label.textContent).toContain('Nom');
      expect(label.getAttribute('for')).toBe('test-field');

      expect(input).not.toBeNull();
      expect(input.id).toBe('test-field');
      expect(input.type).toBe('text');
    });

    // placeholder
    it('should display the placeholder', () => {
      fixture.componentRef.setInput('placeholder', 'Saisir un nom');
      fixture.detectChanges();

      const input = fixture.nativeElement.querySelector('input');

      expect(input.placeholder).toBe('Saisir un nom');
    });

    // Required indicator
    it('should display the asterisk by default', () => {
      const requiredIndicator = fixture.nativeElement.querySelector('label span');

      expect(requiredIndicator).not.toBeNull();
    });

    it('should not display the asterisk when isRequired is false', () => {
      fixture.componentRef.setInput('isRequired', false);
      fixture.detectChanges();

      const requiredIndicator = fixture.nativeElement.querySelector('label span');

      expect(requiredIndicator).toBeNull();
    });

    // More info

    it('should display more information when provided', () => {
      fixture.componentRef.setInput('moreInfo', 'Format JJ/MM/AAAA');
      fixture.detectChanges();

      const info = fixture.nativeElement.querySelector('.info');

      expect(info).not.toBeNull();
      expect(info.textContent).toContain('Format JJ/MM/AAAA');
    });

    it('should not display more information when empty', () => {
      const info = fixture.nativeElement.querySelector('.info');

      expect(info).toBeNull();
    });
  });

  // SELECT

  describe('Select', () => {

    it('should display a select when type is select', () => {
      fixture.componentRef.setInput('type', 'select');
      fixture.componentRef.setInput('placeholder', 'Choisir un poste');
      fixture.componentRef.setInput('options', [
        { label: 'Manager', value: 1 },
        { label: 'Équipier', value: 2 },
      ]);

      fixture.detectChanges();

      const select = fixture.nativeElement.querySelector('select');
      const input = fixture.nativeElement.querySelector('input');

      expect(select).not.toBeNull();
      expect(input).toBeNull();

      expect(select.id).toBe('test-field');
      expect(select.options.length).toBe(3);
      expect(select.options[0].textContent.trim()).toBe('Choisir un poste');
      expect(select.options[1].textContent.trim()).toBe('Manager');
      expect(select.options[2].textContent.trim()).toBe('Équipier');
    });

    it('should update the control value when selecting an option', () => {
      fixture.componentRef.setInput('type', 'select');
      fixture.componentRef.setInput('options', [
        { label: 'Manager', value: 1 },
        { label: 'Équipier', value: 2 },
      ]);

      fixture.detectChanges();

      const select = fixture.nativeElement.querySelector('select');

      select.value = select.options[1].value;
      select.dispatchEvent(new Event('change'));

      expect(component.control.value).toBe(1);
    });
  });

  describe('Errors', () => {

    it('should not display errors when control is untouched and pristine', () => {
      const control = new FormControl('', Validators.required);

      fixture.componentRef.setInput('control', control);
      fixture.componentRef.setInput('errors', [
        { key: 'required', message: 'Ce champ est obligatoire' },
      ]);

      fixture.detectChanges();

      const errors = fixture.nativeElement.querySelectorAll('.error');

      expect(errors.length).toBe(0);
    });

    it('should display validation errors when control is touched', () => {
      const control = new FormControl('', Validators.required);

      fixture.componentRef.setInput('control', control);
      fixture.componentRef.setInput('errors', [
        { key: 'required', message: 'Ce champ est obligatoire' },
      ]);

      component.control.markAsTouched();
      fixture.detectChanges();

      const error = fixture.nativeElement.querySelector('.error');

      expect(error).not.toBeNull();
      expect(error.textContent).toContain('Ce champ est obligatoire');
    });

    it('should not display an error when the control has no matching error', () => {
      component.control = new FormControl('Jean', Validators.required);
      component.errors = [
        { key: 'required', message: 'Ce champ est obligatoire' },
      ];

      component.control.markAsTouched();
      fixture.detectChanges();

      const error = fixture.nativeElement.querySelector('.error');

      expect(error).toBeNull();
    });
  });
});