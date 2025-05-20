import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Todos os campos são obrigatórios');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Credenciais inválidas. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-dark-900 dark:to-dark-800 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <svg
            viewBox="0 0 24 24"
            width="48"
            height="48"
            className="text-cyan-600 dark:text-cyan-500"
            fill="currentColor"
            stroke="none"
          >
            <path d="M12 0C9.97 0 7.94 0.31 6.44 1C4.94 1.69 4 2.61 4 3.65V4.09C3.14 4.93 2 6.53 2 9.04C2 12.48 2.97 15.75 5.22 18C7.47 20.25 10.63 21.45 12 21.45C13.37 21.45 16.53 20.25 18.78 18C21.03 15.75 22 12.48 22 9.04C22 6.53 20.86 4.93 20 4.09V3.65C20 2.61 19.06 1.69 17.56 1C16.06 0.31 14.03 0 12 0ZM12 2C13.71 2 15.39 2.27 16.56 2.81C17.73 3.35 18 3.95 18 3.97C18 3.97 18 3.97 18 3.97V4C18 4.12 17.91 4.61 17.09 5.09C15.95 5.83 14.08 6 12 6C9.92 6 8.05 5.83 6.91 5.09C6.09 4.61 6 4.12 6 4V3.97C6 3.95 6.27 3.35 7.44 2.81C8.61 2.27 10.29 2 12 2ZM12 8C14.08 8 15.95 7.83 17.09 7.09C17.91 6.61 18 6.12 18 6V6.03C18 6.05 17.73 6.65 16.56 7.19C15.39 7.73 13.71 8 12 8C10.29 8 8.61 7.73 7.44 7.19C6.27 6.65 6 6.05 6 6.03V6C6 6.12 6.09 6.61 6.91 7.09C8.05 7.83 9.92 8 12 8Z"/>
          </svg>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">
          DentClinic
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Sistema de Gerenciamento para Clínicas Odontológicas
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-dark-800 py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-md bg-red-50 dark:bg-red-900/50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400 dark:text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800 dark:text-red-200">{error}</h3>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                E-mail
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                  placeholder="email@exemplo.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Senha
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="form-checkbox"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                  Lembrar-me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-cyan-600 hover:text-cyan-500 dark:text-cyan-500 dark:hover:text-cyan-400">
                  Esqueceu a senha?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full btn btn-primary ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isLoading ? 'Entrando...' : 'Entrar'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-dark-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-dark-800 text-gray-500 dark:text-gray-400">
                  Ou continue com
                </span>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-dark-700 hover:bg-gray-50 dark:hover:bg-dark-600">
                <img src="https://www.google.com/favicon.ico" alt="Google" className="h-5 w-5 mr-2" />
                Continuar com o Google
              </button>

              <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-dark-700 hover:bg-gray-50 dark:hover:bg-dark-600">
                <img src="https://www.microsoft.com/favicon.ico" alt="Microsoft" className="h-5 w-5 mr-2" />
                Continuar com a conta Microsoft
              </button>

              <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-dark-700 hover:bg-gray-50 dark:hover:bg-dark-600">
                <img src="https://www.apple.com/favicon.ico" alt="Apple" className="h-5 w-5 mr-2" />
                Continuar com a Apple
              </button>

              <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-dark-700 hover:bg-gray-50 dark:hover:bg-dark-600">
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Continuar com o telefone
              </button>
            </div>
          </div>

          <div className="mt-6 flex justify-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
            <a href="#" className="hover:text-cyan-500">Termos de uso</a>
            <span>|</span>
            <a href="#" className="hover:text-cyan-500">Política de privacidade</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;