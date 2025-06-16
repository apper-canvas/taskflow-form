import taskData from '../mockData/tasks.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class TaskService {
  constructor() {
    this.tasks = [...taskData]
    this.nextId = Math.max(...this.tasks.map(t => t.Id)) + 1
  }

  async getAll() {
    await delay(200)
    return [...this.tasks]
  }

  async getById(id) {
    await delay(200)
    const task = this.tasks.find(t => t.Id === parseInt(id, 10))
    return task ? { ...task } : null
  }

  async getByProject(projectId) {
    await delay(200)
    return this.tasks
      .filter(t => t.projectId === projectId)
      .sort((a, b) => a.order - b.order)
      .map(t => ({ ...t }))
  }

  async getTodayTasks() {
    await delay(200)
    const today = new Date().toISOString().split('T')[0]
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    
    return this.tasks
      .filter(t => 
        t.dueDate === today || 
        (t.dueDate && t.dueDate < today && !t.completed)
      )
      .sort((a, b) => {
        // Overdue tasks first
        if (a.dueDate < today && b.dueDate >= today) return -1
        if (b.dueDate < today && a.dueDate >= today) return 1
        // Then by priority
        return a.priority - b.priority
      })
      .map(t => ({ ...t }))
  }

  async getUpcomingTasks() {
    await delay(200)
    const today = new Date()
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
    
    return this.tasks
      .filter(t => {
        if (!t.dueDate || t.completed) return false
        const dueDate = new Date(t.dueDate)
        return dueDate > today && dueDate <= nextWeek
      })
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .map(t => ({ ...t }))
  }

  async getInboxTasks() {
    await delay(200)
    return this.tasks
      .filter(t => !t.projectId)
      .sort((a, b) => b.Id - a.Id)
      .map(t => ({ ...t }))
  }

  async create(taskData) {
    await delay(300)
    const newTask = {
      Id: this.nextId++,
      title: taskData.title,
      completed: false,
      projectId: taskData.projectId || null,
      priority: taskData.priority || 4,
      dueDate: taskData.dueDate || null,
      createdAt: new Date().toISOString(),
      completedAt: null,
      order: this.tasks.length
    }
    
    this.tasks.push(newTask)
    return { ...newTask }
  }

  async update(id, updates) {
    await delay(300)
    const index = this.tasks.findIndex(t => t.Id === parseInt(id, 10))
    if (index === -1) throw new Error('Task not found')
    
    // Don't allow Id modification
    const { Id, ...allowedUpdates } = updates
    this.tasks[index] = { ...this.tasks[index], ...allowedUpdates }
    return { ...this.tasks[index] }
  }

  async complete(id) {
    await delay(300)
    const index = this.tasks.findIndex(t => t.Id === parseInt(id, 10))
    if (index === -1) throw new Error('Task not found')
    
    this.tasks[index] = {
      ...this.tasks[index],
      completed: true,
      completedAt: new Date().toISOString()
    }
    return { ...this.tasks[index] }
  }

  async reorder(projectId, taskIds) {
    await delay(300)
    taskIds.forEach((taskId, index) => {
      const taskIndex = this.tasks.findIndex(t => t.Id === parseInt(taskId, 10))
      if (taskIndex !== -1) {
        this.tasks[taskIndex].order = index
      }
    })
    return true
  }

  async delete(id) {
    await delay(300)
    const index = this.tasks.findIndex(t => t.Id === parseInt(id, 10))
    if (index === -1) throw new Error('Task not found')
    
    this.tasks.splice(index, 1)
    return true
  }

  // Natural language date parsing
  parseNaturalDate(text) {
    const today = new Date()
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000)
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
    
    const lowerText = text.toLowerCase()
    
    if (lowerText.includes('today')) {
      return today.toISOString().split('T')[0]
    }
    if (lowerText.includes('tomorrow')) {
      return tomorrow.toISOString().split('T')[0]
    }
    if (lowerText.includes('next week')) {
      return nextWeek.toISOString().split('T')[0]
    }
    
    // Check for day names
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    const dayIndex = days.findIndex(day => lowerText.includes(day))
    if (dayIndex !== -1) {
      const currentDay = today.getDay()
      const daysUntilTarget = (dayIndex - currentDay + 7) % 7 || 7
      const targetDate = new Date(today.getTime() + daysUntilTarget * 24 * 60 * 60 * 1000)
      return targetDate.toISOString().split('T')[0]
    }
    
    return null
  }
}

export default new TaskService()