import { Component, inject } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { User } from '@supabase/supabase-js';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm!: FormGroup<{
    email: FormControl<string>;
  }>;

  message: string = '';

  private fb = inject(FormBuilder)
  private auth = inject(AuthService)
  private router = inject(Router)

  constructor() {


    this.auth.currentUser$.subscribe((user: User | boolean) => {
      if (user) {
        this.router.navigateByUrl('/projects', { replaceUrl: true });
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
    });
  }

  onSubmit(): void {

    const { email } = this.loginForm.value

    if (email) {
      this.auth.signIn(email)
        .then(res => {

          if (!res.error) {
            this.message = 'Check your emails'
          } else {
            alert(res.error.message)
          }
        })
        .catch((err) => {
          console.error(err)
        })
    }
  }

  closeAlert(): void {
    this.message = ''
  }
}
