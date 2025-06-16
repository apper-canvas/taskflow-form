import { motion } from 'framer-motion'

const PriorityFlag = ({ 
  priority = 4, 
  size = 'sm', 
  onClick,
  interactive = false 
}) => {
  const priorities = {
    1: { color: 'bg-priority-1', label: 'P1' },
    2: { color: 'bg-priority-2', label: 'P2' },
    3: { color: 'bg-priority-3', label: 'P3' },
    4: { color: 'bg-priority-4', label: 'P4' }
  }

  const sizes = {
    xs: 'w-2 h-3',
    sm: 'w-3 h-4',
    md: 'w-4 h-5'
  }

  const flag = priorities[priority] || priorities[4]

  const flagElement = (
    <div 
      className={`
        ${sizes[size]} 
        ${flag.color} 
        rounded-sm 
        ${interactive ? 'cursor-pointer hover:opacity-80' : ''}
        priority-flag
      `}
      title={`Priority ${priority}`}
    />
  )

  if (interactive) {
    return (
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onClick}
      >
        {flagElement}
      </motion.div>
    )
  }

  return flagElement
}

export default PriorityFlag