"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PlusCircle, CheckCircle2, Circle } from "lucide-react"
import { useStudyStore } from "@/lib/store"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

export function TaskInput() {
  const [task, setTask] = useState("")
  const { toast } = useToast()
  const { addTask, tasks, toggleTask, selectedDate } = useStudyStore()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!task.trim()) return

    addTask(task, selectedDate)
    setTask("")
    toast({
      title: "Task Added",
      description: `Task scheduled for ${format(selectedDate, 'PPP')}`,
    })
  }

  const filteredTasks = tasks.filter(
    task => format(task.dueDate, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
  )

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Add Study Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex space-x-2">
            <Input
              placeholder="What tasks do you have planned?"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              className="flex-1"
            />
            <Button type="submit">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tasks for {format(selectedDate, 'PPP')}</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-4">
              {filteredTasks.map((task) => (
                <Card 
                  key={task.id}
                  className={cn(
                    "transition-colors",
                    task.completed && "bg-muted"
                  )}
                >
                  <CardContent className="p-4">
                    <div 
                      className="flex items-center space-x-2 cursor-pointer"
                      onClick={() => toggleTask(task.id)}
                    >
                      {task.completed ? (
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                      ) : (
                        <Circle className="h-5 w-5 text-muted-foreground" />
                      )}
                      <div className="flex-1">
                        <h3 className={cn(
                          "font-semibold",
                          task.completed && "line-through text-muted-foreground"
                        )}>
                          {task.title}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          Added {format(task.createdAt, 'PP')}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {filteredTasks.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  No tasks scheduled for this day.
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}