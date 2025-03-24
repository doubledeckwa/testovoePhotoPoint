import { Link } from 'react-router-dom';

export const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 py-8">
      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <div className="w-24 h-1 bg-gray-800 mb-6"></div>
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Страница не найдена</h2>
      <p className="text-gray-600 text-center mb-8 max-w-md">
        Извините, но страница, которую вы ищете, не существует или была перемещена.
      </p>
      <Link 
        to="/" 
        className="px-6 py-3 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors duration-300 flex items-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Вернуться на главную
      </Link>
    </div>
  );
};

export default NotFound;
