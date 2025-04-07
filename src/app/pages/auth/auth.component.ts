import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { AuthResponse } from 'src/app/models/auth.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class AuthComponent implements OnInit, OnDestroy {
  isShowPassword = false;
  isSignIn = true;
  passwordErrorMsg: string;
  formTitleTxt = 'Sign In';

  authFormGroup: FormGroup;
  formSubscription$ = new Subscription();

  constructor(
    readonly fb: FormBuilder,
    readonly authService: AuthService,
    readonly router: Router
  ) {
    this.authFormGroup = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
    this.passwordErrorMsg = 'Password is required';
  }

  ngOnInit(): void {
    this.formSubscription$ = this.f['password'].valueChanges.subscribe(
      (value) => {
        if (
          !this.isSignIn &&
          value &&
          (!this.containsNameOrEmail ||
            !this.hasMinLength ||
            !this.hasNumberOrSymbol)
        ) {
          this.passwordErrorMsg = 'Password strength: Weak';
          this.f['password'].setErrors({ incorrect: true });
        } else {
          this.passwordErrorMsg = 'Password is required';
        }
      }
    );
  }

  get f(): { [key: string]: AbstractControl<any, any> } {
    return this.authFormGroup.controls;
  }

  get containsNameOrEmail(): boolean {
    const lowerPassword = this.f['password'].value?.toLowerCase();
    return (
      !lowerPassword?.includes(this.f['username'].value?.toLowerCase()) &&
      this.f['password'].value?.length > 0
    );
  }

  get hasMinLength(): boolean {
    return this.f['password'].value?.length >= 8;
  }

  get hasNumberOrSymbol(): boolean {
    return /[\d!@#$%^&*(),.?":{}|<>]/.test(this.f['password']?.value);
  }

  get isPasswordStrong(): boolean {
    return (
      this.containsNameOrEmail && this.hasMinLength && this.hasNumberOrSymbol
    );
  }

  toggleShowPassword(event: MouseEvent): void {
    this.isShowPassword = !this.isShowPassword;
    event.stopPropagation();
  }

  handleSignUp(): void {
    this.isSignIn = !this.isSignIn;
    if (!this.isSignIn) {
      this.formTitleTxt = 'Create an account';
    } else {
      this.formTitleTxt = 'Sign in';
    }
    this.resetForm();
  }

  resetForm(): void {
    this.authFormGroup.reset();
    this.f['username'].setErrors(null);
    this.f['password'].setErrors(null);
    this.authFormGroup.markAsPristine();
    this.authFormGroup.markAsUntouched();
    this.authFormGroup.updateValueAndValidity();
  }

  onSubmit(): void {
    if (
      !this.authFormGroup.invalid &&
      this.f['username'].value &&
      this.f['password'].value
    ) {
      if (this.isSignIn) {
        this.handleSignIn();
      } else {
        this.handleCreateAccount();
      }
    } else {
      if (!this.f['username'].value) {
        this.f['username'].setErrors({ required: true });
      }
      if (!this.f['password'].value) {
        this.f['password'].setErrors({ required: true });
      }
      this.authFormGroup.markAllAsTouched();
      this.authFormGroup.updateValueAndValidity();
    }
  }

  handleSignIn(): void {
    this.authService.login(this.authFormGroup.value).subscribe({
      next: (response) => {
        this.router.navigateByUrl('/home');
      },
      error: (err) => {
        Object.keys(this.authFormGroup.controls).forEach((key) => {
          this.authFormGroup.get(key)?.setErrors({ invalidField: true });
        });
        this.authFormGroup.markAllAsTouched();
      },
    });
  }

  handleCreateAccount(): void {
    this.authService.register(this.authFormGroup.value).subscribe({
      next: (response: AuthResponse) => {
        if (response?.isSuccess) {
          this.handleSignUp();
          this.formTitleTxt =
            'Account successfully created. Sign in to continue.';
        }
      },
      error: (err) => {
        if (err?.error?.isUserExist) {
          this.f['username'].setErrors({ userExist: true });
        }
      },
    });
  }

  loginWithGoogle() {
    this.authService.loginWithGoogle();
  }

  loginWithFacebook() {
    this.authService.loginWithFacebook();
  }

  ngOnDestroy(): void {
    this.formSubscription$.unsubscribe();
  }
}
