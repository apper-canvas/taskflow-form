import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import { projectService, taskService } from '@/services'

const ProjectItem = ({ 
  project, 
  taskCount = 0, 
  onProjectUpdate, 
  onProjectClick 
}) => {
  const [isCollapsed, setIsCollapsed] = useState(project.isCollapsed)
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(project.name)

  const handleToggleCollapse = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    try {
      const updatedProject = await projectService.toggleCollapse(project.Id)
      setIsCollapsed(updatedProject.isCollapsed)
      onProjectUpdate?.(project.Id, updatedProject)
    } catch (error) {
      toast.error('Failed to toggle project')
    }
  }

  const handleEdit = async () => {
    if (editName.trim() === '') {
      setEditName(project.name)
      setIsEditing(false)
      return
    }

    if (editName.trim() === project.name.trim()) {
      setIsEditing(false)
      return
    }

    try {
      await projectService.update(project.Id, { name: editName.trim() })
      onProjectUpdate?.(project.Id, { name: editName.trim() })
      setIsEditing(false)
      toast.success('Project updated')
    } catch (error) {
      toast.error('Failed to update project')
      setEditName(project.name)
      setIsEditing(false)
    }
  }

  return (
    <div className="group">
      <NavLink
        to={`/project/${project.Id}`}
        onClick={onProjectClick}
        className={({ isActive }) =>
          `flex items-center space-x-2 px-3 py-2 rounded text-sm transition-colors w-full ${
            isActive
              ? 'bg-primary text-white'
              : 'text-gray-700 hover:bg-surface-100'
          }`
        }
      >
        <button
          onClick={handleToggleCollapse}
          className="flex-shrink-0 p-0.5 rounded hover:bg-black/10"
        >
          <motion.div
            animate={{ rotate: isCollapsed ? 0 : 90 }}
            transition={{ duration: 0.2 }}
          >
            <ApperIcon name="ChevronRight" size={14} />
          </motion.div>
        </button>

        <div 
          className="w-3 h-3 rounded flex-shrink-0"
          style={{ backgroundColor: project.color }}
        />

        {isEditing ? (
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onBlur={handleEdit}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleEdit()
              if (e.key === 'Escape') {
                setEditName(project.name)
                setIsEditing(false)
              }
            }}
            className="flex-1 bg-transparent border-none outline-none text-sm"
            autoFocus
            onClick={(e) => e.preventDefault()}
          />
        ) : (
          <span 
            className="flex-1 truncate cursor-pointer"
            onClick={(e) => {
              e.preventDefault()
              setIsEditing(true)
            }}
          >
            {project.name}
          </span>
        )}

        {taskCount > 0 && (
          <span className="text-xs bg-surface-300 px-2 py-0.5 rounded-full">
            {taskCount}
          </span>
        )}
      </NavLink>
    </div>
  )
}

export default ProjectItem