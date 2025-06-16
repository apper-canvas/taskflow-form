import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const ErrorState = ({ 
  message = 'Something went wrong', 
  onRetry,
  retryLabel = 'Try Again' 
}) => {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="text-center py-12 px-4"
    >
      <div className="mb-6">
        <ApperIcon 
          name="AlertCircle" 
          size={48} 
          className="text-error mx-auto" 
        />
      </div>
      
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        Oops! Something went wrong
      </h3>
      
      <p className="text-gray-500 mb-6 max-w-md mx-auto">
        {message}
      </p>
      
      {onRetry && (
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button onClick={onRetry} variant="primary">
            <ApperIcon name="RefreshCw" size={16} className="mr-2" />
            {retryLabel}
          </Button>
        </motion.div>
      )}
    </motion.div>
  )
}

export default ErrorState