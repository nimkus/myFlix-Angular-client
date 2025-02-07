import { Component } from '@angular/core';

// Material Design
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';

// App Components
import { UserRegistrationFormComponent } from '../user-registration-form/user-registration-form.component';
import { UserLoginFormComponent } from '../user-login-form/user-login-form.component';

@Component({
  selector: 'app-welcome-screen',
  standalone: true,
  imports: [
    MatDialogModule,
    MatCardModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './welcome-screen.component.html',
  styleUrl: './welcome-screen.component.scss',
})
export class WelcomeScreenComponent {
  constructor(public dialog: MatDialog) {}

  // SignIn
  openUserRegistrationDialog(): void {
    this.dialog.open(UserRegistrationFormComponent, {});
  }

  // Login
  openUserLoginDialog(): void {
    this.dialog.open(UserLoginFormComponent, {});
  }
}
