import { HttpInterceptorFn } from "@angular/common/http";

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {

  console.log('🚀 JWT Interceptor triggered');
  console.log('➡️ URL:', req.url);

  // Skip login
  if (req.url.includes('/Auth/login')) {
    console.log('🔑 Login request → skipping token');
    return next(req);
  }

  const token = localStorage.getItem('token');
  console.log('🧾 Token from localStorage:', token);

  if (!token) {
    console.log('❌ No token found → request sent without Authorization');
    return next(req);
  }

  const clonedReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  console.log('✅ Authorization header added:', clonedReq.headers.get('Authorization'));

  return next(clonedReq);
};
