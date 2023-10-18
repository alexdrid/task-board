import { Component, inject } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm!: FormGroup<{
    email: FormControl<string>;
    password: FormControl<string>,
    confirmPassword: FormControl<string>
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

    this.registerForm = this.fb.group({
      email: this.fb.nonNullable.control('', [
        Validators.required,
        Validators.minLength(5),
        Validators.pattern(
          /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        ),
      ]),
      password: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(7)]),
      confirmPassword: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(7)]),
    });
  }

  onSubmit() {

  }
}
