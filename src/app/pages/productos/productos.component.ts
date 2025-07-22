import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticuloService } from '../../services/articulo.service';
import { CategoriaService } from '../../services/categoria.service';
import { CommonModule } from '@angular/common';
import { TarjetaProductoComponent } from '../../shared/tarjeta-producto/tarjeta-producto.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, TarjetaProductoComponent, FormsModule, RouterModule],
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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private articuloService: ArticuloService,
    private categoriaService: CategoriaService
  ) {}

  ngOnInit(): void {
    const categoriaId = this.route.snapshot.queryParamMap.get('categoriaId');
    console.log('🟡 Param categoriaId recibido:', categoriaId);

    this.categoriaService.obtenerCategorias().subscribe((cats) => {
      // ❌ Evitar duplicado de 'Todos' si ya viene del backend
      const sinDuplicadoTodos = cats.filter(
        cat => cat.nombre.toLowerCase() !== 'todos'
      );

      // ✅ Insertamos manualmente 'Todos' al inicio
      this.categorias = [{ id: 'todos', nombre: 'Todos' }, ...sinDuplicadoTodos];
      console.log('📦 Categorías cargadas (limpias):', this.categorias);

      if (categoriaId) {
        const encontrada = this.categorias.find(c => c.id.toString() === categoriaId);
        this.categoriaActual = encontrada || this.categorias[0];
        console.log('✅ Categoría seleccionada desde queryParams:', this.categoriaActual);
      } else {
        console.log('🟢 No se recibió categoríaId. Se usará Todos.');
      }

      this.cargarProductos();
    });
  }

  cargarProductos(): void {
    console.log('🔄 Cargando productos para categoría:', this.categoriaActual);

    if (this.categoriaActual.id === 'todos') {
      this.articuloService.obtenerArticulos().subscribe((data) => {
        this.productos = data;
        console.log('📥 Productos cargados (todos):', data);
        this.aplicarFiltroBusqueda();
      });
    } else {
      this.articuloService.obtenerArticulosPorCategoria(this.categoriaActual.id).subscribe((data) => {
        this.productos = data;
        console.log('📥 Productos cargados por categoría:', data);
        this.aplicarFiltroBusqueda();
      });
    }
  }

  aplicarFiltroBusqueda(): void {
    const termino = this.terminoBusqueda.toLowerCase().trim();
    this.productosFiltrados = this.productos.filter(p =>
      p.nombre.toLowerCase().includes(termino)
    );
    console.log('🔎 Productos filtrados por término:', termino, this.productosFiltrados);
  }

  seleccionarCategoria(categoria: any): void {
    console.log('🧩 Seleccionando nueva categoría:', categoria);

    this.categoriaActual = categoria;
    this.mostrarModalCategorias = false;

    const queryParams = categoria.id === 'todos' ? {} : { categoriaId: categoria.id };
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge'
    });

    this.cargarProductos();
  }

   irAVentas(): void {
  window.location.href = '/ventas'; // Puedes reemplazar esto por [routerLink] si usas rutas Angular
}
}
