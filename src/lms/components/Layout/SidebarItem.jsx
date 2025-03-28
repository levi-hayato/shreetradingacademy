

const SidebarItem = ({ icon, text, active, collapsed }) => {
    return (
      <button
      onClick={() => {
        navigate(path);
      }}
        className={`w-[95%] flex items-center p-3 mx-2 rounded-lg transition-colors ${
          active ? 'bg-indigo-50 text-indigo-600 font-medium' : 'hover:bg-gray-50 text-gray-600'
        }`}
      >
        <span className="text-lg">{icon}</span>
        {!collapsed && <span className="ml-3">{text}</span>}
      </button>
    );
  };
  
  export default SidebarItem;