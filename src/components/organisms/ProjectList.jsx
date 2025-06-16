import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ProjectItem from '@/components/molecules/ProjectItem'
import SkeletonLoader from '@/components/molecules/SkeletonLoader'
import ErrorState from '@/components/molecules/ErrorState'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import ApperIcon from '@/components/ApperIcon'
import { projectService, taskService } from '@/services'

const ProjectList = ({ onProjectSelect }) => {
  const [projects, setProjects] = useState([])
  const [projectTaskCounts, setProjectTaskCounts] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isAddingProject, setIsAddingProject] = useState(false)
  const [newProjectName, setNewProjectName] = useState('')

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    setLoading(true)
    setError(null)
    try {
      const [projectData, allTasks] = await Promise.all([
        projectService.getAll(),
        taskService.getAll()
      ])
      
      // Count incomplete tasks per project
      const taskCounts = {}
      allTasks.forEach(task => {
        if (!task.completed && task.projectId) {
          taskCounts[task.projectId] = (taskCounts[task.projectId] || 0) + 1
        }
      })
      
      setProjects(projectData)
      setProjectTaskCounts(taskCounts)
    } catch (err) {
      setError(err.message || 'Failed to load projects')
      toast.error('Failed to load projects')
    } finally {
      setLoading(false)
    }
  }

  const handleProjectUpdate = (projectId, updates) => {
    setProjects(prev => 
      prev.map(project => 
        project.Id === projectId ? { ...project, ...updates } : project
      )
    )
  }

  const handleAddProject = async (e) => {
    e.preventDefault()
    if (!newProjectName.trim()) return

    try {
      const newProject = await projectService.create({
        name: newProjectName.trim()
      })
      setProjects(prev => [...prev, newProject])
      setNewProjectName('')
      setIsAddingProject(false)
      toast.success('Project created!')
    } catch (error) {
      toast.error('Failed to create project')
    }
  }

  if (loading) {
    return (
      <div className="p-4">
        <SkeletonLoader count={4} type="project" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4">
        <ErrorState 
          message={error}
          onRetry={loadProjects}
        />
      </div>
    )
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-900">Projects</h3>
        <button
          onClick={() => setIsAddingProject(true)}
          className="p-1 text-gray-400 hover:text-gray-600 rounded"
          title="Add project"
        >
          <ApperIcon name="Plus" size={16} />
        </button>
      </div>

      {isAddingProject && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-3"
        >
          <form onSubmit={handleAddProject} className="space-y-2">
            <Input
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              placeholder="Project name"
              className="text-sm"
              autoFocus
            />
            <div className="flex space-x-2">
              <Button type="submit" size="sm" disabled={!newProjectName.trim()}>
                Add
              </Button>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  setIsAddingProject(false)
                  setNewProjectName('')
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="space-y-1">
        {projects.map((project) => (
          <ProjectItem
            key={project.Id}
            project={project}
            taskCount={projectTaskCounts[project.Id] || 0}
            onProjectUpdate={handleProjectUpdate}
            onProjectClick={onProjectSelect}
          />
        ))}
      </div>

      {projects.length === 0 && !isAddingProject && (
        <div className="text-center py-6">
          <ApperIcon name="FolderOpen" size={32} className="text-surface-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500 mb-3">No projects yet</p>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setIsAddingProject(true)}
          >
            Create your first project
          </Button>
        </div>
      )}
    </div>
  )
}

export default ProjectList