export const FormInput = ({ label, register, name, placeholder, isTextArea }) => (
  <div className="flex flex-col gap-1.5 mb-4 group">
    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] ml-1 group-focus-within:text-blue-600 transition-colors">
      {label}
    </label>
    {isTextArea ? (
      <textarea
        {...register(name)}
        placeholder={placeholder}
        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all outline-none min-h-[120px] text-sm resize-none"
      />
    ) : (
      <input
        {...register(name)}
        placeholder={placeholder}
        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all outline-none text-sm"
      />
    )}
  </div>
);