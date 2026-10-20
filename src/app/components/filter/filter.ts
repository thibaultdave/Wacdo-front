import { Component, input, output } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-filter',
  styleUrl: './filter.css',
  templateUrl: './filter.html',
})
export class Filter {
  label = input.required<string>();
  placeholder = input('');
  value = input('');
  inputType = input<'text' | 'email'>('text');
  inputId = input.required<string>();

  valueChange = output<string>();
}