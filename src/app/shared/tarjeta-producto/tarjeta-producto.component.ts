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

  abrirModal(producto: any) {
    this.productoSeleccionado = producto;
    this.tallaSeleccionada = '';
    this.cantidadSeleccionada = 1;
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
  }

  confirmarAgregar() {
    if (!this.tallaSeleccionada || this.cantidadSeleccionada < 1) return;

    const productoFinal = {
      ...this.productoSeleccionado,
      talla: this.tallaSeleccionada,
      cantidad: this.cantidadSeleccionada
    };

    this.carritoService.agregarAlCarrito(productoFinal);
    this.cerrarModal();
  }
}
