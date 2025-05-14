<div className={`card ${className}`}>
  <div className="flex justify-between items-start">
    {/* Left Section: Title + Value */}
    <div className="flex flex-col items-start">
      <p className="text-neutral-500 text-sm">{title}</p>
      <span className="text-2xl font-bold mt-2">{value}</span>

      {trend && (
        <div className="flex items-center mt-2">
          <div 
            className={`flex items-center text-xs font-medium ${
              trend.isPositive ? 'text-success-600' : 'text-error-600'
            }`}
          >
            <svg
              className={`w-3 h-3 mr-1 ${!trend.isPositive && 'transform rotate-180'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              ></path>
            </svg>
            {trend.value}%
          </div>
          <span className="text-xs text-neutral-500 ml-1.5">{trend.label}</span>
        </div>
      )}
    </div>

    {/* Right Section: Icon */}
    <div className="p-2 rounded-md bg-primary-50 text-primary-500 flex-shrink-0 ml-2">
      {icon}
    </div>
  </div>
</div>
