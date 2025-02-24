import { Component, inject } from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input'
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatDividerModule} from '@angular/material/divider';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';


@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule, MatDividerModule, FormsModule, ReactiveFormsModule]
})
export class AuthComponent {
  readonly fb = inject(FormBuilder);

  isShowPassword = false;
  isSignIn = true;

  authFormGroup: FormGroup;

  constructor () {
    this.authFormGroup = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
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
}
