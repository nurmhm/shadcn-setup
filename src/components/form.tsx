"use client"

import React, { useState } from "react"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Switch } from "./ui/switch"
import { RadioGroup, RadioGroupItem } from "./ui/radio-group"
import { Button } from "./ui/button"
import { Label } from "./ui/label"
import { toast } from "sonner"

export default function CreateTaskForm() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined)
  const [priority, setPriority] = useState("medium")
  const [completed, setCompleted] = useState(false)
  const [taskType, setTaskType] = useState("personal")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you can do more, like sending to an API
    toast("Task created successfully!")
  }

  return (
    <Card className="max-w-3xl mx-auto mt-10 p-6">
      <h2 className="text-2xl font-bold mb-6">Create New Task</h2>
      <form onSubmit={handleSubmit} className="space-y-6">

        <div>
          <Label className="block mb-1 font-medium" htmlFor="title">Task Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task title"
            required
          />
        </div>

        <div>
          <Label className="block mb-1 font-medium" htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Task details"
            rows={4}
          />
        </div>

        <div>
          <Label className="block mb-1 font-medium">Due Date</Label>
          <Calendar
            mode="single"
            selected={dueDate}
            onSelect={setDueDate}
            className="border rounded-md"
          />
        </div>

        <div>
          <Label className="block mb-1 font-medium">Priority</Label>
          <RadioGroup value={priority} onValueChange={setPriority} className="flex space-x-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="low" id="low" />
              <Label htmlFor="low">Low</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="medium" id="medium" />
              <Label htmlFor="medium">Medium</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="high" id="high" />
              <Label htmlFor="high">High</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="flex items-center space-x-4">
          <Label className="font-medium" htmlFor="completed">Completed</Label>
          <Switch
            id="completed"
            checked={completed}
            onCheckedChange={setCompleted}
          />
        </div>

        <div>
          <Label className="block mb-1 font-medium">Task Type</Label>
          <Select onValueChange={setTaskType} value={taskType}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select task type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="personal">Personal</SelectItem>
              <SelectItem value="work">Work</SelectItem>
              <SelectItem value="shopping">Shopping</SelectItem>
              <SelectItem value="others">Others</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button type="submit" className="w-full">
          Create Task
        </Button>
      </form>
    </Card>
  )
}
