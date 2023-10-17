import { Component, inject } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm!: FormGroup<{
    email: FormControl<string>;
    password: FormControl<string>
  }>;

  errorMsg = '';

  private fb = inject(FormBuilder)
  private auth = inject(AuthService)
  private router = inject(Router)

  constructor() {


    this.auth.currentUser$.subscribe((user) => {
      if (!user) {
        this.router.navigateByUrl('/dashboard', { replaceUrl: true });
      }
    });

    this.loginForm = this.fb.group({
      email: this.fb.nonNullable.control('', [
        Validators.required,
        Validators.minLength(5),
        Validators.pattern(
          /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        ),
      ]),
      password: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(7)]),
    });
  }

  onSubmit(): void {

    const { email, password } = this.loginForm.value

    if (email && password) {
      this.auth.signIn(email, password)
        .then(res => {

          const { data, error } = res
          if (error) {
            this.errorMsg = error.message
          }

          if (data.user?.role === 'authenticated') {
            this.router.navigate(['/dashboard']);
          }
        })
        .catch((err) => {
          console.error(err)
        })
    }
  }

  closeAlert(): void {
    this.errorMsg = ''
  }
}
