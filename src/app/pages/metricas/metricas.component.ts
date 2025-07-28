import { Component, OnInit } from '@angular/core';
import { MetricasService } from '../../services/metricas.service';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { Location } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-metricas',
  templateUrl: './metricas.component.html',
  styleUrls: ['./metricas.component.scss'],
  imports: [NgxChartsModule],
})
export class MetricasComponent implements OnInit {
  productosPorCategoria: any[] = [];
  productosVendidos: any[] = [];
  topProductosIngresos: any[] = [];

  view: [number, number] = [600, 300];

  constructor(
    private metricasService: MetricasService,
    private location: Location
  ) {}

  ngOnInit(): void {
    // 1. Agrupar productos por nombre de categoría
    this.metricasService.obtenerProductosPorCategoria().subscribe((res) => {
      console.log('📥 [Productos por Categoría - Raw]', res);

      const agrupado: Record<string, number> = {};
      res.forEach((p) => {
        const nombre = p.categorias?.nombre?.trim() || 'Sin categoría';
        agrupado[nombre] = (agrupado[nombre] || 0) + 1;
      });

      this.productosPorCategoria = Object.entries(agrupado).map(
        ([nombre, count]) => ({
          name: nombre,
          value: count,
        })
      );

      console.log('📊 [Procesado] productosPorCategoria:', this.productosPorCategoria);
    });

    // 2. Agrupar productos vendidos por nombre
    this.metricasService.obtenerCantidadVendidaPorProducto().subscribe((res) => {
      console.log('📥 [Productos vendidos - Raw]', res);

      const vendidos: Record<string, number> = {};
      res.forEach((r) => {
        const nombre = r.productos?.nombre?.trim() || 'Desconocido';
        vendidos[nombre] = (vendidos[nombre] || 0) + Number(r.cantidad || 0);
      });

      this.productosVendidos = Object.entries(vendidos).map(
        ([nombre, total]) => ({
          name: nombre,
          value: total,
        })
      );

      console.log('📦 [Procesado] productosVendidos:', this.productosVendidos);
    });

    // 3. Agrupar ingresos por producto (cantidad * precio_unitario)
    this.metricasService.obtenerTopProductosPorIngreso().subscribe((res) => {
      console.log('📥 [Top productos por ingresos - Raw]', res);

      const ingresos: Record<string, number> = {};

      res.forEach((r) => {
        const nombre = r.productos?.nombre?.trim() || 'Desconocido';
        const ingreso = (Number(r.precio_unitario) || 0) * (Number(r.cantidad) || 0);
        ingresos[nombre] = (ingresos[nombre] || 0) + ingreso;
      });

      this.topProductosIngresos = Object.entries(ingresos)
        .map(([nombre, total]) => ({
          name: nombre,
          value: Number(total.toFixed(2)),
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);

      console.log('💰 [Procesado] topProductosIngresos:', this.topProductosIngresos);
    });
  }

  volver(): void {
    this.location.back();
    console.log('⬅️ Regresando a la página anterior');
  }

  formatearEtiqueta = (label: string): string =>
    label.length > 20 ? label.slice(0, 20) + '…' : label;
}
