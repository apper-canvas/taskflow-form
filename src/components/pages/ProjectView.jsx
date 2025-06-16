import { useState, useEffect } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import TaskList from '@/components/organisms/TaskList'
import TaskInput from '@/components/molecules/TaskInput'
import SkeletonLoader from '@/components/molecules/SkeletonLoader'
import ErrorState from '@/components/molecules/ErrorState'
import EmptyState from '@/components/molecules/EmptyState'
import ApperIcon from '@/components/ApperIcon'
import { taskService, projectService } from '@/services'

const ProjectView = () => {
  const { id } = useParams()
  const projectId = parseInt(id, 10)
  
  const [project, setProject] = useState(null)
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (projectId) {
      loadProjectData()
    }
  }, [projectId])

  const loadProjectData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [projectData, taskData] = await Promise.all([
        projectService.getById(projectId),
        taskService.getByProject(projectId)
      ])
      
      if (!projectData) {
        setError('Project not found')
        return
      }
      
      setProject(projectData)
      setTasks(taskData)
    } catch (err) {
      setError(err.message || 'Failed to load project')
      toast.error('Failed to load project')
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
      ).filter(task => {
        // Remove from project view if moved to different project
        if (updates.projectId !== undefined) {
          return task.projectId === projectId
        }
        return true
      })
    )
  }

  const handleTaskDelete = (taskId) => {
    setTasks(prev => prev.filter(task => task.Id !== taskId))
  }

  if (isNaN(projectId)) {
    return <Navigate to="/today" replace />
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <div className="h-8 bg-surface-300 rounded w-48 mb-2" />
            <div className="h-4 bg-surface-200 rounded w-32" />
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
            onRetry={loadProjectData}
          />
        </div>
      </div>
    )
  }

  if (!project) {
    return <Navigate to="/today" replace />
  }

  const incompleteTasks = tasks.filter(task => !task.completed)
  const completedTasks = tasks.filter(task => task.completed)
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
          <div className="flex items-center space-x-3 mb-4">
            <div 
              className="w-6 h-6 rounded flex-shrink-0"
              style={{ backgroundColor: project.color }}
            />
            <h1 className="text-2xl font-semibold text-gray-900">
              {project.name}
            </h1>
          </div>
          
          {(totalTasks > 0 || completedCount > 0) && (
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-24 h-2 bg-surface-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 0.5 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: project.color }}
                  />
                </div>
                <span className="text-sm text-gray-600">
                  {Math.round(progressPercentage)}% complete
                </span>
              </div>
              
              <div className="text-sm text-gray-600">
                {completedCount} of {totalTasks + completedCount} tasks completed
              </div>
            </div>
          )}
          
          <p className="text-gray-600 flex items-center">
            <ApperIcon name="FolderOpen" size={16} className="mr-2" />
            {totalTasks} active task{totalTasks !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="mb-6">
          <TaskInput
            projectId={projectId}
            onTaskCreated={handleTaskCreated}
            placeholder={`Add a task to ${project.name}...`}
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
                  icon="FolderOpen"
                  title={`No tasks in ${project.name}`}
                  description="Add tasks to this project to track your progress and stay organized."
                  actionLabel="Add your first task"
                  onAction={() => document.querySelector('input')?.focus()}
                />
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
              />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default ProjectView