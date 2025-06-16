import { useState, useEffect } from 'react'
import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import QuickAddModal from '@/components/organisms/QuickAddModal'
import ProjectList from '@/components/organisms/ProjectList'
import { taskService } from '@/services'

const Layout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false)
  const [taskCount, setTaskCount] = useState(0)
  const location = useLocation()

  // Load task count for today
  useEffect(() => {
    const loadTaskCount = async () => {
      try {
        const tasks = await taskService.getTodayTasks()
        setTaskCount(tasks.filter(task => !task.completed).length)
      } catch (error) {
        console.error('Failed to load task count:', error)
      }
    }
    loadTaskCount()
  }, [location])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'a' && !e.ctrlKey && !e.metaKey && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault()
        setIsQuickAddOpen(true)
      }
      if (e.key === 'Escape') {
        setIsQuickAddOpen(false)
        setIsMobileMenuOpen(false)
      }
    }
    
    document.addEventListener('keydown', handleKeyPress)
    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [])

  const mainNavItems = [
    { 
      id: 'inbox', 
      label: 'Inbox', 
      path: '/inbox', 
      icon: 'Inbox' 
    },
    { 
      id: 'today', 
      label: 'Today', 
      path: '/today', 
      icon: 'Calendar',
      count: taskCount 
    },
    { 
      id: 'upcoming', 
      label: 'Upcoming', 
      path: '/upcoming', 
      icon: 'CalendarDays' 
    }
  ]

  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: '-100%' }
  }

  return (
    <>
      {/* Header */}
      <header className="flex-shrink-0 h-16 bg-white border-b border-surface-300 flex items-center justify-between px-4 z-40">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded hover:bg-surface-100 transition-colors"
          >
            <ApperIcon name="Menu" size={20} />
          </button>
          <h1 className="text-xl font-semibold text-gray-900">TaskFlow</h1>
        </div>
        
        <button
          onClick={() => setIsQuickAddOpen(true)}
          className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded hover:bg-accent transition-colors"
        >
          <ApperIcon name="Plus" size={16} />
          <span className="hidden sm:inline">Quick Add</span>
        </button>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Sidebar */}
        <motion.aside
          variants={sidebarVariants}
          animate={isMobileMenuOpen ? 'open' : 'closed'}
          className="fixed md:static inset-y-0 left-0 w-64 bg-surface-50 border-r border-surface-300 z-50 md:z-40 overflow-y-auto md:translate-x-0"
        >
          <nav className="p-4 space-y-1">
            {mainNavItems.map((item) => (
              <NavLink
                key={item.id}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-2 rounded text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-surface-100'
                  }`
                }
              >
                <ApperIcon name={item.icon} size={18} />
                <span className="flex-1">{item.label}</span>
                {item.count > 0 && (
                  <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">
                    {item.count}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="border-t border-surface-300 mt-4">
            <ProjectList onProjectSelect={() => setIsMobileMenuOpen(false)} />
          </div>
        </motion.aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-surface-50">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>

      {/* Quick Add Modal */}
      <QuickAddModal 
        isOpen={isQuickAddOpen} 
        onClose={() => setIsQuickAddOpen(false)} 
      />

      {/* Mobile Bottom Tabs */}
      <div className="md:hidden flex-shrink-0 bg-white border-t border-surface-300">
        <div className="flex">
          {mainNavItems.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) =>
                `flex-1 flex flex-col items-center py-2 px-1 text-xs ${
                  isActive ? 'text-primary' : 'text-gray-600'
                }`
              }
            >
              <ApperIcon name={item.icon} size={20} />
              <span className="mt-1">{item.label}</span>
              {item.count > 0 && (
                <div className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {item.count}
                </div>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </>
  )
}

export default Layout