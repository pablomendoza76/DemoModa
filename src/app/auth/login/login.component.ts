import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  usuario: any = null;
  credenciales = { email: '', password: '' };

  // 🧭 Guardamos la ruta previa para redireccionar después del login
  private redirectUrl: string = '/inicio';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.usuario = this.authService.obtenerUsuarioLocal();

    // ⚠️ Captura el parámetro 'redirect' desde la URL si existe
    const redirect = this.route.snapshot.queryParamMap.get('redirect');
    if (redirect) {
      this.redirectUrl = redirect;
    }
  }

  login(): void {
    this.authService.loginConGoogle();
  }

  logout(): void {
    this.authService.logout();
    this.usuario = null;
    localStorage.removeItem('usuario');
  }

  async loginConCredenciales(): Promise<void> {
    try {
      const { user } = await this.authService.loginConCredenciales(
        this.credenciales.email,
        this.credenciales.password
      );

      this.usuario = user;
      localStorage.setItem('usuario', JSON.stringify(user));

      // ✅ Redirige a la página original
      this.router.navigateByUrl(this.redirectUrl);
    } catch (error: any) {
      alert('Error al iniciar sesión: ' + error.message);
    }
  }
}
