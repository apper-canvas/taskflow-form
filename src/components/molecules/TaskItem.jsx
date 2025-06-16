import { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import Checkbox from '@/components/atoms/Checkbox'
import PriorityFlag from '@/components/atoms/PriorityFlag'
import ApperIcon from '@/components/ApperIcon'
import { taskService } from '@/services'
import { format, isToday, isPast, parseISO } from 'date-fns'

const TaskItem = ({ 
  task, 
  onTaskUpdate, 
  onTaskDelete,
  showProject = false 
}) => {
  const [isCompleting, setIsCompleting] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(task.title)

  const handleComplete = async () => {
    if (isCompleting) return
    
    setIsCompleting(true)
    try {
      await taskService.complete(task.Id)
      
      // Show completion animation
      setTimeout(() => {
        onTaskUpdate?.(task.Id, { completed: true })
        toast.success('Task completed!')
      }, 300)
    } catch (error) {
      toast.error('Failed to complete task')
      console.error('Error completing task:', error)
    } finally {
      setIsCompleting(false)
    }
  }

  const handleEdit = async () => {
    if (editTitle.trim() === '') {
      setEditTitle(task.title)
      setIsEditing(false)
      return
    }

    if (editTitle.trim() === task.title.trim()) {
      setIsEditing(false)
      return
    }

    try {
      await taskService.update(task.Id, { title: editTitle.trim() })
      onTaskUpdate?.(task.Id, { title: editTitle.trim() })
      setIsEditing(false)
      toast.success('Task updated')
    } catch (error) {
      toast.error('Failed to update task')
      setEditTitle(task.title)
      setIsEditing(false)
    }
  }

  const handleDelete = async () => {
    try {
      await taskService.delete(task.Id)
      onTaskDelete?.(task.Id)
      toast.success('Task deleted')
    } catch (error) {
      toast.error('Failed to delete task')
    }
  }

  const formatDueDate = (dueDate) => {
    if (!dueDate) return null
    
    const date = parseISO(dueDate)
    const today = new Date()
    
    if (isToday(date)) return 'Today'
    if (isPast(date)) return `Overdue ${format(date, 'MMM d')}`
    return format(date, 'MMM d')
  }

  const getDueDateColor = (dueDate) => {
    if (!dueDate) return 'text-gray-500'
    
    const date = parseISO(dueDate)
    if (isPast(date) && !isToday(date)) return 'text-error'
    if (isToday(date)) return 'text-warning'
    return 'text-gray-500'
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ 
        opacity: task.completed ? 0.6 : 1, 
        y: 0,
        scale: isCompleting ? 0.98 : 1
      }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      transition={{ duration: 0.2 }}
      className={`
        group bg-white border border-surface-200 rounded p-3 
        task-item transition-all duration-150
        ${task.completed ? 'opacity-60' : 'hover:shadow-sm'}
      `}
    >
      <div className="flex items-start space-x-3">
        <Checkbox
          checked={task.completed}
          onChange={handleComplete}
          disabled={isCompleting}
          className="mt-0.5 flex-shrink-0"
        />
        
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={handleEdit}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleEdit()
                if (e.key === 'Escape') {
                  setEditTitle(task.title)
                  setIsEditing(false)
                }
              }}
              className="w-full text-sm font-medium text-gray-900 bg-transparent border-none outline-none focus:ring-0 p-0"
              autoFocus
            />
          ) : (
            <h3 
              className={`text-sm font-medium cursor-pointer break-words ${
                task.completed ? 'line-through text-gray-500' : 'text-gray-900'
              }`}
              onClick={() => setIsEditing(true)}
            >
              {task.title}
            </h3>
          )}
          
          <div className="flex items-center space-x-2 mt-1">
            {task.priority < 4 && (
              <PriorityFlag priority={task.priority} size="xs" />
            )}
            
            {task.dueDate && (
              <span className={`text-xs ${getDueDateColor(task.dueDate)}`}>
                {formatDueDate(task.dueDate)}
              </span>
            )}
            
            {showProject && task.projectId && (
              <span className="text-xs text-gray-500">
                Project {task.projectId}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setIsEditing(true)}
            className="p-1 text-gray-400 hover:text-gray-600 rounded"
            title="Edit task"
          >
            <ApperIcon name="Edit2" size={14} />
          </button>
          
          <button
            onClick={handleDelete}
            className="p-1 text-gray-400 hover:text-error rounded"
            title="Delete task"
          >
            <ApperIcon name="Trash2" size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default TaskItem