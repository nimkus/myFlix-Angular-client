import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
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
  selector: 'app-user-registration-form',
  templateUrl: './user-registration-form.component.html',
  styleUrls: ['./user-registration-form.component.scss'],
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
export class UserRegistrationFormComponent {
  registrationForm: FormGroup;

  private fetchApiData = inject(FetchApiDataService);
  private dialogRef = inject(MatDialogRef<UserRegistrationFormComponent>);
  private snackBar = inject(MatSnackBar);
  private fb = inject(FormBuilder);

  constructor() {
    this.registrationForm = this.fb.group({
      username: [
        '',
        [
          Validators.required,
          Validators.minLength(5), // Username must be at least 5 characters
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/
          ), // Password pattern validation
        ],
      ],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/), // Email pattern validation
        ],
      ],
      birthday: [
        '',
        [
          Validators.required,
          this.validateBirthday, // Custom validator function for birthday
        ],
      ],
    });
  }

  /**
   * Custom validator function for birthday
   * @param control birthday form control
   * @returns validation error or null
   */
  validateBirthday(control: AbstractControl): { [key: string]: any } | null {
    const value = control.value;
    if (!value) return null; // No value, no error

    const today = new Date();
    const birthDate = new Date(value);
    const ageLimit = 200;
    const maxAgeDate = new Date(
      today.setFullYear(today.getFullYear() - ageLimit)
    );

    if (birthDate > new Date()) {
      return { invalidBirthday: 'The birthday cannot be in the future.' };
    } else if (birthDate < maxAgeDate) {
      return { invalidBirthday: 'This is not a valid age in the bunnyverse.' };
    }
    return null;
  }

  /**
   * Function to register user
   * @returns alert on success or error
   */
  registerUser(): void {
    if (this.registrationForm.invalid) {
      this.snackBar.open('Please fill all required fields correctly.', 'OK', {
        duration: 2000,
      });
      return;
    }

    this.fetchApiData.userRegistration(this.registrationForm.value).subscribe({
      next: (result) => {
        this.snackBar.open(
          `🎉 Registration successful! Welcome, ${this.registrationForm.value.username}!`,
          'OK',
          {
            duration: 4000,
          }
        );

        this.dialogRef.close(); // ✅ Close the registration modal
      },
      error: (err) => {
        let errorMessage = 'Something went wrong. Please try again.';
        if (typeof err === 'string') {
          errorMessage = err; // ✅ Handle plain text errors
        } else if (err.message) {
          errorMessage = err.message; // ✅ Handle structured error messages
        }

        this.snackBar.open(`❌ Error: ${errorMessage}`, 'OK', {
          duration: 4000,
        });
      },
    });
  }
}
