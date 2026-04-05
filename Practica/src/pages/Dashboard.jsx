import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export const Dashboard = () => {

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    
    navigate('/login'); 
    
    };

  return (

    
     <div className="flex flex-1">
      
      <aside
        className="w-64 bg-blue-800 text-white p-6 border border-white rounded-2xl hidden md:flex flex-col justify-between"
      >
        
        <div className="flex justify-center mb-6">
          <img
            alt="Menú"
            className="w-23 h-23"
          />
        </div>

        
        <nav className="flex-1 flex flex-col justify-between">
          <ul
            className="flex-1 flex flex-col justify-evenly text-lg font-semibold space-y-2"
          >
            <li className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-white-300"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  d="M10 2a6 6 0 00-6 6v1H3a1 1 0 000 2h1v4a2 2 0 002 2h8a2 2 0 002-2v-4h1a1 1 0 100-2h-1V8a6 6 0 00-6-6z"
                />
              </svg>
              <Link to="/login">
          Logeo
        </Link>
            </li>
            <li className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-white-300"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  d="M2 10a8 8 0 1116 0A8 8 0 012 10zm8 4a1 1 0 100-2 1 1 0 000 2zM9 9V5a1 1 0 112 0v4a1 1 0 01-2 0z"
                />
              </svg>
              <Link to="/login">
          Registro
        </Link>
            </li>
            <li className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-white-300"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 6a1 1 0 011-1h4a1 1 0 011 1v6H4a1 1 0 01-1-1v-5zm6 0h7a1 1 0 011 1v5a1 1 0 01-1 1h-7v-6z"
                />
              </svg>
              <Link to="/login">
          Cambio de contraseña
        </Link>
            </li>
            <li className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-white-300"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  d="M10 3a1 1 0 011 1v1h6a1 1 0 011 1v1h-8v2h8v1a1 1 0 01-1 1h-6v1a1 1 0 01-2 0V4a1 1 0 011-1z"
                />
              </svg>
             <Link to="/login">
          Administrador
        </Link>
            </li>
            <li className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-white-300"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  d="M10 2a6 6 0 00-6 6v2H3a1 1 0 000 2h1v4h12v-4h1a1 1 0 100-2h-1V8a6 6 0 00-6-6z"
                />
              </svg>
              <Link to="/login ">
          Perfil de profesores
        </Link>
            </li>
            <li className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-white-300"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  d="M4 3a1 1 0 00-1 1v2a1 1 0 001 1v10a1 1 0 001 1h10a1 1 0 001-1V7a1 1 0 001-1V4a1 1 0 00-1-1H4zm1 6h10v8H5V9z"
                />
              </svg>
              <Link to="/login ">
          Grupo de estudiantes
        </Link>
            </li>
            <li className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-white-300"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  d="M11 2a1 1 0 00-1 1v1H5a1 1 0 00-1 1v10h12V5a1 1 0 00-1-1h-5V3a1 1 0 00-1-1z"
                />
              </svg>
             <Link to="/login ">
          Perfil de estudiante
        </Link>
            </li>
            <li className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-white-300"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  d="M4.293 6.707a1 1 0 011.414 0L10 11.586l4.293-4.879a1 1 0 111.414 1.414l-5 5.678a1 1 0 01-1.414 0l-5-5.678a1 1 0 010-1.414z"
                />
              </svg>
              <Link to="/salir ">
          Salir
        </Link>
            </li>
          </ul>
        </nav>
      </aside>

     
      <div className="flex-1 p-6">
        
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-700">
            Sistema de Notas CESDE
          </h1>
          <p className="text-gray-700">Gestión académica eficiente</p>
        </header>

        
        <section
          className="bg-white p-4 rounded-lg shadow mb-6 flex flex-wrap gap-4"
        >
          <div className="flex items-center gap-2">
            <label htmlFor="periodo" className="font-semibold">Periodo:</label>
            <select id="periodo" className="border border-gray-300 rounded p-1">
              <option value="2025-1">2025-1</option>
              <option value="2025-2">2025-2</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="grupo" className="font-semibold">Grupo:</label>
            <select id="grupo" className="border border-gray-300 rounded p-1">
              <option value="G1">G1</option>
              <option value="G2">G2</option>
            </select>
          </div>
        </section>

        
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <h2 className="text-2xl font-bold text-blue-700">35</h2>
            <p className="text-gray-600">Estudiantes</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <h2 className="text-2xl font-bold text-blue-700">4.2</h2>
            <p className="text-gray-600">Promedio General</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <h2 className="text-2xl font-bold text-blue-700">7</h2>
            <p className="text-gray-600">Inasistencias</p>
          </div>
        </section>

        
        <section className="overflow-x-auto mb-6">
          <table
            className="min-w-full bg-white shadow text-sm rounded-xl overflow-hidden"
          >
            <thead className="bg-blue-700 text-white">
              <tr className="rounded-t-xl">
                <th className="p-2">Nombre</th>
                <th className="p-2">Identificación</th>
                <th className="p-2">Momento 1</th>
                <th className="p-2">Momento 2</th>
                <th className="p-2">Momento 3</th>
                <th className="p-2">Final</th>
                <th className="p-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b hover:bg-gray-100">
                <td className="p-2 text-center">Juan Pérez</td>
                <td className="p-2 text-center">123456789</td>
                <td className="p-2 text-center">4.5</td>
                <td className="p-2 text-center">4.8</td>
                <td className="p-2 text-center">5.0</td>
                <td className="p-2 text-center">4.8</td>
                <td className="p-2 text-center">
                  <button
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    Editar
                  </button>
                </td>
              </tr>
              <tr className="border-b hover:bg-gray-100">
                <td className="p-2 text-center">Camilo Mendoza</td>
                <td className="p-2 text-center">1234654329</td>
                <td className="p-2 text-center">3.5</td>
                <td className="p-2 text-center">4.8</td>
                <td className="p-2 text-center">5.0</td>
                <td className="p-2 text-center">4.4</td>
                <td className="p-2 text-center">
                  <button
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    Editar
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-gray-100 rounded-b-xl">
                <td className="p-2 text-center">Juan Pérez</td>
                <td className="p-2 text-center">123456789</td>
                <td className="p-2 text-center">3.0</td>
                <td className="p-2 text-center">4.5</td>
                <td className="p-2 text-center">5.0</td>
                <td className="p-2 text-center">4.0</td>
                <td className="p-2 text-center">
                  <button
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    Editar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        
        <section className="flex flex-wrap gap-4">
          <button
            className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700"
          >
            Agregar Estudiante
          </button>

          <button 
            type="button" 
            onClick={handleLogin}
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md
            hover:bg-blue-700 hover:shadow-lg
            focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1
            transition duration-300 ease-in-out">
               Ir al Login
          </button>
        </section>
      </div>
    </div>
  )
}
