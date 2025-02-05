import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

// Import Angular Material Modules
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { FetchApiDataService } from '../fetch-api-data.service';

@Component({
  selector: 'app-user-login-form',
  templateUrl: './user-login-form.component.html',
  styleUrls: ['./user-login-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatDialogModule,
  ],
})
export class UserLoginFormComponent {
  loginForm: FormGroup;

  private fetchApiData = inject(FetchApiDataService);
  private dialogRef = inject(MatDialogRef<UserLoginFormComponent>);
  private snackBar = inject(MatSnackBar);
  private fb = inject(FormBuilder);

  constructor() {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  /**
   * Function to log in user
   * @returns alert on success or error
   */
  loginUser(): void {
    if (this.loginForm.invalid) {
      this.snackBar.open('Please enter both username and password.', 'OK', {
        duration: 2000,
      });
      return;
    }

    this.fetchApiData.userLogin(this.loginForm.value).subscribe({
      next: (result) => {
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));

        this.snackBar.open(
          `✅ Login successful! Welcome, ${result.user.username}!`,
          'OK',
          {
            duration: 4000,
          }
        );

        this.dialogRef.close(); // Close the login modal
      },
      error: (err) => {
        let errorMessage = 'Invalid username or password. Please try again.';
        if (typeof err === 'string') {
          errorMessage = err;
        } else if (err.message) {
          errorMessage = err.message;
        }

        this.snackBar.open(`❌ Error: ${errorMessage}`, 'OK', {
          duration: 4000,
        });
      },
    });
  }
}
