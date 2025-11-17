import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Film } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { useGoogleLogin as useGoogleLoginHook } from '@/hooks/auth/useGoogleLogin';

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { handleGoogleSuccess: processGoogleToken, handleGoogleError, isLoading } = useGoogleLoginHook();
  const [isRegister, setIsRegister] = useState(false);
  const [googleError, setGoogleError] = useState<string | null>(null);

  // Login form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Register form states
  const [nickname, setNickname] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isRegister) {
        // Validar que los emails coincidan
        if (registerEmail !== confirmEmail) {
          alert('Los correos no coinciden');
          return;
        }
        // Validar que las contraseñas coincidan
        if (registerPassword !== confirmPassword) {
          alert('Las contraseñas no coinciden');
          return;
        }
        // TODO: Implementar registro cuando backend lo soporte
        alert('Registro aún no implementado. Por favor, usa Google Sign-In');
      } else {
        // TODO: Implementar login con email/password cuando backend lo soporte
        alert('Login con email/password aún no implementado. Por favor, usa Google Sign-In');
      }
      // Navegar al home después de que el login se complete
      // navigate('/home');
    } catch (error) {
      console.error('Auth error:', error);
      alert('Error en la autenticación');
    }
  };

  const onGoogleSuccess = (credentialResponse: any) => {
    console.log('✅ Google login success:', credentialResponse);
    try {
      // Extract JWT token from Google response
      const token = credentialResponse.credential;
      if (token) {
        // Call the hook's handler with the token
        processGoogleToken(token);
        // Navigate to home on success
        navigate('/home');
      } else {
        setGoogleError('No credential received from Google');
      }
    } catch (error) {
      console.error('Error processing Google login:', error);
      setGoogleError('Error logging in with Google');
    }
  };

  const onGoogleError = () => {
    console.error('❌ Google login failed');
    setGoogleError('Failed to login with Google. Please try again.');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-3 xs:px-4 sm:px-6 py-6 xs:py-8">
      <div className="w-full max-w-xs xs:max-w-sm sm:max-w-md overflow-y-auto">
        {/* Logo */}
        <div className="flex flex-col items-center mb-4 xs:mb-6 sm:mb-8">
          <div className="w-14 xs:w-20 h-14 xs:h-20 bg-gradient-primary rounded-3xl flex items-center justify-center mb-2 xs:mb-4 shadow-lg">
            <Film className="w-8 xs:w-12 h-8 xs:h-12 text-white" />
          </div>
          <h1 className="text-xl xs:text-3xl sm:text-4xl font-bold mb-1 text-center">FILM-MATCH</h1>
          <p className="text-gray-400 text-xs sm:text-base text-center">Desliza. Matchea. Mira.</p>
        </div>

        {/* Form Card */}
        <div className="card">
          {/* Google Sign-In Button */}
          <div className="flex justify-center mb-3 xs:mb-6">
            <GoogleLogin
              onSuccess={onGoogleSuccess}
              onError={onGoogleError}
              useRefreshToken
              locale="es_ES"
            />
          </div>

          {/* Error message if Google login failed */}
          {googleError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-lg mb-3 xs:mb-6 text-xs xs:text-sm">
              {googleError}
            </div>
          )}

          {/* Divider */}
          <div className="flex items-center my-3 xs:my-6">
            <div className="flex-1 border-t border-gray-700"></div>
            <div className="px-2 xs:px-4 text-gray-500 text-xs xs:text-sm">o</div>
            <div className="flex-1 border-t border-gray-700"></div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} className="space-y-3 xs:space-y-4">
            {isRegister ? (
              <>
                {/* Register Form */}
                <div>
                  <label className="block text-xs xs:text-sm font-medium mb-1.5 xs:mb-2">Apodo</label>
                  <input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="Tu apodo"
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs xs:text-sm font-medium mb-1.5 xs:mb-2">Correo Electrónico</label>
                  <input
                    type="email"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    placeholder="tu@ejemplo.com"
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs xs:text-sm font-medium mb-1.5 xs:mb-2">Confirmar Correo</label>
                  <input
                    type="email"
                    value={confirmEmail}
                    onChange={(e) => setConfirmEmail(e.target.value)}
                    placeholder="tu@ejemplo.com"
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs xs:text-sm font-medium mb-1.5 xs:mb-2">Contraseña</label>
                  <input
                    type="password"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    placeholder="••••••••"
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs xs:text-sm font-medium mb-1.5 xs:mb-2">Confirmar Contraseña</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="input-field"
                    required
                  />
                </div>
              </>
            ) : (
              <>
                {/* Login Form */}
                <div>
                  <label className="block text-xs xs:text-sm font-medium mb-1.5 xs:mb-2">Correo Electrónico</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@ejemplo.com"
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs xs:text-sm font-medium mb-1.5 xs:mb-2">Contraseña</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="input-field"
                    required
                  />
                </div>
              </>
            )}

            <button type="submit" className="w-full btn-primary mt-3 xs:mt-6 py-2 text-xs xs:text-sm sm:text-base rounded-lg xs:rounded-xl">
              {isRegister ? 'Registrarse' : 'Iniciar Sesión'}
            </button>
          </form>

          {/* Toggle Register/Login */}
          <div className="text-center mt-3 xs:mt-6">
            <span className="text-gray-400 text-xs xs:text-sm">
              {isRegister ? '¿Ya tienes cuenta?' : "¿No tienes cuenta?"}{' '}
            </span>
            <button
              onClick={() => setIsRegister(!isRegister)}
              className="text-primary-purple hover:underline font-semibold text-xs xs:text-sm"
            >
              {isRegister ? 'Iniciar Sesión' : 'Registrarse'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
