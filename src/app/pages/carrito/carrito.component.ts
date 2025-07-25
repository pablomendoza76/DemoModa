import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarritoService } from '../../services/carrito.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VentaService } from '../../services/ventas.service';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.scss']
})
export class CarritoComponent implements OnInit {
  carrito: any[] = [];
  total: number = 0;
  totalConDescuento: number = 0;
  cuponIngresado: string = '';
  descuento: number = 0;
  mostrarModalFacturacion: boolean = false;
  mostrarModalHistorial = false;
ventasCliente: any[] = [];

  datosFactura = {
    nombre: '',
    correo: '',
    direccion: '',
    telefono: '',
    metodoPago: '',
    tarjetaNumero: '',
    tarjetaNombre: '',
    tarjetaExpiracion: '',
    tarjetaCVV: '',
    paypalCorreo: ''
  };

  constructor(
    private carritoService: CarritoService,
    private router: Router,
    private location: Location,
    private ventaService : VentaService,
  ) {}

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
    this.total = this.carrito.reduce((acum, item) => acum + item.precio * item.cantidad, 0);
    this.totalConDescuento = this.total - (this.total * this.descuento);
    console.log('💰 Total sin descuento:', this.total);
    console.log('💸 Total con descuento:', this.totalConDescuento);
  }

  sumarCantidad(item: any): void {
    item.cantidad++;
    this.actualizarCarrito();
    console.log(`➕ Aumentada cantidad de ${item.nombre}: ${item.cantidad}`);
  }

  restarCantidad(item: any): void {
    if (item.cantidad > 1) {
      item.cantidad--;
      this.actualizarCarrito();
      console.log(`➖ Reducida cantidad de ${item.nombre}: ${item.cantidad}`);
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
    this.totalConDescuento = 0;
    console.log('🧹 Carrito vaciado');
  }

  actualizarCarrito(): void {
    this.carritoService.actualizarCarrito(this.carrito);
    this.calcularTotal();
    console.log('🔄 Carrito actualizado');
  }

  aplicarCupon(): void {
    const cupon = this.cuponIngresado.trim().toLowerCase();

    if (cupon === 'descuento10') {
      this.descuento = 0.10;
      console.log('✅ Cupón aplicado: 10%');
    } else {
      this.descuento = 0;
      console.log('⚠️ Cupón inválido');
    }

    this.calcularTotal();
  }

  abrirModalPedido(): void {
    const usuarioStr = localStorage.getItem('sesion_usuario');

    if (!usuarioStr) {
      console.log('🔐 Usuario no autenticado. Redirigiendo a login...');
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/carrito' } });
    } else {
      const usuario = JSON.parse(usuarioStr);
      console.log("usuario encontrado", usuario)
      console.log('✅ Usuario autenticado. Mostrando modal de facturación...');
      this.datosFactura.nombre = usuario?.nombre || '';
      this.datosFactura.correo = usuario?.email || '';
      this.datosFactura.telefono = usuario?.telefono || '';
      this.datosFactura.direccion = usuario?.direccion || '';
      this.mostrarModalFacturacion = true;
    }
  }

  cerrarModalFacturacion(): void {
    this.mostrarModalFacturacion = false;
    console.log('❌ Modal de facturación cerrado');
  }

  enviarFormulario(): void {
  if (!this.datosFactura.correo || this.carrito.length === 0) {
    console.warn('⚠️ Faltan datos o el carrito está vacío.');
    return;
  }

  // Construir objeto detallesPago según el método seleccionado
  const detallesPago = this.datosFactura.metodoPago === 'tarjeta'
    ? {
        tipo: 'tarjeta',
        numero: this.datosFactura.tarjetaNumero,
        nombre: this.datosFactura.tarjetaNombre,
        expiracion: this.datosFactura.tarjetaExpiracion,
        cvv: this.datosFactura.tarjetaCVV
      }
    : {
        tipo: 'paypal',
        correo: this.datosFactura.paypalCorreo
      };

  // Armar el pedido completo
 const pedido = {
  correo_cliente: this.datosFactura.correo,
  nombre_cliente: this.datosFactura.nombre,
  direccion: this.datosFactura.direccion,
  telefono: this.datosFactura.telefono,
   metodoPago: this.datosFactura.metodoPago,
    detallesPago,
  productos: this.carrito.map(item => ({
  producto_id: item.id,
  nombre: item.nombre,
  talla: item.talla,
  precio_unitario: item.precio,
  cantidad: item.cantidad
}))
};
;

  console.log('📤 Enviando pedido completo:', pedido);

  // Llamar al servicio para registrar todas las ventas
  this.ventaService.registrarVenta(pedido).subscribe({
    next: res => {
      console.log('✅ Pedido registrado con éxito:', res);
      this.mostrarModalFacturacion = false;
      this.vaciarCarrito();
    },
    error: err => {
      console.error('❌ Error al registrar pedido:', err);
    }
  });
}


  volver(): void {
    this.location.back();
    console.log('⬅️ Regresando a la página anterior');
  }

  abrirModalHistorialVentas() {
  const correo = this.datosFactura.correo?.trim();

  if (!correo) {
    const correoIngresado = prompt('Por favor, ingresa tu correo electrónico para consultar tu historial de compras:');
    if (!correoIngresado || !correoIngresado.includes('@')) {
      alert('Correo inválido. Intenta nuevamente.');
      return;
    }
    this.datosFactura.correo = correoIngresado;
  }

  this.ventaService.obtenerVentasPorCorreo(this.datosFactura.correo).subscribe(res => {
    this.ventasCliente = res;
    this.mostrarModalHistorial = true;
  });
}

calcularTotalVenta(venta: any): number {
  if (!venta?.productos) return 0;
  return venta.productos.reduce(
    (total: number, p: any) => total + p.precio_unitario * p.cantidad,
    0
  );
}



cerrarModalHistorial() {
  this.mostrarModalHistorial = false;
}
}
