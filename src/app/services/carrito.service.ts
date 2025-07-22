import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CarritoService {
  private carrito: any[] = [];

  agregarAlCarrito(producto: any) {
    this.carrito.push(producto);
    console.log('🛒 Producto agregado al carrito:', producto);
  }

  obtenerCarrito(): any[] {
    return this.carrito;
  }

  limpiarCarrito() {
    this.carrito = [];
  }
}
