export const SectionWrapper = ({ title, icon: Icon, children, onAdd }) => (
  <div className="mb-8 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex justify-between items-center mb-6">
      <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
        <Icon className="text-blue-500" /> {title}
      </h3>
      {onAdd && (
        <button 
          onClick={onAdd}
          className="text-sm bg-blue-50 text-blue-600 font-semibold px-4 py-2 rounded-xl hover:bg-blue-100 transition-all"
        >
          + Add
        </button>
      )}
    </div>
    {children}
  </div>
);