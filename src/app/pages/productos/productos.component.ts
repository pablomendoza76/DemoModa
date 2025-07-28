import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ArticuloService } from '../../services/articulo.service';
import { CategoriaService } from '../../services/categoria.service';
import { AuthService } from '../../auth/auth.service';

import { TarjetaProductoComponent } from '../../shared/tarjeta-producto/tarjeta-producto.component';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, TarjetaProductoComponent],
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss']
})
export class ProductosComponent implements OnInit {
  productos: any[] = [];
  productosFiltrados: any[] = [];
  categorias: any[] = [];
  categoriaActual: any = { id: 'todos', nombre: 'Todos' };
  terminoBusqueda: string = '';
  mostrarModalCategorias = false;

  // ✅ Modal de creación de producto
  mostrarModalCrearProducto = false;
  nuevoProducto: any = {
    nombre: '',
    descripcion: '',
    precio: 0,
    categoria_id: null
  };

  usuarioAutenticado: boolean = false;
  esSofia: boolean = false;

  private readonly platformId = inject(PLATFORM_ID);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private articuloService: ArticuloService,
    private categoriaService: CategoriaService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        this.verificarSesion();
        this.inicializarCategorias();
      });
    }
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
    this.router.navigate(['/login']);
  }

  iniciarSesion(): void {
    this.router.navigate(['/login']);
  }

  irAVentas(): void {
    this.router.navigate(['/ventas']);
  }

  irAMetricas(): void {
    this.router.navigate(['/metricas']);
  }

  private inicializarCategorias(): void {
    const categoriaId = this.route.snapshot.queryParamMap.get('categoriaId');
    this.categoriaService.obtenerCategorias().subscribe((cats) => {
      const sinDuplicadoTodos = cats.filter(cat => cat.nombre.toLowerCase() !== 'todos');
      this.categorias = [{ id: 'todos', nombre: 'Todos' }, ...sinDuplicadoTodos];

      if (categoriaId) {
        const encontrada = this.categorias.find(c => c.id.toString() === categoriaId);
        this.categoriaActual = encontrada || this.categorias[0];
      }

      this.cargarProductos();
    });
  }

  cargarProductos(): void {
    if (this.categoriaActual.id === 'todos') {
      this.articuloService.obtenerArticulos().subscribe((data) => {
        this.productos = data;
        this.aplicarFiltroBusqueda();
      });
    } else {
      this.articuloService
        .obtenerArticulosPorCategoria(this.categoriaActual.id)
        .subscribe((data) => {
          this.productos = data;
          this.aplicarFiltroBusqueda();
        });
    }
  }

  aplicarFiltroBusqueda(): void {
    const termino = this.terminoBusqueda.toLowerCase().trim();
    this.productosFiltrados = this.productos.filter((p) =>
      p.nombre.toLowerCase().includes(termino)
    );
  }

  seleccionarCategoria(categoria: any): void {
    this.categoriaActual = categoria;
    this.mostrarModalCategorias = false;

    const queryParams =
      categoria.id === 'todos' ? {} : { categoriaId: categoria.id };

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge',
    });

    this.cargarProductos();
  }

  // ✅ Métodos para crear producto
  abrirModalCrearProducto(): void {
    this.nuevoProducto = {
      nombre: '',
      descripcion: '',
      precio: 0,
      categoria_id: null
    };
    this.mostrarModalCrearProducto = true;
  }

  cerrarModalCrearProducto(): void {
    this.mostrarModalCrearProducto = false;
  }

  guardarProducto(): void {
    // Asignar categoría si hay una seleccionada
    if (this.categoriaActual?.id !== 'todos') {
      this.nuevoProducto.categoria_id = this.categoriaActual.id;
    }

    this.articuloService.crearArticulo(this.nuevoProducto).subscribe({
      next: () => {
        this.cerrarModalCrearProducto();
        this.cargarProductos();
      },
      error: (err) => {
        console.error('Error al crear producto:', err);
        alert('No se pudo crear el producto.');
      }
    });
  }
}
