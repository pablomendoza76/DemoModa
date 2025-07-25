import { Component, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CarritoService } from '../../services/carrito.service';
import { ArticuloMapper } from '../../mapping/articulo.mapper';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss'],
})
export class InicioComponent {
  productos: any[] = [];
  categorias: any[] = [];
  indiceActual = 0;
  mensajeVisible: boolean = false;
  tallaSeleccionada: string | null = null;
  usuarioAutenticado: boolean = false;
  esSofia: boolean = false;

  private readonly platformId = inject(PLATFORM_ID);

  constructor(
    private articuloMapper: ArticuloMapper,
    private carritoService: CarritoService,
    private router: Router,
    private authService: AuthService
  ) {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        this.cargarDatos();
      }, 0);
    }
  }

  private cargarDatos(): void {
    this.cargarProductosMasVendidos();
    this.cargarCategorias();
    this.verificarSesion();
  }

  private verificarSesion(): void {
    try {
      const sesion = this.authService.obtenerUsuarioLocal();
      this.usuarioAutenticado = !!sesion;
      this.esSofia = sesion?.correo === 'sofia@ejemplo.com';

      this.authService.escucharCambioSesion(() => {
        const nuevaSesion = this.authService.obtenerUsuarioLocal();
        this.usuarioAutenticado = !!nuevaSesion;
        this.esSofia = nuevaSesion?.correo === 'sofia@ejemplo.com';
      });
    } catch (e) {
      console.warn('⚠️ Error verificando sesión:', e);
    }
  }

  async cerrarSesion(): Promise<void> {
    await this.authService.logout();
    this.usuarioAutenticado = false;
    this.esSofia = false;
    this.router.navigate(['/inicio']);
  }

  cargarProductosMasVendidos(): void {
    this.articuloMapper.obtenerMasVendidos().subscribe((res) => {
      this.productos = res;
    });
  }

  irAVentas(): void {
    this.router.navigate(['/ventas']);
  }

  irAMetricas(): void {
    this.router.navigate(['/metricas']);
  }

  cargarCategorias(): void {
    this.articuloMapper.obtenerCategoriasPlano().subscribe((categorias) => {
      this.categorias = categorias || [];
    });
  }

  mostrarAnterior(): void {
    this.indiceActual = (this.indiceActual - 1 + this.productos.length) % this.productos.length;
  }

  mostrarSiguiente(): void {
    this.indiceActual = (this.indiceActual + 1) % this.productos.length;
  }

  get productoActual() {
    return this.productos[this.indiceActual];
  }

  irAProductosPorCategoria(categoria: any): void {
    this.router.navigate(['/productos'], {
      queryParams: { categoriaId: categoria.id, nombre: categoria.nombre },
    });
  }

  agregarAlCarrito(producto: any): void {
    if (!this.tallaSeleccionada) {
      alert('Por favor selecciona una talla antes de agregar al carrito.');
      return;
    }

    const carrito = this.carritoService.obtenerCarrito();
    const productoConTalla = { ...producto, talla: this.tallaSeleccionada };

    const existente = carrito.find(
      (item) => item.id === producto.id && item.talla === this.tallaSeleccionada
    );

    if (existente) {
      existente.cantidad += 1;
    } else {
      carrito.push({ ...productoConTalla, cantidad: 1 });
    }

    this.carritoService.actualizarCarrito(carrito);
    this.mostrarMensajeTemporal();
  }

  mostrarMensajeTemporal(): void {
    this.mensajeVisible = true;
    setTimeout(() => {
      this.mensajeVisible = false;
    }, 2500);
  }

  iniciarSesion(): void {
    this.router.navigate(['/login']);
  }
}
