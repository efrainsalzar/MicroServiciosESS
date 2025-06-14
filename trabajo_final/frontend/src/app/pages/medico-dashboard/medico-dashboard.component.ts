import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type DiaSemana = 'LUNES' | 'MARTES' | 'MIERCOLES' | 'JUEVES' | 'VIERNES' | 'SABADO' | 'DOMINGO';

@Component({
  selector: 'app-medico-dashboard',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  template: `
    <div class="medico-container">
      <h2>Panel del Médico</h2>

      <div class="btn-group">
        <button (click)="cargarAgenda()">Ver Mi Agenda</button>
        <button (click)="toggleFormulario()">Crear/Actualizar Agenda</button>
      </div>

      <!-- Mostrar agenda -->
      <div *ngIf="mostrarAgenda" class="agenda">
        <h3>Mi Agenda</h3>
        <div *ngIf="agenda">
          <p><strong>ID Agenda:</strong> {{ agenda.id }}</p>
          <p><strong>Especialidades:</strong></p>
          <ul>
            <li *ngFor="let esp of agenda.especialidades">{{ esp.nombre }}</li>
          </ul>

          <p><strong>Horarios disponibles:</strong></p>
          <ul>
            <li *ngFor="let horario of agenda.horarios_disponibles">
              {{ horario.dia }}: {{ horario.horas.join(', ') }}
            </li>
          </ul>
        </div>
        <p *ngIf="!agenda">No tienes agenda registrada.</p>
      </div>

      <!-- Formulario de creación/actualización -->
      <div *ngIf="mostrarFormulario" class="form-agenda">
        <h3>Crear / Actualizar Agenda</h3>

        <form (ngSubmit)="crearOActualizarAgenda()">
          <label><strong>IDs de Especialidades (separados por coma):</strong></label>
          <input type="text" [(ngModel)]="especialidadesIdsTexto" name="especialidades" placeholder="Ej: 123,456" />

          <label><strong>Horarios Disponibles:</strong></label>
          <div *ngFor="let dia of diasSemana">
            <strong>{{ dia }}:</strong>
            <input type="text" placeholder="HH:mm,HH:mm" [(ngModel)]="horariosDisponibles[dia]" name="horario-{{dia}}">
            <small>Ejemplo: 10:00,14:00</small>
          </div>

          <button type="submit">Guardar Agenda</button>
        </form>
        <p *ngIf="mensaje" class="mensaje">{{ mensaje }}</p>
      </div>
    </div>
  `,
  styles: [`
    .medico-container {
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

    .agenda ul {
      list-style: none;
      padding: 0;
    }

    .agenda li {
      background: #f1f1f1;
      padding: 0.5rem;
      margin-bottom: 0.5rem;
      border-radius: 5px;
    }

    input[type="text"] {
      width: 100%;
      padding: 0.5rem;
      margin-bottom: 0.5rem;
      box-sizing: border-box;
    }

    .mensaje {
      margin-top: 1rem;
      color: green;
    }
  `]
})
export class MedicoDashboardComponent implements OnInit {
  agenda: any = null;
  mostrarAgenda = false;
  mostrarFormulario = false;
  mensaje = '';

  especialidadesIdsTexto = ''; // Cadena con IDs separados por coma

  diasSemana: DiaSemana[] = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO'];

  horariosDisponibles: { [key in DiaSemana]: string } = {
    LUNES: '',
    MARTES: '',
    MIERCOLES: '',
    JUEVES: '',
    VIERNES: '',
    SABADO: '',
    DOMINGO: ''
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {}

  cargarAgenda() {
    this.mensaje = '';
    this.mostrarAgenda = true;
    this.mostrarFormulario = false;

    const query = `
      query {
        getMiAgenda {
          id
          medico_id
          especialidades {
            id
            nombre
          }
          horarios_disponibles {
            dia
            horas
          }
        }
      }
    `;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });

    this.http.post<any>('/agenda/graphql', { query }, { headers })
      .subscribe({
        next: (res) => {
          this.agenda = res.data?.getMiAgenda || null;
        },
        error: (err) => {
          console.error('Error al obtener agenda:', err);
          this.agenda = null;
        }
      });
  }

  toggleFormulario() {
    this.mensaje = '';
    this.mostrarFormulario = !this.mostrarFormulario;
    this.mostrarAgenda = false;
  }

  crearOActualizarAgenda() {
    const especialidadesIds = this.especialidadesIdsTexto
      .split(',')
      .map(id => id.trim())
      .filter(id => id.length > 0);

    if (especialidadesIds.length === 0) {
      this.mensaje = 'Debe ingresar al menos un ID de especialidad.';
      return;
    }

    const horariosInput = this.diasSemana
      .filter(dia => this.horariosDisponibles[dia].trim() !== '')
      .map(dia => {
        const horas = this.horariosDisponibles[dia]
          .split(',')
          .map(h => h.trim())
          .filter(h => h.length > 0);
        return `{ dia: ${dia}, horas: [${horas.map(h => `"${h}"`).join(',')}] }`;
      });

    const mutation = `
      mutation {
        crearAgenda(
          especialidades: [${especialidadesIds.map(id => `"${id}"`).join(',')}],
          horarios_disponibles: [${horariosInput.join(',')}]
        ) {
          id
          medico_id
          especialidades {
            nombre
          }
          horarios_disponibles {
            dia
            horas
          }
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
          this.mensaje = 'Agenda guardada correctamente.';
          this.mostrarFormulario = false;
          this.cargarAgenda();
        },
        error: (err) => {
          console.error('Error al guardar agenda:', err);
          this.mensaje = 'Hubo un error al guardar la agenda.';
        }
      });
  }
}
