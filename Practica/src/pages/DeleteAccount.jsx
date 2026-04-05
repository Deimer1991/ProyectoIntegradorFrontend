import { Link } from 'react-router-dom';

export const DeleteAccount = () => {
  return (
    <main
      className="flex-grow flex flex-col items-center justify-center text-center px-4"
    >
      <h1 className="text-5xl font-semibold text-black mb-4">
        Fue un placer que nos acompañaras durante tu camino de aprendizaje en el
        CESDE
      </h1>
      <h2 className="text-3xl text-gray-700">¡Hasta pronto!</h2>

      <Link to="/login">
          Ir al Login
        </Link>
    </main>

    
  )
}
