import { motion } from 'framer-motion'

const SkeletonLoader = ({ count = 3, type = 'task' }) => {
  const skeletonVariants = {
    initial: { opacity: 0.4 },
    animate: { opacity: 1 },
  }

  const staggerTransition = (index) => ({
    delay: index * 0.1,
    duration: 0.6,
    repeat: Infinity,
    repeatType: "reverse"
  })

  if (type === 'task') {
    return (
      <div className="space-y-3">
        {[...Array(count)].map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white border border-surface-200 rounded p-3"
          >
            <div className="flex items-start space-x-3">
              <motion.div
                variants={skeletonVariants}
                initial="initial"
                animate="animate"
                transition={staggerTransition(index)}
                className="w-5 h-5 bg-surface-300 rounded flex-shrink-0 mt-0.5"
              />
              
              <div className="flex-1 space-y-2">
                <motion.div
                  variants={skeletonVariants}
                  initial="initial"
                  animate="animate"
                  transition={staggerTransition(index + 0.2)}
                  className="h-4 bg-surface-300 rounded w-3/4"
                />
                <motion.div
                  variants={skeletonVariants}
                  initial="initial"
                  animate="animate"
                  transition={staggerTransition(index + 0.4)}
                  className="h-3 bg-surface-200 rounded w-1/3"
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    )
  }

  if (type === 'project') {
    return (
      <div className="space-y-2">
        {[...Array(count)].map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center space-x-2 px-3 py-2"
          >
            <motion.div
              variants={skeletonVariants}
              initial="initial"
              animate="animate"
              transition={staggerTransition(index)}
              className="w-4 h-4 bg-surface-300 rounded"
            />
            <motion.div
              variants={skeletonVariants}
              initial="initial"
              animate="animate"
              transition={staggerTransition(index + 0.2)}
              className="w-3 h-3 bg-surface-300 rounded"
            />
            <motion.div
              variants={skeletonVariants}
              initial="initial"
              animate="animate"
              transition={staggerTransition(index + 0.4)}
              className="h-4 bg-surface-300 rounded flex-1"
            />
          </motion.div>
        ))}
      </div>
    )
  }

  return null
}

export default SkeletonLoader