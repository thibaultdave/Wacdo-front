import { Component, signal } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth-service';
import { LoginRequest } from '../../models/login-request';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {

  public loginForm: FormGroup;
  public errorMessage = signal('');

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });
  }

  onLogin() {

    if (this.loginForm.valid) {

      const loginRequest: LoginRequest = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
      };

      this.authService.login(loginRequest)
        .subscribe({
          next: (response) => {
            console.log('Login successful:', response);

            localStorage.setItem('token', response.token);

            this.router.navigate(['/home']);
          },

          error: (error) => {
            console.error('Login failed:', error);
            this.errorMessage.set('Email ou mot de passe incorrect.');
          }
        });

    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}