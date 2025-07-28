import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../environments/environments';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MetricasService {
  private baseUrl = `${environment.supabaseUrl}/rest/v1`;
  private headers = new HttpHeaders({
    apikey: environment.supabaseKey,
    Authorization: `Bearer ${environment.supabaseKey}`
  });

  constructor(private http: HttpClient) {}

  /**
   * 1. Total de productos por categoría (se agrupa en el frontend)
   */
  obtenerProductosPorCategoria(): Observable<any[]> {
  return this.http.get<any[]>(`${this.baseUrl}/productos`, {
    headers: this.headers,
    params: new HttpParams()
      .set('select', 'categoria_id,categorias(nombre)')
  });
}


  /**
   * 2. Total de productos vendidos, con nombre desde la tabla productos
   */
  obtenerCantidadVendidaPorProducto(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/venta_detalle`, {
      headers: this.headers,
      params: new HttpParams()
        .set('select', 'producto_id,cantidad,productos(nombre)')
    });
  }

  /**
   * 3. Top productos por ingresos (se calcula cantidad * precio en el frontend)
   */
  obtenerTopProductosPorIngreso(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/venta_detalle`, {
      headers: this.headers,
      params: new HttpParams()
        .set('select', 'producto_id,cantidad,precio_unitario,productos(nombre)')
        .set('limit', '200') // para análisis de ingresos desde el frontend
    });
  }
}
