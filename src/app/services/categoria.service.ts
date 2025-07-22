import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environments';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CategoriaService {
  private baseUrl = `${environment.supabaseUrl}/rest/v1/categorias`;

  private headers = new HttpHeaders({
    apikey: environment.supabaseKey,
    Authorization: `Bearer ${environment.supabaseKey}`,
    Prefer: 'return=representation'
  });

  constructor(private http: HttpClient) {}

  /**
   * Crear una nueva categoría
   * @param categoria Objeto con { nombre, descripcion }
   */
  crearCategoria(categoria: any): Observable<any> {
    return this.http.post(this.baseUrl, categoria, {
      headers: this.headers
    });
  }

  /**
   * Obtener todas las categorías (sin filtro de estado)
   */
  obtenerCategorias(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl, {
      headers: this.headers,
      params: {
        select: 'id,nombre,descripcion'
      }
    });
  }

  /**
   * Obtener una categoría por ID
   * @param id ID numérico de la categoría
   */
  obtenerCategoriaPorId(id: number): Observable<any> {
    return this.http.get<any[]>(`${this.baseUrl}?id=eq.${id}`, {
      headers: this.headers,
      params: { select: '*' }
    });
  }

  /**
   * Actualizar una categoría por ID
   * @param id ID numérico
   * @param datos Objeto con campos a modificar
   */
  actualizarCategoria(id: number, datos: any): Observable<any> {
    return this.http.patch(`${this.baseUrl}?id=eq.${id}`, datos, {
      headers: this.headers
    });
  }

  /**
   * Eliminar una categoría por ID
   * Si más adelante implementas eliminación lógica, ajusta aquí
   */
  eliminarCategoria(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}?id=eq.${id}`, {
      headers: this.headers
    });
  }
}
