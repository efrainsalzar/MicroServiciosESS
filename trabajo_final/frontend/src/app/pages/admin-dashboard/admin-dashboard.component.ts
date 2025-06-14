import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  template: `
    <div class="admin-container">
      <h2>Panel del Administrador</h2>

      <div class="btn-group">
        <button (click)="mostrarEspecialidades()">Ver Especialidades</button>
        <button (click)="toggleFormulario()">Crear Especialidad</button>
      </div>

      <!-- Lista de Especialidades -->
      <div *ngIf="mostrarLista" class="lista-especialidades">
        <h3>Especialidades Registradas</h3>
        <ul>
          <li *ngFor="let esp of especialidades">
            <strong>{{ esp.nombre }}</strong> - {{ esp.descripcion }}
          </li>
        </ul>
        <p *ngIf="especialidades.length === 0">No hay especialidades registradas.</p>
      </div>

      <!-- Formulario de creación -->
      <div *ngIf="mostrarFormulario" class="form-crear">
        <h3>Crear Nueva Especialidad</h3>
        <form (ngSubmit)="crearEspecialidad()">
          <label for="nombre">Nombre:</label>
          <input id="nombre" [(ngModel)]="nuevaEspecialidad.nombre" name="nombre" required>

          <label for="descripcion">Descripción:</label>
          <textarea id="descripcion" [(ngModel)]="nuevaEspecialidad.descripcion" name="descripcion" required></textarea>

          <button type="submit">Registrar</button>
        </form>
        <p *ngIf="mensaje" class="mensaje">{{ mensaje }}</p>
      </div>
    </div>
  `,
  styles: [`
    .admin-container {
      max-width: 800px;
      margin: 2rem auto;
      padding: 2rem;
      border: 1px solid #ddd;
      border-radius: 10px;
      font-family: Arial, sans-serif;
    }

    .btn-group {
      display: flex;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    button {
      padding: 0.5rem 1rem;
      font-size: 1rem;
      cursor: pointer;
    }

    .lista-especialidades ul {
      list-style: none;
      padding: 0;
    }

    .lista-especialidades li {
      background: #f1f1f1;
      padding: 0.5rem;
      margin-bottom: 0.5rem;
      border-radius: 5px;
    }

    .form-crear {
      margin-top: 2rem;
    }

    input, textarea {
      width: 100%;
      padding: 0.5rem;
      margin-bottom: 1rem;
    }

    .mensaje {
      margin-top: 1rem;
      color: green;
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  especialidades: any[] = [];
  mostrarLista = false;
  mostrarFormulario = false;
  mensaje = '';

  nuevaEspecialidad = {
    nombre: '',
    descripcion: ''
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {}

  mostrarEspecialidades() {
    this.mensaje = '';
    this.mostrarLista = true;
    this.mostrarFormulario = false;

    const query = `
      query {
        getEspecialidades {
          id
          nombre
          descripcion
        }
      }
    `;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });

    const body = { query };

    this.http.post<any>('http://localhost/agenda/graphql', body, { headers })
      .subscribe({
        next: (res) => this.especialidades = res.data.getEspecialidades,
        error: (err) => console.error('Error al obtener especialidades:', err)
      });
  }

  toggleFormulario() {
    this.mensaje = '';
    this.mostrarFormulario = !this.mostrarFormulario;
    this.mostrarLista = false;
  }

  crearEspecialidad() {
    const mutation = `
    mutation {
      crearEspecialidad(
        nombre: "${this.nuevaEspecialidad.nombre}",
        descripcion: "${this.nuevaEspecialidad.descripcion}") {
          id
          nombre
          descripcion
      }
    }
    `;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });

    this.http.post<any>('/agenda/graphql', { query: mutation }, { headers })
      .subscribe({
        next: (res) => {
          this.mensaje = 'Especialidad registrada correctamente';
          this.nuevaEspecialidad = { nombre: '', descripcion: '' };
        },
        error: (err) => {
          console.error('Error al crear especialidad:', err);
          this.mensaje = 'Hubo un error al crear la especialidad.';
        }
      });
  }
}
