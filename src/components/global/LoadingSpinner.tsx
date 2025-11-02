interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  color?: string
  fullScreen?: boolean
  message?: string
}

export const LoadingSpinner = ({ size = 'md', color = '#03034D', fullScreen = false, message }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-16 h-16 border-4',
    xl: 'w-24 h-24 border-[5px]',
  }

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`${sizeClasses[size]} rounded-full border-t-transparent animate-spin`}
        style={{
          borderColor: `${color}40`,
          borderTopColor: color,
        }}
        role="status"
        aria-label="Loading"
      />
      {message && (
        <p className="text-sm text-[#858585] font-medium animate-pulse">
          {message}
        </p>
      )}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
        {spinner}
      </div>
    )
  }

  return spinner
}