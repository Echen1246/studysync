"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Brain, Clock, Target, TrendingUp } from "lucide-react"
import { useStudyStore } from "@/lib/store"
import { useEffect, useState } from "react"

export function Overview() {
  const { 
    tasks, 
    flashcardBundles, 
    completedFlashcards,
    studyStartTime,
    startStudySession
  } = useStudyStore()
  
  const [studyHours, setStudyHours] = useState(0)

  // Start tracking study time when component mounts
  useEffect(() => {
    if (!studyStartTime) {
      startStudySession()
    }
  }, [studyStartTime, startStudySession])

  // Update study hours every minute
  useEffect(() => {
    if (!studyStartTime) return

    const updateHours = () => {
      const hours = (new Date().getTime() - studyStartTime.getTime()) / (1000 * 60 * 60)
      setStudyHours(Number(hours.toFixed(1)))
    }

    updateHours() // Initial calculation
    const interval = setInterval(updateHours, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [studyStartTime])

  // Calculate metrics
  const totalTasks = tasks.length
  const completedTasks = tasks.filter(task => task.completed).length
  const taskCompletionRate = totalTasks ? (completedTasks / totalTasks) * 100 : 0

  const totalFlashcards = flashcardBundles.reduce(
    (sum, bundle) => sum + bundle.flashcards.length, 
    0
  )
  const completedFlashcardsCount = completedFlashcards.size
  const flashcardCompletionRate = totalFlashcards ? (completedFlashcardsCount / totalFlashcards) * 100 : 0

  // Overall progress is average of task and flashcard completion
  const overallProgress = Math.round((taskCompletionRate + flashcardCompletionRate) / 2)

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Study Hours</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{studyHours}</div>
          <p className="text-xs text-muted-foreground">
            Current study session
          </p>
          <Progress value={100} className="mt-3" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Topics Covered</CardTitle>
          <Brain className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{completedFlashcardsCount}</div>
          <p className="text-xs text-muted-foreground">
            out of {totalFlashcards} flashcards
          </p>
          <Progress value={flashcardCompletionRate} className="mt-3" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Goals Completed</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{completedTasks}</div>
          <p className="text-xs text-muted-foreground">
            out of {totalTasks} tasks
          </p>
          <Progress value={taskCompletionRate} className="mt-3" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{overallProgress}%</div>
          <p className="text-xs text-muted-foreground">
            Combined completion rate
          </p>
          <Progress value={overallProgress} className="mt-3" />
        </CardContent>
      </Card>
    </div>
  )
}