import Inbox from '@/components/pages/Inbox'
import Today from '@/components/pages/Today'
import Upcoming from '@/components/pages/Upcoming'
import ProjectView from '@/components/pages/ProjectView'

export const routes = {
  inbox: {
    id: 'inbox',
    label: 'Inbox',
    path: '/inbox',
    icon: 'Inbox',
    component: Inbox
  },
  today: {
    id: 'today',
    label: 'Today',
    path: '/today',
    icon: 'Calendar',
    component: Today
  },
  upcoming: {
    id: 'upcoming',
    label: 'Upcoming',
    path: '/upcoming',
    icon: 'CalendarDays',
    component: Upcoming
  },
  project: {
    id: 'project',
    label: 'Project',
    path: '/project/:id',
    icon: 'FolderOpen',
    component: ProjectView
  }
}

export const routeArray = Object.values(routes)
export default routes