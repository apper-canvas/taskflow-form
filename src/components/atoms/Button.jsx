import { motion } from 'framer-motion'

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  disabled = false, 
  className = '', 
  onClick,
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
  
  const variants = {
    primary: 'bg-primary text-white hover:bg-accent disabled:bg-gray-300',
    secondary: 'bg-surface-100 text-gray-700 hover:bg-surface-200 border border-surface-300',
    ghost: 'text-gray-600 hover:bg-surface-100 hover:text-gray-900',
    danger: 'bg-error text-white hover:bg-red-600'
  }
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  }

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.button>
  )
}

export default Button