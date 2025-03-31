export default function LoadingSpinner({ fullHeight = true }) {
    return (
      <div className={`flex items-center justify-center ${fullHeight ? 'min-h-[calc(100vh-100px)]' : ''}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }