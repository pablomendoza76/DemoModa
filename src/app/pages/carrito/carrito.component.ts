import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarritoService } from '../../services/carrito.service';

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

  constructor(private carritoService: CarritoService) {}

  ngOnInit(): void {
    this.carrito = this.carritoService.obtenerCarrito();
    this.calcularTotal();
  }

  calcularTotal(): void {
    this.total = this.carrito.reduce((acum, item) => {
      return acum + (item.producto.precio * item.cantidad);
    }, 0);
  }

  vaciarCarrito(): void {
    this.carritoService.limpiarCarrito();
    this.carrito = [];
    this.total = 0;
  }
}
