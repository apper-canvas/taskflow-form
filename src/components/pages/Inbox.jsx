import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import TaskList from '@/components/organisms/TaskList'
import TaskInput from '@/components/molecules/TaskInput'
import SkeletonLoader from '@/components/molecules/SkeletonLoader'
import ErrorState from '@/components/molecules/ErrorState'
import EmptyState from '@/components/molecules/EmptyState'
import { taskService } from '@/services'

const Inbox = () => {
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
      const taskData = await taskService.getInboxTasks()
      setTasks(taskData)
    } catch (err) {
      setError(err.message || 'Failed to load tasks')
      toast.error('Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }

  const handleTaskCreated = (newTask) => {
    setTasks(prev => [newTask, ...prev])
  }

  const handleTaskUpdate = (taskId, updates) => {
    setTasks(prev =>
      prev.map(task =>
        task.Id === taskId ? { ...task, ...updates } : task
      )
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
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Inbox</h1>
            <p className="text-gray-600">Capture your thoughts and organize later</p>
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6"
    >
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Inbox
          </h1>
          <p className="text-gray-600">
            Capture your thoughts and organize later
          </p>
        </div>

        <div className="mb-6">
          <TaskInput
            onTaskCreated={handleTaskCreated}
            placeholder="Capture a task..."
          />
        </div>

        <div className="space-y-8">
          {/* Incomplete Tasks */}
          <div>
            {incompleteTasks.length > 0 && (
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Tasks ({incompleteTasks.length})
              </h2>
            )}
            
            <TaskList
              tasks={incompleteTasks}
              onTaskUpdate={handleTaskUpdate}
              onTaskDelete={handleTaskDelete}
              emptyState={
                <EmptyState
                  icon="Inbox"
                  title="Your inbox is empty"
                  description="Capture tasks, ideas, and thoughts here. They'll be organized and ready when you need them."
                  actionLabel="Add your first task"
                  onAction={() => document.querySelector('input')?.focus()}
                />
              }
            />
          </div>

          {/* Completed Tasks */}
          {completedTasks.length > 0 && (
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Completed ({completedTasks.length})
              </h2>
              <TaskList
                tasks={completedTasks}
                onTaskUpdate={handleTaskUpdate}
                onTaskDelete={handleTaskDelete}
              />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default Inbox