import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
})
export class AvatarComponent {
  @ViewChild('avatarSvg', { static: true }) avatarSvgRef!: ElementRef<SVGElement>;

  private colorActual = '#F5023F'; // Inicialmente el color base (rojo)

  cambiarColorRopa(nuevoColor: string): void {
    const svgElement = this.avatarSvgRef.nativeElement;

    // Selecciona todos los elementos con el color actual
    const paths = svgElement.querySelectorAll(`[fill="${this.colorActual}"]`);
    paths.forEach(path => path.setAttribute('fill', nuevoColor));

    // Actualiza el color actual
    this.colorActual = nuevoColor;
  }
}
