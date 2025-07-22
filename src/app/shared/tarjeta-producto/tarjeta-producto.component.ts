import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CarritoService } from '../../services/carrito.service';

@Component({
  selector: 'app-tarjeta-producto',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tarjeta-producto.component.html',
  styleUrls: ['./tarjeta-producto.component.scss']
})
export class TarjetaProductoComponent {
  @Input() productos: any[] = [];

  productoSeleccionado: any = null;
  tallaSeleccionada: string = '';
  cantidadSeleccionada: number = 1;
  mostrarModal: boolean = false;

  constructor(private carritoService: CarritoService) {}

  abrirModal(producto: any): void {
    this.productoSeleccionado = producto;
    this.tallaSeleccionada = '';
    this.cantidadSeleccionada = 1;
    this.mostrarModal = true;
    console.log('🛍️ Modal abierto para producto:', producto);
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    console.log('❌ Modal cerrado');
  }

  confirmarAgregar(): void {
    if (!this.tallaSeleccionada.trim() || this.cantidadSeleccionada < 1) {
      console.warn('⚠️ Selecciona una talla válida y una cantidad mayor a cero');
      return;
    }

    const productoFinal = {
      ...this.productoSeleccionado,
      talla: this.tallaSeleccionada,
      cantidad: this.cantidadSeleccionada
    };

    const carritoActual = this.carritoService.obtenerCarrito();

    const existente = carritoActual.find(item =>
      item.id === productoFinal.id && item.talla === productoFinal.talla
    );

    if (existente) {
      existente.cantidad += productoFinal.cantidad;
      console.log('➕ Producto ya en carrito, suma cantidad:', existente);
    } else {
      carritoActual.push(productoFinal);
      console.log('🆕 Producto nuevo agregado al carrito:', productoFinal);
    }

    this.carritoService.actualizarCarrito(carritoActual);
    this.cerrarModal();
  }
}
