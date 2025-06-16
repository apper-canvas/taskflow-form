import projectData from '../mockData/projects.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class ProjectService {
  constructor() {
    this.projects = [...projectData]
    this.nextId = Math.max(...this.projects.map(p => p.Id)) + 1
  }

  async getAll() {
    await delay(200)
    return this.projects
      .sort((a, b) => a.order - b.order)
      .map(p => ({ ...p }))
  }

  async getById(id) {
    await delay(200)
    const project = this.projects.find(p => p.Id === parseInt(id, 10))
    return project ? { ...project } : null
  }

  async create(projectData) {
    await delay(300)
    const newProject = {
      Id: this.nextId++,
      name: projectData.name,
      color: projectData.color || '#737373',
      order: this.projects.length,
      isCollapsed: false
    }
    
    this.projects.push(newProject)
    return { ...newProject }
  }

  async update(id, updates) {
    await delay(300)
    const index = this.projects.findIndex(p => p.Id === parseInt(id, 10))
    if (index === -1) throw new Error('Project not found')
    
    // Don't allow Id modification
    const { Id, ...allowedUpdates } = updates
    this.projects[index] = { ...this.projects[index], ...allowedUpdates }
    return { ...this.projects[index] }
  }

  async delete(id) {
    await delay(300)
    const index = this.projects.findIndex(p => p.Id === parseInt(id, 10))
    if (index === -1) throw new Error('Project not found')
    
    this.projects.splice(index, 1)
    return true
  }

  async toggleCollapse(id) {
    await delay(200)
    const index = this.projects.findIndex(p => p.Id === parseInt(id, 10))
    if (index === -1) throw new Error('Project not found')
    
    this.projects[index].isCollapsed = !this.projects[index].isCollapsed
    return { ...this.projects[index] }
  }
}

export default new ProjectService()