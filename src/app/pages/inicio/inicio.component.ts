import { Component, OnInit } from '@angular/core';
import { ArticuloMapper } from '../../mapping/articulo.mapper';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';


@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss'],
})
export class InicioComponent implements OnInit {
  productos: any[] = [];
  categorias: any[] = [];
  indiceActual = 0;

  constructor(private articuloMapper: ArticuloMapper, private router: Router) {}

  ngOnInit(): void {
    this.cargarProductosMasVendidos();
    this.cargarCategorias();
  }

  /**
   * Cargar productos más vendidos desde el mapper
   */
  cargarProductosMasVendidos(): void {
    this.articuloMapper.obtenerMasVendidos().subscribe((res) => {
      this.productos = res;
    });
  }

  irAVentas(): void {
  window.location.href = '/ventas'; // Puedes reemplazar esto por [routerLink] si usas rutas Angular
}


  /**
   * Cargar categorías desde el servicio y actualizar campo dinámico
   */
    cargarCategorias(): void {
    this.articuloMapper.obtenerCategoriasPlano().subscribe((categorias) => {
      console.log(categorias)
      this.categorias = categorias || [];
    });
  }



  /**
   * Cambiar al producto anterior en el carrusel
   */
  mostrarAnterior(): void {
    this.indiceActual = (this.indiceActual - 1 + this.productos.length) % this.productos.length;
  }

  /**
   * Cambiar al producto siguiente en el carrusel
   */
  mostrarSiguiente(): void {
    this.indiceActual = (this.indiceActual + 1) % this.productos.length;
  }

  /**
   * Producto actualmente visible
   */
  get productoActual() {
    return this.productos[this.indiceActual];
  }


  /**
 * Navega al componente de productos filtrando por categoría
 */
irAProductosPorCategoria(categoria: any): void {
  console.log('➡️ Redireccionando a productos con:', categoria);
  const ruta = `/productos?categoriaId=${categoria.id}&nombre=${encodeURIComponent(categoria.nombre)}`;
  console.log('📌 Ruta construida:', ruta);
  
  this.router.navigate(['/productos'], {
    queryParams: { categoriaId: categoria.id, nombre: categoria.nombre }
  });
}



}
