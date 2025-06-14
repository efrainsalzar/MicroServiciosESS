import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule], // Agrega HttpClientModule aquí
  template: `
    <div class="login-container">
      <h2>Iniciar sesión</h2>
      <form (ngSubmit)="login()">
        <label for="email">Correo:</label>
        <input
          type="email"
          id="email"
          [(ngModel)]="email"
          name="email"
          required
        />

        <label for="password">Contraseña:</label>
        <input
          type="password"
          id="password"
          [(ngModel)]="password"
          name="password"
          required
        />

        <button type="submit">Ingresar</button>
      </form>
      <p *ngIf="error" style="color: red;">{{ error }}</p>
    </div>
  `,
  styles: [
    `
      .login-container {
        max-width: 400px;
        margin: 4rem auto;
        padding: 2rem;
        border: 1px solid #ccc;
        border-radius: 10px;
        text-align: center;
      }

      input {
        width: 100%;
        padding: 0.5rem;
        margin: 0.5rem 0 1rem 0;
      }

      button {
        padding: 0.5rem 1rem;
      }
    `,
  ],
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';

  constructor(private http: HttpClient, private router: Router) {}

  login() {
    const url = '/usuarios/api/login';
    const body = {
      email: this.email,
      password_hash: this.password,
    };

    this.http.post<any>(url, body).subscribe({
      next: (res) => {
        console.log('Respuesta del servidor:', res);
        this.error = '';
        localStorage.setItem('token', res.token); // guarda token si quieres
        localStorage.setItem('user', JSON.stringify(res.user));

        const role = res.user.role;

        if (role === 'admin') {
          this.router.navigate(['/admin-dashboard']);
        } else if (role === 'medico') {
          this.router.navigate(['/medico-dashboard']);
        } else if (role === 'paciente') {
          this.router.navigate(['/paciente-dashboard']);
        } else {
          this.error = 'Rol de usuario no reconocido';
        }
      },
      error: (err) => {
        this.error = 'Credenciales inválidas o error en el servidor';
        console.error(err);
      },
    });
  }
}
