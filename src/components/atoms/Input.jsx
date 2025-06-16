import { forwardRef } from 'react'

const Input = forwardRef(({ 
  type = 'text', 
  placeholder = '', 
  className = '', 
  error = false,
  ...props 
}, ref) => {
  const baseClasses = 'w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary transition-all'
  const errorClasses = error ? 'border-error focus:ring-error' : 'border-surface-300 focus:border-primary'
  
  return (
    <input
      ref={ref}
      type={type}
      placeholder={placeholder}
      className={`${baseClasses} ${errorClasses} ${className}`}
      {...props}
    />
  )
})

Input.displayName = 'Input'

export default Input