import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { FetchApiDataService } from '../fetch-api-data.service';

@Component({
  selector: 'app-profile-view',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatSnackBarModule,
    ReactiveFormsModule,
  ],
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.scss'],
})
export class ProfileViewComponent {
  private apiService = inject(FetchApiDataService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

  user = signal<any>(null);
  favMovies = signal<any[]>([]);
  isEditing = signal<boolean>(false);
  showPasswordFields = signal<boolean>(false);
  form!: FormGroup;

  constructor() {
    this.loadUserData();
    this.loadFavoriteMovies();

    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(5)]],
      email: ['', [Validators.required, Validators.email]],
      birthday: [''],
      currentPassword: [''],
      newPassword: [
        '',
        [
          Validators.pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/
          ),
        ],
      ],
    });
  }

  getFormattedDate(
    date: string | null,
    format: 'display' | 'input' = 'display'
  ): string {
    if (!date) return format === 'display' ? 'Not set' : '';
    const d = new Date(date);
    return isNaN(d.getTime())
      ? format === 'display'
        ? 'Not set'
        : ''
      : format === 'display'
      ? d.toLocaleDateString('de-DE')
      : `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
          2,
          '0'
        )}-${String(d.getDate()).padStart(2, '0')}`;
  }

  toggleEditing() {
    if (this.isEditing()) {
      this.loadUserData();
    }
    this.isEditing.set(!this.isEditing());
  }

  togglePasswordFields() {
    this.showPasswordFields.set(!this.showPasswordFields());
  }

  saveProfile(): void {
    if (this.form.invalid) {
      this.snackBar.open('Please correct the form errors.', 'Close', {
        duration: 3000,
      });
      return;
    }

    const storedUsername = localStorage.getItem('username');
    if (!storedUsername) return;

    const updateData: any = {
      username: this.form.value.username,
      email: this.form.value.email,
      birthday: this.form.value.birthday,
    };

    if (this.form.value.currentPassword && this.form.value.newPassword) {
      updateData.currentPassword = this.form.value.currentPassword;
      updateData.newPassword = this.form.value.newPassword;
    }
    console.log('Save:updatedUser: ', updateData);

    this.apiService.updateUser(storedUsername, updateData).subscribe(
      (res: any) => {
        // User feedback: success
        this.snackBar.open('Profile updated successfully!', 'Close', {
          duration: 3000,
        });

        // Resetting username to local storage in case it was updated
        localStorage.setItem('username', res.user.username);

        // reload userinfo and reset editing
        this.loadUserData();
        this.isEditing.set(false);
      },
      (error) => {
        // User feedback: error
        this.snackBar.open('Error updating profile.', 'Close', {
          duration: 3000,
        });
        console.error(error);
      }
    );
  }

  deleteProfile() {
    const storedUsername = localStorage.getItem('username');
    if (!storedUsername) return;

    this.apiService.deleteUser(storedUsername).subscribe(
      () => {
        localStorage.clear();
        this.snackBar.open('Profile deleted successfully!', 'Close', {
          duration: 3000,
        });
        this.router.navigate(['/welcome']);
      },
      (error) => {
        console.error('Error deleting profile:', error);
        this.snackBar.open('Error deleting profile.', 'Close', {
          duration: 3000,
        });
      }
    );
  }

  loadUserData() {
    const storedUsername = localStorage.getItem('username');
    if (!storedUsername) return;

    this.apiService.getUserInfo(storedUsername).subscribe(
      (res: any) => {
        if (!res) return;

        this.user.set(res);

        this.form.patchValue({
          username: res.username,
          email: res.email,
          birthday: this.getFormattedDate(res.birthday, 'input'),
        });
      },
      (error) => {
        console.error('Error fetching user data:', error);
        this.snackBar.open('Error fetching user data.', 'Close', {
          duration: 3000,
        });
      }
    );
  }

  loadFavoriteMovies() {
    const storedUsername = localStorage.getItem('username');
    if (!storedUsername) return;

    this.apiService.getUserInfo(storedUsername).subscribe(
      (res: any) => {
        this.favMovies.set(res.favMovies || []);
      },
      (error) => {
        console.error('Error fetching favorite movies:', error);
      }
    );
  }
}
