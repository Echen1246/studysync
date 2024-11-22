import { Calendar } from '@/components/calendar'
import { StudyMaterials } from '@/components/study-materials'
import { TaskInput } from '@/components/task-input'
import { Overview } from '@/components/overview'

export default function Home() {
  return (
    <div className="space-y-8">
      <Overview />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Calendar />
          <TaskInput />
        </div>
        <StudyMaterials />
      </div>
    </div>
  )
}