import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Checkbox = ({ 
  checked = false, 
  onChange, 
  disabled = false, 
  className = '',
  size = 'md'
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16
  }

  return (
    <motion.button
      type="button"
      onClick={() => !disabled && onChange?.(!checked)}
      disabled={disabled}
      className={`
        ${sizes[size]} 
        border-2 rounded flex items-center justify-center transition-all
        ${checked 
          ? 'bg-success border-success text-white' 
          : 'border-surface-400 hover:border-surface-500 bg-white'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      whileHover={!disabled ? { scale: 1.1 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      animate={checked ? { scale: [1, 1.2, 1] } : {}}
      transition={{ duration: 0.3, type: "spring" }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ 
          opacity: checked ? 1 : 0, 
          scale: checked ? 1 : 0 
        }}
        transition={{ duration: 0.2 }}
      >
        <ApperIcon name="Check" size={iconSizes[size]} />
      </motion.div>
    </motion.button>
  )
}

export default Checkbox