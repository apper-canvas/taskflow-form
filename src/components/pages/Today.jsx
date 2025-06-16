import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import { format, isToday, isPast } from 'date-fns'
import TaskList from '@/components/organisms/TaskList'
import TaskInput from '@/components/molecules/TaskInput'
import SkeletonLoader from '@/components/molecules/SkeletonLoader'
import ErrorState from '@/components/molecules/ErrorState'
import EmptyState from '@/components/molecules/EmptyState'
import ApperIcon from '@/components/ApperIcon'
import { taskService } from '@/services'

const Today = () => {
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
      const taskData = await taskService.getTodayTasks()
      setTasks(taskData)
    } catch (err) {
      setError(err.message || 'Failed to load tasks')
      toast.error('Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }

  const handleTaskCreated = (newTask) => {
    // Add to today's tasks if it has today's due date
    if (newTask.dueDate === format(new Date(), 'yyyy-MM-dd')) {
      setTasks(prev => [newTask, ...prev])
    }
  }

  const handleTaskUpdate = (taskId, updates) => {
    setTasks(prev =>
      prev.map(task =>
        task.Id === taskId ? { ...task, ...updates } : task
      ).filter(task => {
        // Remove from today view if no longer due today/overdue
        if (updates.dueDate !== undefined) {
          const today = format(new Date(), 'yyyy-MM-dd')
          return task.dueDate === today || (task.dueDate && task.dueDate < today && !task.completed)
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
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Today</h1>
            <p className="text-gray-600">{format(new Date(), 'EEEE, MMMM d')}</p>
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

  const incompleteTasks = tasks.filter(task => !task.completed)
  const completedTasks = tasks.filter(task => task.completed)
  const overdueTasks = incompleteTasks.filter(task => 
    task.dueDate && isPast(new Date(task.dueDate)) && !isToday(new Date(task.dueDate))
  )
  const todayTasks = incompleteTasks.filter(task => 
    !task.dueDate || isToday(new Date(task.dueDate))
  )

  const totalTasks = incompleteTasks.length
  const completedCount = completedTasks.length
  const progressPercentage = totalTasks > 0 ? (completedCount / (totalTasks + completedCount)) * 100 : 0

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
              Today
            </h1>
            {totalTasks > 0 && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className="w-16 h-2 bg-surface-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 0.5 }}
                    className="h-full bg-success rounded-full"
                  />
                </div>
                <span>{completedCount} of {totalTasks + completedCount} completed</span>
              </div>
            )}
          </div>
          <p className="text-gray-600 flex items-center">
            <ApperIcon name="Calendar" size={16} className="mr-2" />
            {format(new Date(), 'EEEE, MMMM d')}
          </p>
        </div>

        <div className="mb-6">
          <TaskInput
            onTaskCreated={handleTaskCreated}
            placeholder="Add a task for today..."
          />
        </div>

        <div className="space-y-8">
          {/* Overdue Tasks */}
          {overdueTasks.length > 0 && (
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <ApperIcon name="AlertCircle" size={20} className="text-error" />
                <h2 className="text-lg font-medium text-error">
                  Overdue ({overdueTasks.length})
                </h2>
              </div>
              <TaskList
                tasks={overdueTasks}
                onTaskUpdate={handleTaskUpdate}
                onTaskDelete={handleTaskDelete}
                showProject={true}
              />
            </div>
          )}

          {/* Today's Tasks */}
          <div>
            {todayTasks.length > 0 && (
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Today ({todayTasks.length})
              </h2>
            )}
            
            <TaskList
              tasks={todayTasks}
              onTaskUpdate={handleTaskUpdate}
              onTaskDelete={handleTaskDelete}
              showProject={true}
              emptyState={
                overdueTasks.length === 0 ? (
                  <EmptyState
                    icon="CheckCircle"
                    title={completedCount > 0 ? "All caught up!" : "Plan your day"}
                    description={
                      completedCount > 0 
                        ? "You've completed all your tasks for today. Great work!"
                        : "Add tasks to focus on today. You've got this!"
                    }
                    actionLabel="Add a task"
                    onAction={() => document.querySelector('input')?.focus()}
                  />
                ) : null
              }
            />
          </div>

          {/* Completed Tasks */}
          {completedTasks.length > 0 && (
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <ApperIcon name="CheckCircle" size={20} className="text-success mr-2" />
                Completed ({completedTasks.length})
              </h2>
              <TaskList
                tasks={completedTasks}
                onTaskUpdate={handleTaskUpdate}
                onTaskDelete={handleTaskDelete}
                showProject={true}
              />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default Today