"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { BookOpen, BookOpenCheck, RefreshCcw, ChevronRight, Check } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Toggle } from "@/components/ui/toggle"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Flashcard, FlashcardBundle } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { useStudyStore } from "@/lib/store"

export function StudyMaterials() {
  const [isStudyGuideMode, setIsStudyGuideMode] = useState(false)
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedBundle, setSelectedBundle] = useState<FlashcardBundle | null>(null)
  const { toast } = useToast()
  const { 
    flashcardBundles, 
    addFlashcardBundle, 
    completedFlashcards,
    toggleFlashcard 
  } = useStudyStore()

  const generateFlashcards = async () => {
    if (!input.trim()) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/flashcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          input,
          mode: isStudyGuideMode ? 'study_guide' : 'subject'
        })
      })

      if (!response.ok) throw new Error('Failed to generate flashcards')

      const data = await response.json()
      
      const newBundle: FlashcardBundle = {
        id: crypto.randomUUID(),
        title: isStudyGuideMode ? "Study Guide Notes" : input,
        createdAt: new Date(),
        mode: isStudyGuideMode ? 'study_guide' : 'subject',
        flashcards: data.flashcards,
        metadata: isStudyGuideMode ? data.metadata : data.subject_breakdown
      }

      addFlashcardBundle(newBundle)
      setInput("")
      
      toast({
        title: "Flashcards Generated",
        description: "Your study materials are ready!",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate flashcards. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const toggleMode = () => {
    setIsStudyGuideMode(!isStudyGuideMode)
    setInput("")
  }

  return (
    <>
      <Card className="h-[600px]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5" />
              <CardTitle>Study Materials</CardTitle>
            </div>
            <Toggle 
              pressed={isStudyGuideMode}
              onPressedChange={toggleMode}
              aria-label="Toggle input mode"
            >
              {isStudyGuideMode ? (
                <BookOpenCheck className="h-4 w-4 mr-2" />
              ) : (
                <RefreshCcw className="h-4 w-4 mr-2" />
              )}
              {isStudyGuideMode ? "Study Guide Mode" : "Subject Mode"}
            </Toggle>
          </div>
          <div className="space-y-4 mt-4">
            {isStudyGuideMode ? (
              <Textarea
                placeholder="Paste your study guide content here..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="min-h-[100px]"
              />
            ) : (
              <Input
                placeholder="Enter a subject to study (e.g., 'Introduction to Quantum Physics')..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            )}
            <Button 
              onClick={generateFlashcards}
              disabled={isLoading}
              className="w-full"
            >
              Generate Flashcards
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[350px] pr-4">
            <div className="space-y-4">
              {flashcardBundles.map((bundle) => (
                <Card 
                  key={bundle.id}
                  className="cursor-pointer hover:bg-accent transition-colors"
                  onClick={() => setSelectedBundle(bundle)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold">{bundle.title}</h3>
                          <Badge variant="outline">
                            {bundle.flashcards.length} cards
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Created {format(bundle.createdAt, 'PPp')}
                        </p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              ))}
              {flashcardBundles.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  No flashcard bundles yet. {isStudyGuideMode 
                    ? "Paste your study guide content above to get started."
                    : "Enter a subject above to get started."}
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <Dialog open={!!selectedBundle} onOpenChange={() => setSelectedBundle(null)}>
        <DialogContent className="max-w-3xl h-[80vh]">
          <DialogHeader>
            <DialogTitle>{selectedBundle?.title}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="mt-4 h-full">
            {selectedBundle?.metadata && (
              <Card className="mb-4 bg-muted">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">Study Overview</h3>
                  <div className="space-y-2">
                    {'total_terms' in selectedBundle.metadata ? (
                      <>
                        <p className="text-sm">Total Terms: {selectedBundle.metadata.total_terms}</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedBundle.metadata.main_topics.map((topic, i) => (
                            <Badge key={i} variant="secondary">{topic}</Badge>
                          ))}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Prerequisites:</p>
                          <div className="flex flex-wrap gap-2">
                            {selectedBundle.metadata.prerequisites.map((prereq, i) => (
                              <Badge key={i} variant="outline">{prereq}</Badge>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Learning Objectives:</p>
                          <div className="flex flex-wrap gap-2">
                            {selectedBundle.metadata.learning_objectives.map((objective, i) => (
                              <Badge key={i}>{objective}</Badge>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
            <div className="space-y-4">
              {selectedBundle?.flashcards.map((flashcard) => {
                const isCompleted = completedFlashcards.has(flashcard.id)
                return (
                  <Card 
                    key={flashcard.id}
                    className={isCompleted ? "bg-muted" : ""}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleFlashcard(flashcard.id)
                            }}
                          >
                            <Check className={`h-4 w-4 ${isCompleted ? 'text-primary' : 'text-muted-foreground'}`} />
                          </Button>
                          <h3 className="font-semibold">{flashcard.front}</h3>
                        </div>
                        <Badge variant="outline">{flashcard.difficulty}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground ml-10">
                        {flashcard.back}
                      </p>
                      {(flashcard.topic_category || flashcard.source_section) && (
                        <div className="mt-2 pt-2 border-t ml-10">
                          <p className="text-xs text-muted-foreground">
                            {flashcard.topic_category || flashcard.source_section}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  )
}