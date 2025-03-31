export default function ErrorMessage({ message, fullHeight = true }) {
    return (
      <div className={`flex items-center justify-center ${fullHeight ? 'min-h-[calc(100vh-100px)]' : ''}`}>
        <div className="text-center p-6 max-w-md bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-700">{message}</p>
        </div>
      </div>
    );
  }