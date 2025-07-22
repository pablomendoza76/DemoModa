import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environments';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class VentaService {
  private baseUrl = `${environment.supabaseUrl}/rest/v1/ventas`;
  private rpcUrl = `${environment.supabaseUrl}/rest/v1/rpc/obtener_top_productos`;

  private headers = new HttpHeaders({
    apikey: environment.supabaseKey,
    Authorization: `Bearer ${environment.supabaseKey}`,
    Prefer: 'return=representation',
    'Content-Type': 'application/json'
  });

  constructor(private http: HttpClient) {}

  registrarVenta(venta: any): Observable<any> {
    return this.http.post(this.baseUrl, venta, {
      headers: this.headers
    });
  }

  obtenerVentas(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl, {
      headers: this.headers,
      params: {
        select: '*,productos(nombre)'
      }
    });
  }

  /**
   * Obtener los productos más vendidos usando la función RPC de Supabase
   */
  obtenerMasVendidos(): Observable<any[]> {
    return this.http.post<any[]>(this.rpcUrl, {}, {
      headers: this.headers
    });
  }
}
