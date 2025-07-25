import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environments';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ArticuloService {
  private baseUrl = `${environment.supabaseUrl}/rest/v1/productos`;

  private headers = new HttpHeaders({
    apikey: environment.supabaseKey,
    Authorization: `Bearer ${environment.supabaseKey}`,
    Prefer: 'return=representation',
    'Content-Type': 'application/json'
  });

  constructor(private http: HttpClient) {}

  crearArticulo(articulo: any): Observable<any> {
    return this.http.post(this.baseUrl, articulo, {
      headers: this.headers
    });
  }

  obtenerArticulos(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl, {
      headers: this.headers,
      params: { select: '*' }
    });
  }

  obtenerArticuloPorId(id: string): Observable<any> {
    return this.http.get<any[]>(`${this.baseUrl}?id=eq.${id}`, {
      headers: this.headers,
      params: { select: '*' }
    });
  }

  actualizarArticulo(id: string, datos: any): Observable<any> {
    return this.http.patch(`${this.baseUrl}?id=eq.${id}`, datos, {
      headers: this.headers
    });
  }

  eliminarArticulo(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}?id=eq.${id}`, {
      headers: this.headers
    });
  }

  obtenerArticulosPorCategoria(categoriaId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}?categoria_id=eq.${categoriaId}`, {
      headers: this.headers,
      params: { select: '*' }
    });
  }



}
