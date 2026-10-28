import { Component, Input  } from '@angular/core';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-form-field',
  styleUrl: './form-field.css',
  templateUrl: './form-field.html',
})
export class FormField {
  @Input({ required: true }) id!: string;
  @Input({ required: true }) label!: string;
  @Input({ required: true }) control!: AbstractControl;

  @Input() type = 'text';
  @Input() placeholder = '';
  @Input() isRequired = true;
  @Input() moreInfo = '';

  @Input() errors: { key: string ; message: string }[] = [];
}