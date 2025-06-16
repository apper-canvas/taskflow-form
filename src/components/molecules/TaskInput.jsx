import { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import Input from '@/components/atoms/Input'
import Button from '@/components/atoms/Button'
import PriorityFlag from '@/components/atoms/PriorityFlag'
import ApperIcon from '@/components/ApperIcon'
import { taskService } from '@/services'

const TaskInput = ({ 
  projectId = null, 
  onTaskCreated, 
  placeholder = "Add a task...",
  autoFocus = false 
}) => {
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState(4)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showOptions, setShowOptions] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!title.trim() || isSubmitting) return

    setIsSubmitting(true)
    try {
      // Parse natural language for dates
      const dueDate = taskService.parseNaturalDate(title)
      
      const newTask = await taskService.create({
        title: title.trim(),
        projectId,
        priority,
        dueDate
      })

      onTaskCreated?.(newTask)
      setTitle('')
      setPriority(4)
      setShowOptions(false)
      toast.success('Task added!')
      
      if (dueDate) {
        toast.info(`Due date set automatically: ${dueDate}`)
      }
    } catch (error) {
      toast.error('Failed to add task')
      console.error('Error creating task:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const priorityOptions = [
    { value: 1, label: 'P1', color: 'bg-priority-1' },
    { value: 2, label: 'P2', color: 'bg-priority-2' },
    { value: 3, label: 'P3', color: 'bg-priority-3' },
    { value: 4, label: 'P4', color: 'bg-priority-4' }
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="relative">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={placeholder}
          className="task-input pr-12"
          autoFocus={autoFocus}
          onFocus={() => setShowOptions(true)}
        />
        
        <button
          type="button"
          onClick={() => setShowOptions(!showOptions)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <ApperIcon name="Settings" size={16} />
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ 
          opacity: showOptions ? 1 : 0, 
          height: showOptions ? 'auto' : 0 
        }}
        transition={{ duration: 0.2 }}
        className="overflow-hidden"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Priority:</span>
            <div className="flex space-x-1">
              {priorityOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setPriority(option.value)}
                  className={`
                    w-6 h-6 rounded flex items-center justify-center text-xs font-medium
                    ${priority === option.value 
                      ? `${option.color} text-white` 
                      : 'bg-surface-100 text-gray-600 hover:bg-surface-200'
                    }
                  `}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={!title.trim() || isSubmitting}
          >
            {isSubmitting ? 'Adding...' : 'Add Task'}
          </Button>
        </div>
      </motion.div>

      <div className="text-xs text-gray-500">
        💡 Try typing "today", "tomorrow", or "next week" for automatic due dates
      </div>
    </form>
  )
}

export default TaskInput