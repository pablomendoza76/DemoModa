import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private readonly STORAGE_KEY = 'carrito_compras';

  constructor() {}

  /**
   * Obtiene el contenido del carrito desde localStorage
   */
  obtenerCarrito(): any[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  /**
   * Guarda el carrito actualizado en localStorage
   */
  actualizarCarrito(carrito: any[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(carrito));
    console.log('📝 Carrito actualizado en localStorage:', carrito);
  }

  /**
   * Limpia el carrito por completo
   */
  limpiarCarrito(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    console.log('🗑 Carrito eliminado de localStorage');
  }
}
