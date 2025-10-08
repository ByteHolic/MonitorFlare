import { Html } from '@elysiajs/html'

export function AdminLogin() {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Admin Login</title>
        <link href="https://cdn.jsdelivr.net/npm/daisyui@4/dist/full.min.css" rel="stylesheet" />
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body class="bg-base-100">
        <div class="hero min-h-screen">
          <div class="hero-content">
            <div class="card w-96 card-bordered">
              <div class="card-body">
                <h2 class="card-title justify-center mb-6">Admin Login</h2>
                <form id="login-form" class="space-y-4">
                  <div class="form-control">
                    <input 
                      type="text" 
                      name="username" 
                      placeholder="Username" 
                      class="input input-bordered" 
                      required 
                      autocomplete="username"
                    />
                  </div>
                  <div class="form-control">
                    <input 
                      type="password" 
                      name="password" 
                      placeholder="Password" 
                      class="input input-bordered" 
                      required 
                      autocomplete="current-password"
                    />
                  </div>
                  <div id="error" class="alert alert-error hidden">
                    <span id="error-text">Invalid credentials</span>
                  </div>
                  <button type="submit" id="submit-btn" class="btn btn-neutral w-full">Login</button>
                </form>
                <div class="text-xs text-center opacity-60 mt-4">
                  Default: admin / admin123
                </div>
              </div>
            </div>
          </div>
        </div>

        <script>{`
          const BASE = window.location.origin;
          const form = document.getElementById('login-form');
          const errorEl = document.getElementById('error');
          const errorText = document.getElementById('error-text');
          const submitBtn = document.getElementById('submit-btn');
          
          form.onsubmit = async (e) => {
            e.preventDefault();
            
            submitBtn.disabled = true;
            submitBtn.textContent = 'Logging in...';
            errorEl.classList.add('hidden');
            
            try {
              const fd = new FormData(e.target);
              const username = fd.get('username');
              const password = fd.get('password');
              
              const res = await fetch(BASE + '/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
              });
              
              const data = await res.json();
              
              if (res.ok && data.success) {
                const expires = new Date();
                expires.setDate(expires.getDate() + 1);
                
                document.cookie = 'auth=' + data.token + 
                  ';path=/' +
                  ';max-age=86400' +
                  ';SameSite=Lax' +
                  (window.location.protocol === 'https:' ? ';Secure' : '');
                
                setTimeout(() => {
                  window.location.href = '/admin';
                }, 100);
              } else {
                errorText.textContent = data.error || 'Invalid credentials';
                errorEl.classList.remove('hidden');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Login';
              }
            } catch (error) {
              console.error('Login error:', error);
              errorText.textContent = 'Connection error. Please try again.';
              errorEl.classList.remove('hidden');
              submitBtn.disabled = false;
              submitBtn.textContent = 'Login';
            }
          };
        `}</script>
      </body>
    </html>
  );
}
