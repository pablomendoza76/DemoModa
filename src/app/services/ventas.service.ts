import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environments';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class VentaService {
  private baseUrl = `${environment.supabaseUrl}/rest/v1/ventas`;
  private registrarVentaUrl = `${environment.supabaseUrl}/rest/v1/rpc/registrar_venta`;
  private obtenerTopProductosUrl = `${environment.supabaseUrl}/rest/v1/rpc/obtener_top_productos`;

  private headers = new HttpHeaders({
    apikey: environment.supabaseKey,
    Authorization: `Bearer ${environment.supabaseKey}`,
    Prefer: 'return=representation',
    'Content-Type': 'application/json'
  });

  constructor(private http: HttpClient) {}

  /**
   * Registrar una venta usando función RPC
   */
  registrarVenta(pedido: any): Observable<any> {
  console.log("📨 Pedido que se va a enviar:", pedido);
  return this.http.post(`${environment.supabaseUrl}/rest/v1/rpc/registrar_venta`, {
    correo: pedido.correo_cliente,
    nombre: pedido.nombre_cliente,
    direccion: pedido.direccion,
    telefono: pedido.telefono,
    metodo: pedido.metodoPago,
    detalles: pedido.detallesPago || {},
    productos: pedido.productos // Incluye nombre, talla, precio_unitario, cantidad
  }, {
    headers: this.headers
  });
}

  /**
   * Obtener todas las ventas con datos del producto asociado
   */
  obtenerVentas(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl, {
      headers: this.headers,
      params: {
        select: '*,productos(nombre)'
      }
    });
  }

  /**
   * Obtener los productos más vendidos
   */
  obtenerMasVendidos(): Observable<any[]> {
    return this.http.post<any[]>(this.obtenerTopProductosUrl, {}, {
      headers: this.headers
    });
  }

  /**
 * Obtener ventas por correo del cliente
 */
obtenerVentasPorCorreo(correo: string): Observable<any[]> {
  return this.http.get<any[]>(this.baseUrl, {
    headers: this.headers,
    params: {
      correo_cliente: `eq.${correo}`,
      select: '*'
    }
  });
}

}
