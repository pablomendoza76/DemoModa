import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, Session } from '@supabase/supabase-js';
import { environment } from '../environments/environments';

@Injectable({ providedIn: 'root' })
export class AuthService {
 private supabase!: SupabaseClient;

  private STORAGE_KEY = 'sesion_usuario';

  constructor() {
  if (typeof window !== 'undefined') {
    // Solo importamos y creamos el cliente en el navegador
    import('@supabase/supabase-js').then(({ createClient }) => {
      this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);

      this.supabase.auth.onAuthStateChange((_event, session) => {
        if (session) {
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify({ user: session.user }));
        } else {
          localStorage.removeItem(this.STORAGE_KEY);
        }
      });
    });
  }
}


  /**
   * Inicia sesión con Google
   */
  async loginConGoogle(): Promise<void> {
    const { error } = await this.supabase.auth.signInWithOAuth({ provider: 'google' });
    if (error) throw error;
  }

  /**
   * Inicia sesión desde tabla personalizada
   */
  async loginConCredenciales(email: string, password: string): Promise<{ user: any }> {
    const { data, error } = await this.supabase
      .from('usuarios')
      .select('*')
      .eq('correo', email)
      .eq('contrasena', password)
      .single();

    if (error || !data) throw new Error('Credenciales inválidas');

    if (typeof window !== 'undefined') {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify({ user: data }));
    }

    return { user: data };
  }

  /**
   * Cierra sesión
   */
  async logout(): Promise<void> {
    await this.supabase.auth.signOut();
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.STORAGE_KEY);
    }
  }

  /**
   * Obtener sesión actual
   */
  async obtenerSesion(): Promise<Session | null> {
    const { data } = await this.supabase.auth.getSession();
    return data.session;
  }

  /**
   * Obtener usuario desde localStorage
   */
  obtenerUsuarioLocal(): any | null {
    if (typeof window === 'undefined') return null;

    const sesion = localStorage.getItem(this.STORAGE_KEY);
    if (!sesion) return null;

    try {
      const parsed = JSON.parse(sesion);
      return parsed.user;
    } catch {
      return null;
    }
  }

  /**
   * Llamar manualmente para sincronizar sesión si hace falta
   */
  async restaurarSesion(): Promise<void> {
    if (typeof window === 'undefined') return;

    const { data } = await this.supabase.auth.getSession();
    if (data.session) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify({ user: data.session.user }));
    }
  }

  /**
   * Escuchar cambios de sesión
   */
  escucharCambioSesion(callback: () => void) {
  if (typeof window === 'undefined') return;

  this.supabase.auth.onAuthStateChange(() => {
    callback();
  });
}

}
