import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../environments/environments';

export const SupabaseInterceptor: HttpInterceptorFn = (req, next) => {
  const SUPABASE_URL = environment.supabaseUrl;
  const SUPABASE_API_KEY = environment.supabaseKey;

  if (req.url.startsWith(SUPABASE_URL)) {
    const modified = req.clone({
      setHeaders: {
        apikey: SUPABASE_API_KEY,
        Authorization: `Bearer ${SUPABASE_API_KEY}`,
      },
    });
    return next(modified);
  }

  return next(req);
};
