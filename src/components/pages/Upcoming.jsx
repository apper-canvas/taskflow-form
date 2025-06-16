import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import { format, addDays, startOfDay, isSameDay } from 'date-fns'
import TaskList from '@/components/organisms/TaskList'
import TaskInput from '@/components/molecules/TaskInput'
import SkeletonLoader from '@/components/molecules/SkeletonLoader'
import ErrorState from '@/components/molecules/ErrorState'
import EmptyState from '@/components/molecules/EmptyState'
import ApperIcon from '@/components/ApperIcon'
import { taskService } from '@/services'

const Upcoming = () => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadTasks()
  }, [])

  const loadTasks = async () => {
    setLoading(true)
    setError(null)
    try {
      const taskData = await taskService.getUpcomingTasks()
      setTasks(taskData)
    } catch (err) {
      setError(err.message || 'Failed to load tasks')
      toast.error('Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }

  const handleTaskCreated = (newTask) => {
    if (newTask.dueDate) {
      const today = startOfDay(new Date())
      const taskDate = startOfDay(new Date(newTask.dueDate))
      const nextWeek = addDays(today, 7)
      
      if (taskDate > today && taskDate <= nextWeek) {
        setTasks(prev => [...prev, newTask].sort((a, b) => 
          new Date(a.dueDate) - new Date(b.dueDate)
        ))
      }
    }
  }

  const handleTaskUpdate = (taskId, updates) => {
    setTasks(prev =>
      prev.map(task =>
        task.Id === taskId ? { ...task, ...updates } : task
      ).filter(task => {
        // Remove from upcoming view if date no longer in range
        if (updates.dueDate !== undefined || updates.completed !== undefined) {
          if (!task.dueDate || task.completed) return false
          const today = startOfDay(new Date())
          const taskDate = startOfDay(new Date(task.dueDate))
          const nextWeek = addDays(today, 7)
          return taskDate > today && taskDate <= nextWeek
        }
        return true
      })
    )
  }

  const handleTaskDelete = (taskId) => {
    setTasks(prev => prev.filter(task => task.Id !== taskId))
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Upcoming</h1>
            <p className="text-gray-600">Next 7 days</p>
          </div>
          <SkeletonLoader count={5} />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <ErrorState 
            message={error}
            onRetry={loadTasks}
          />
        </div>
      </div>
    )
  }

  // Group tasks by date
  const tasksByDate = {}
  const today = startOfDay(new Date())
  
  // Initialize next 7 days
  for (let i = 1; i <= 7; i++) {
    const date = addDays(today, i)
    const dateKey = format(date, 'yyyy-MM-dd')
    tasksByDate[dateKey] = {
      date,
      tasks: []
    }
  }

  // Group tasks
  tasks.forEach(task => {
    if (task.dueDate) {
      const dateKey = task.dueDate
      if (tasksByDate[dateKey]) {
        tasksByDate[dateKey].tasks.push(task)
      }
    }
  })

  const totalUpcoming = tasks.length

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6"
    >
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-semibold text-gray-900">
              Upcoming
            </h1>
            {totalUpcoming > 0 && (
              <div className="text-sm text-gray-600">
                {totalUpcoming} task{totalUpcoming !== 1 ? 's' : ''} scheduled
              </div>
            )}
          </div>
          <p className="text-gray-600 flex items-center">
            <ApperIcon name="CalendarDays" size={16} className="mr-2" />
            Next 7 days
          </p>
        </div>

        <div className="mb-6">
          <TaskInput
            onTaskCreated={handleTaskCreated}
            placeholder="Add a task with a due date..."
          />
        </div>

        {totalUpcoming === 0 ? (
          <EmptyState
            icon="CalendarDays"
            title="No upcoming tasks"
            description="Schedule tasks for the next 7 days to stay organized and focused."
            actionLabel="Add a scheduled task"
            onAction={() => document.querySelector('input')?.focus()}
          />
        ) : (
          <div className="space-y-6">
            {Object.entries(tasksByDate).map(([dateKey, { date, tasks: dateTasks }]) => {
              if (dateTasks.length === 0) return null

              return (
                <motion.div
                  key={dateKey}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-primary rounded-lg flex flex-col items-center justify-center text-white">
                        <div className="text-xs font-medium">
                          {format(date, 'MMM').toUpperCase()}
                        </div>
                        <div className="text-lg font-bold leading-none">
                          {format(date, 'd')}
                        </div>
                      </div>
                    </div>
                    <div>
                      <h2 className="text-lg font-medium text-gray-900">
                        {format(date, 'EEEE')}
                      </h2>
                      <p className="text-sm text-gray-600">
                        {format(date, 'MMMM d, yyyy')}
                      </p>
                    </div>
                    <div className="flex-1" />
                    <div className="text-sm text-gray-500">
                      {dateTasks.length} task{dateTasks.length !== 1 ? 's' : ''}
                    </div>
                  </div>

                  <div className="ml-15">
                    <TaskList
                      tasks={dateTasks}
                      onTaskUpdate={handleTaskUpdate}
                      onTaskDelete={handleTaskDelete}
                      showProject={true}
                    />
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default Upcoming