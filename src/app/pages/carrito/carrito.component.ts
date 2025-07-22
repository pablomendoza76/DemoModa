import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarritoService } from '../../services/carrito.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.scss']
})
export class CarritoComponent implements OnInit {
  carrito: any[] = [];
  total: number = 0;

  constructor(private carritoService: CarritoService, private location: Location) {}

  ngOnInit(): void {
    const datos = this.carritoService.obtenerCarrito();

    this.carrito = datos.map((item: any) => ({
      id: item.id,
      nombre: item.nombre,
      descripcion: item.descripcion,
      imagen_url: item.imagen_url,
      precio: Number(item.precio) || 0,
      cantidad: Number(item.cantidad) || 1,
      talla: item.talla || 'Única',
    }));

    console.log('📦 Productos en el carrito:', this.carrito);
    this.calcularTotal();
  }

  calcularTotal(): void {
    this.total = this.carrito.reduce((acum, item) => {
      const subtotal = item.precio * item.cantidad;
      return acum + subtotal;
    }, 0);
    console.log('💰 Total calculado:', this.total);
  }

  sumarCantidad(item: any): void {
    item.cantidad++;
    this.actualizarCarrito();
  }

  restarCantidad(item: any): void {
    if (item.cantidad > 1) {
      item.cantidad--;
      this.actualizarCarrito();
    }
  }

  removerItem(item: any): void {
    this.carrito = this.carrito.filter(p => p !== item);
    this.carritoService.actualizarCarrito(this.carrito);
    this.calcularTotal();
    console.log(`🗑 Producto eliminado: ${item.nombre}`);
  }

  vaciarCarrito(): void {
    this.carritoService.limpiarCarrito();
    this.carrito = [];
    this.total = 0;
    console.log('🧹 Carrito vaciado');
  }

  actualizarCarrito(): void {
    this.carritoService.actualizarCarrito(this.carrito);
    this.calcularTotal();
  }

   volver() {
    this.location.back(); // 🔙 Vuelve a la página anterior
  }
}
