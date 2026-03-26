interface IUser {
  first_name: string
  last_name: string
  email: string
  username: string
}

interface IAssignedTo {
  role: string
  member: IUser
}

interface ITask {
  id: number
  title: string
  description: string
  status: 'todo' | 'inprogress' | 'failed' | 'completed'
  due_date: string
  created_by: IUser
  assigned_to: IAssignedTo
}