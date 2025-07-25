import { Injectable } from '@angular/core';
import { ArticuloService } from '../services/articulo.service';
import { VentaService } from '../services/ventas.service';
import { CategoriaService } from '../services/categoria.service'; // ✅ nuevo
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArticuloMapper {
  constructor(
    private articuloService: ArticuloService,
    private ventaService: VentaService,
    private categoriaService: CategoriaService // ✅ inyección nueva
  ) {}

  camposFormulario = [
    { key: 'nombre', label: 'Nombre del artículo', tipo: 'text', placeholder: 'Ej. Sujetador de encaje' },
    { key: 'descripcion', label: 'Descripción', tipo: 'textarea', placeholder: 'Descripción del artículo' },
    { key: 'precio', label: 'Precio', tipo: 'number', placeholder: 'Ej. 19.99' },
    { key: 'talla', label: 'Talla', tipo: 'text', placeholder: 'Ej. S, M, L' },
    { key: 'color', label: 'Color', tipo: 'text', placeholder: 'Ej. Negro, Rojo' },
    { key: 'tipo_genero', label: 'Género', tipo: 'select', opciones: ['mujer', 'hombre', 'unisex'] },
    { 
  key: 'categoria_id', 
  label: 'Categoría', 
  tipo: 'select', 
  opciones: [] as { label: string; value: any }[] 
},

    { key: 'imagen_url', label: 'Imagen (URL o path)', tipo: 'text', placeholder: 'productos/nombre.jpg' }
  ];

  /**
   * Llenar opciones dinámicas del campo categoría
   */
  obtenerCategoriasPlano(): Observable<any[]> {
  return this.categoriaService.obtenerCategorias();
}



  crearArticulo(datos: any): Observable<any> {
    return this.articuloService.crearArticulo(datos);
  }

  actualizarArticulo(id: string, datos: any): Observable<any> {
    return this.articuloService.actualizarArticulo(id, datos);
  }

  eliminarArticulo(id: string): Observable<any> {
    return this.articuloService.eliminarArticulo(id);
  }

  obtenerArticulos(): Observable<any[]> {
    return this.articuloService.obtenerArticulos().pipe(
      map(articulos => articulos.map(a => ({
        ...a,
        precio: `$${a.precio.toFixed(2)}`,
        display: `${a.nombre} (${a.talla || 'Sin talla'})`
      })))
    );
  }

  obtenerArticulosPorCategoria(categoriaId: number): Observable<any[]> {
    return this.articuloService.obtenerArticulosPorCategoria(categoriaId).pipe(
      map(articulos => articulos.map(a => ({
        id: a.id,
        nombre: a.nombre,
        precio: a.precio,
        categoria_id: a.categoria_id
      })))
    );
  }

  obtenerMasVendidos(): Observable<any[]> {
  return this.ventaService.obtenerMasVendidos().pipe(
    map(items => items.map(i => ({
      id: i.id,
      nombre: i.nombre,
      descripcion: i.descripcion,
      precio: i.precio,
      imagen_url: i.imagen,
      total_vendidos: Number(i.total_vendidos)
    })))
  );
}



  obtenerCamposEdicion(articulo: any): any[] {
    return this.camposFormulario.map(c => ({
      ...c,
      value: articulo[c.key],
      deshabilitado: c.key === 'id' || c.key === 'imagen_url'
    }));
  }

  obtenerCamposEliminar(articulo: any): any[] {
    return [
      { key: 'nombre', label: 'Nombre', tipo: 'text', value: articulo.nombre, deshabilitado: true },
      { key: 'categoria', label: 'Categoría', tipo: 'text', value: articulo.categoria_id, deshabilitado: true },
      { key: 'precio', label: 'Precio', tipo: 'text', value: `$${articulo.precio}`, deshabilitado: true }
    ];
  }
}
