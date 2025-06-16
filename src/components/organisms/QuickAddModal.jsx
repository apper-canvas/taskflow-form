import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import TaskInput from '@/components/molecules/TaskInput'
import ApperIcon from '@/components/ApperIcon'
import { taskService, projectService } from '@/services'

const QuickAddModal = ({ isOpen, onClose }) => {
  const [projects, setProjects] = useState([])
  const [selectedProject, setSelectedProject] = useState(null)

  useEffect(() => {
    if (isOpen) {
      const loadProjects = async () => {
        try {
          const projectData = await projectService.getAll()
          setProjects(projectData)
        } catch (error) {
          console.error('Failed to load projects:', error)
        }
      }
      loadProjects()
    }
  }, [isOpen])

  const handleTaskCreated = (newTask) => {
    toast.success('Task added successfully!')
    onClose()
  }

  const backdropVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  }

  const modalVariants = {
    initial: { opacity: 0, scale: 0.95, y: 20 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: 20 }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            variants={backdropVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />
          
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              variants={modalVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Quick Add Task
                </h2>
                <button
                  onClick={onClose}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded"
                >
                  <ApperIcon name="X" size={20} />
                </button>
              </div>

              {projects.length > 0 && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project (optional)
                  </label>
                  <select
                    value={selectedProject || ''}
                    onChange={(e) => setSelectedProject(e.target.value || null)}
                    className="w-full px-3 py-2 border border-surface-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    <option value="">Inbox</option>
                    {projects.map(project => (
                      <option key={project.Id} value={project.Id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <TaskInput
                projectId={selectedProject}
                onTaskCreated={handleTaskCreated}
                placeholder="What needs to be done?"
                autoFocus={true}
              />

              <div className="mt-4 pt-4 border-t border-surface-200">
                <div className="text-xs text-gray-500 space-y-1">
                  <div>💡 <strong>Smart dates:</strong> Type "today", "tomorrow", "next week"</div>
                  <div>⌨️ <strong>Shortcuts:</strong> Press 'a' anywhere to open, 'Esc' to close</div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

export default QuickAddModal