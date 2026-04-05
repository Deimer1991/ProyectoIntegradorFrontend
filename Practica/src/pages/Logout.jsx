import { useNavigate } from 'react-router-dom';

export const Logout = () => {

    const navigate = useNavigate();

     const handleLogin = (e) => {
    e.preventDefault();
    
    navigate('/login'); 
    
    };
    
     const handleDashboard = (e) => {
    e.preventDefault();
    
    navigate('/dashboard'); 
  };

  return (
    <main className="flex-grow flex items-center justify-center px-4">
      <section className="bg-white p-8 rounded-lg shadow-md max-w-md text-center">
        <h1 className="text-3xl font-semibold mb-4 text-blue-700">
          Gracias por visitar nuestro portal de notas
        </h1>
        <p className="text-gray-700 text-lg">
          Has cerrado sesión del Sistema de Notas del CESDE.
        </p>

        <div className="flex justify-center items-center">
          <button 
            type="button" 
            onClick={handleLogin}
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md
            hover:bg-blue-700 hover:shadow-lg
            focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1
            transition duration-300 ease-in-out">
                Iniciar sesion
          </button>

          <button 
            type="button" 
            onClick={handleDashboard}
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md
            hover:bg-blue-700 hover:shadow-lg
            focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1
            transition duration-300 ease-in-out">
               Ir al dashboard
          </button>
        </div>
      </section>
    </main>
  )
}
