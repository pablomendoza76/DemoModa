import { Component, OnInit } from '@angular/core';
import { MetricasService } from '../../services/metricas.service';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { Location } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-metricas',
  templateUrl: './metricas.component.html',
  styleUrls: ['./metricas.component.scss'],
  imports: [NgxChartsModule]
})
export class MetricasComponent implements OnInit {
  productosPorCategoria: any[] = [];
  productosVendidos: any[] = [];
  topProductosIngresos: any[] = [];

  view: [number, number] = [600, 300];

  constructor(private metricasService: MetricasService, private location: Location,) {}

  ngOnInit(): void {
    // 1. Productos por categoría
    this.metricasService.obtenerProductosPorCategoria().subscribe((res) => {
      const agrupado: Record<string, number> = {};
      res.forEach(p => {
        const cat = p.categoria_id ?? 'Sin asignar';
        agrupado[cat] = (agrupado[cat] || 0) + 1;
      });

      this.productosPorCategoria = Object.entries(agrupado).map(([categoria, count]) => ({
        name: `Categoría ${categoria}`,
        value: count
      }));

      console.log('[📊 productosPorCategoria]', this.productosPorCategoria);
    });

    // 2. Productos vendidos por nombre
    this.metricasService.obtenerCantidadVendidaPorProducto().subscribe((res) => {
      const vendidos: Record<string, number> = {};
      res.forEach(r => {
        const nombre = r.productos?.nombre || 'Desconocido';
        vendidos[nombre] = (vendidos[nombre] || 0) + Number(r.cantidad || 0);
      });

      this.productosVendidos = Object.entries(vendidos).map(([nombre, total]) => ({
        name: nombre,
        value: total
      }));

      console.log('[📦 productosVendidos]', this.productosVendidos);
    });

    // 3. Top productos por ingresos
    this.metricasService.obtenerTopProductosPorIngreso().subscribe((res) => {
      const ingresos: Record<string, number> = {};
      res.forEach(r => {
        const nombre = r.productos?.nombre || 'Desconocido';
        const ingreso = (Number(r.precio_unitario) || 0) * (Number(r.cantidad) || 0);
        ingresos[nombre] = (ingresos[nombre] || 0) + ingreso;
      });

      this.topProductosIngresos = Object.entries(ingresos)
        .map(([nombre, total]) => ({ name: nombre, value: total }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);

      console.log('[💰 topProductosIngresos]', this.topProductosIngresos);
    });
  }

  volver(): void {
    this.location.back();
    console.log('⬅️ Regresando a la página anterior');
  }
}
