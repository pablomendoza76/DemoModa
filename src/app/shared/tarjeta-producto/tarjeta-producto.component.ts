import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CarritoService } from '../../services/carrito.service';
import { ArticuloService } from '../../services/articulo.service';

@Component({
  selector: 'app-tarjeta-producto',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tarjeta-producto.component.html',
  styleUrls: ['./tarjeta-producto.component.scss']
})
export class TarjetaProductoComponent {
  @Input() productos: any[] = [];
  @Input() mostrarBotonEditar: boolean = false;
  @Input() categorias: any[] = [];

  productoSeleccionado: any = null;
  tallaSeleccionada: string = '';
  cantidadSeleccionada: number = 1;
  mostrarModal: boolean = false;

  // ✏️ Edición
  mostrarModalEdicion: boolean = false;
  productoEditando: any = null;

  constructor(
    private carritoService: CarritoService,
    private ArticuloService: ArticuloService
  ) {}

  // 🛒 Abrir modal agregar al carrito
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

  // ✏️ Modal edición
  abrirModalEdicion(producto: any): void {
    this.productoEditando = { ...producto };
    this.mostrarModalEdicion = true;
    console.log('✏️ Modal edición abierto:', producto);
  }

  cerrarModalEdicion(): void {
    this.mostrarModalEdicion = false;
    this.productoEditando = null;
    console.log('❌ Edición cancelada');
  }

  guardarCambiosProducto(): void {
    if (!this.productoEditando.nombre || !this.productoEditando.precio) {
      console.warn('⚠️ Nombre y precio son obligatorios');
      return;
    }

    const { id, ...datos } = this.productoEditando;

    // Validar campos y limpiar nulos
    datos.talla = this.productoEditando.talla || '';
    datos.color = this.productoEditando.color || '';
    datos.tipo_genero = this.productoEditando.tipo_genero || '';
    datos.categoria_id = this.productoEditando.categoria_id || null;
    datos.imagen_url = this.productoEditando.imagen_url || '';

    this.ArticuloService.actualizarArticulo(id, datos).subscribe({
      next: (res) => {
        console.log('✅ Producto actualizado con éxito:', res);

        const index = this.productos.findIndex(p => p.id === id);
        if (index !== -1) this.productos[index] = { id, ...datos };

        this.cerrarModalEdicion();
      },
      error: (err) => {
        console.error('❌ Error al actualizar producto:', err);
      }
    });
  }

  // 🗑 Eliminar producto
  eliminarProducto(producto: any): void {
    const confirmar = confirm(`¿Estás seguro de eliminar "${producto.nombre}"?`);

    if (!confirmar) return;

    this.ArticuloService.eliminarArticulo(producto.id).subscribe({
      next: () => {
        this.productos = this.productos.filter(p => p.id !== producto.id);
        this.cerrarModalEdicion();
        console.log('🗑 Producto eliminado correctamente');
      },
      error: (err) => {
        console.error('❌ Error al eliminar producto:', err);
        alert('No se pudo eliminar el producto.');
      }
    });
  }
}
