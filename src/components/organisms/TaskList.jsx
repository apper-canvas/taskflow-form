import { motion, AnimatePresence } from 'framer-motion'
import TaskItem from '@/components/molecules/TaskItem'
import EmptyState from '@/components/molecules/EmptyState'

const TaskList = ({ 
  tasks = [], 
  onTaskUpdate, 
  onTaskDelete, 
  showProject = false,
  emptyState = null 
}) => {
  const handleTaskUpdate = (taskId, updates) => {
    onTaskUpdate?.(taskId, updates)
  }

  const handleTaskDelete = (taskId) => {
    onTaskDelete?.(taskId)
  }

  if (tasks.length === 0 && emptyState) {
    return emptyState
  }

  return (
    <div className="space-y-2">
      <AnimatePresence mode="popLayout">
        {tasks.map((task, index) => (
          <motion.div
            key={task.Id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ 
              duration: 0.2,
              delay: index * 0.05,
              layout: { duration: 0.3 }
            }}
          >
            <TaskItem
              task={task}
              onTaskUpdate={handleTaskUpdate}
              onTaskDelete={handleTaskDelete}
              showProject={showProject}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

export default TaskList