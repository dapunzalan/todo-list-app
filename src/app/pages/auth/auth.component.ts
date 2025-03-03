import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input'
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatDividerModule} from '@angular/material/divider';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule, MatDividerModule, FormsModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthComponent implements OnInit, OnDestroy {
  readonly fb = inject(FormBuilder);

  isShowPassword = false;
  isSignIn = true;
  passwordErrorMsg: string;

  authFormGroup: FormGroup;
  formSubscription$ = new Subscription;

  constructor () {
    this.authFormGroup = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.passwordErrorMsg = 'Password is required';
  }

  ngOnInit(): void {
    this.formSubscription$ = this.f['password'].valueChanges.subscribe(value => {
      if (!this.isSignIn && value && (!this.containsNameOrEmail || !this.hasMinLength || !this.hasNumberOrSymbol)) {
        this.passwordErrorMsg = 'Password strength: Weak';
        this.f['password'].setErrors({'incorrect': true});
      } else {
        this.passwordErrorMsg = 'Password is required';
      }
    });
  }

  get f(): { [key: string]: AbstractControl<any, any>; } {
    return this.authFormGroup.controls;
  }

  get containsNameOrEmail(): boolean {
    const lowerPassword = this.f['password'].value?.toLowerCase();
    return (!lowerPassword?.includes(this.f['username'].value?.toLowerCase())&& this.f['password'].value?.length > 0);
  }
  
  get hasMinLength(): boolean {
    return this.f['password'].value?.length >= 8;
  }
  
  get hasNumberOrSymbol(): boolean {
    return /[\d!@#$%^&*(),.?":{}|<>]/.test(this.f['password']?.value);
  }

  get isPasswordStrong(): boolean {
    return this.containsNameOrEmail && this.hasMinLength && this.hasNumberOrSymbol;
  }

  toggleShowPassword(event: MouseEvent): void {
    this.isShowPassword = !this.isShowPassword;
    event.stopPropagation();
  }

  handleSignUp(): void {
    this.isSignIn = !this.isSignIn;
    this.authFormGroup.reset();
    this.authFormGroup.markAsUntouched();
  }

  onSubmit(): void {
    console.log(this.authFormGroup.value)
  }

  ngOnDestroy(): void {
    this.formSubscription$.unsubscribe();
  }
}
