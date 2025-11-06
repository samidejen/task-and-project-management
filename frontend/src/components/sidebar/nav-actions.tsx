"use client";

import * as React from "react";
import { Plus, FolderPlus, ClipboardPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";

/* shadcn/ui components */
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ThemeToggle from "../navbar/ThemeToggle";

/* API hooks */
import { useCreateProjectMutation } from "@/redux/services/projectApi";
import { useCreateTaskMutation } from "@/redux/services/taskApi";

type CreateType = "project" | "task";

export function NavActions() {
  const [open, setOpen] = React.useState(false);
  const [mode, setMode] = React.useState<CreateType | null>(null);
  const navigate = useNavigate();

  // Shared fields
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");

  // Project-specific
  const [projectKey, setProjectKey] = React.useState("");
  const [lead, setLead] = React.useState("");

  // Task-specific
  const [assignee, setAssignee] = React.useState("");
  const [priority, setPriority] = React.useState<"Low" | "Medium" | "High">(
    "Medium"
  );
  const [dueDate, setDueDate] = React.useState("");

  // basic validation/errors
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [serverError, setServerError] = React.useState<string | null>(null);

  // RTK Query mutations
  const [createProject, { isLoading: creatingProject }] =
    useCreateProjectMutation();
  const [createTask, { isLoading: creatingTask }] = useCreateTaskMutation();

  const resetForm = React.useCallback(() => {
    setName("");
    setDescription("");
    setProjectKey("");
    setLead("");
    setAssignee("");
    setPriority("Medium");
    setDueDate("");
    setErrors({});
    setServerError(null);
    setMode(null);
  }, []);

  const openFor = (t: CreateType) => {
    setMode(t);
    setOpen(true);
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!mode) {
      e.mode = "Please select Project or Task.";
    }
    if (!name.trim()) {
      e.name = "Name is required.";
    }
    if (mode === "project") {
      if (!projectKey.trim()) e.projectKey = "Project key is required.";
      if (!lead.trim()) e.lead = "Project lead is required.";
    }
    if (mode === "task") {
      if (!assignee.trim()) e.assignee = "Assignee is required.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setServerError(null);

    if (!validate() || !mode) return;

    try {
      if (mode === "project") {
        const payload = {
          name: name.trim(),
          key: projectKey.trim(),
          description: description.trim(),
          lead: lead.trim(),
        } as const;

        // call API
        const result = await createProject(payload).unwrap();
        // close dialog and navigate to created project (if API returns id/key)
        setOpen(false);
        setTimeout(() => {
          // if API returns a key or id, prefer using it for navigation. Fallback to /projects
          const projectKeyOrId =
            (result as any).key ||
            (result as any).id ||
            projectKey.trim() ||
            "";
          if (projectKeyOrId) {
            navigate(`/projects/${projectKeyOrId}`);
          } else {
            navigate("/projects");
          }
          resetForm();
        }, 150);
      } else {
        const payload = {
          title: name.trim(),
          description: description.trim(),
          assignee: assignee.trim(),
          priority,
          dueDate: dueDate || null,
        } as const;

        const result = await createTask(payload).unwrap();
        setOpen(false);
        setTimeout(() => {
          const taskId = (result as any).id;
          if (taskId) {
            navigate(`/tasks/${taskId}`);
          } else {
            navigate("/tasks");
          }
          resetForm();
        }, 150);
      }
    } catch (err: any) {
      // unwrap throws the error payload from the server; provide feedback to user
      // err could be { data: { message: '...' } } or a string depending on server
      const message =
        err?.data?.message ||
        err?.message ||
        "Failed to create. Please try again.";
      setServerError(String(message));
    }
  };

  const isSubmitting = creatingProject || creatingTask;

  return (
    <div className="flex items-center gap-4 text-sm sm:gap-6">
      <Dialog
        open={open}
        onOpenChange={(val) => {
          if (!val) resetForm();
          setOpen(val);
        }}
      >
        <DialogTrigger asChild>
          <Button className="bg-[#ed7b16] text-white px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm hover:bg-[#e95e08]">
            <Plus className="w-3 h-3 mr-1 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Create</span>
          </Button>
        </DialogTrigger>

        <DialogContent className="w-[90vw] max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Create New</DialogTitle>
          </DialogHeader>

          <div className="mt-4 sm:mt-6">
            <div className="flex gap-2 mb-4">
              <Button
                variant={mode === "project" ? undefined : "ghost"}
                onClick={() => openFor("project")}
                className="flex items-center gap-2 py-2"
              >
                <FolderPlus className="w-4 h-4" />
                Project
              </Button>

              <Button
                variant={mode === "task" ? undefined : "ghost"}
                onClick={() => openFor("task")}
                className="flex items-center gap-2 py-2"
              >
                <ClipboardPlus className="w-4 h-4" />
                Task
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="flex flex-col">
                  <Label className="text-xs">Name / Title</Label>
                  <Input
                    value={name}
                    onChange={(ev) => setName(ev.target.value)}
                    placeholder={
                      mode === "project"
                        ? "Project name (e.g. Website Redesign)"
                        : "Task title (e.g. Add login form)"
                    }
                    className="mt-1"
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-red-600">{errors.name}</p>
                  )}
                </div>

                <div className="flex flex-col">
                  <Label className="text-xs">Description</Label>
                  <Textarea
                    value={description}
                    onChange={(ev) => setDescription(ev.target.value)}
                    className="mt-1"
                    rows={4}
                    placeholder="Add a brief description..."
                  />
                </div>

                {mode === "project" && (
                  <>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="flex flex-col">
                        <Label className="text-xs">Project Key</Label>
                        <Input
                          value={projectKey}
                          onChange={(ev) =>
                            setProjectKey(ev.target.value.toUpperCase())
                          }
                          placeholder="PROJ"
                          maxLength={10}
                          className="mt-1"
                        />
                        {errors.projectKey && (
                          <p className="mt-1 text-xs text-red-600">
                            {errors.projectKey}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col">
                        <Label className="text-xs">Project Lead</Label>
                        <Input
                          value={lead}
                          onChange={(ev) => setLead(ev.target.value)}
                          placeholder="name or email"
                          className="mt-1"
                        />
                        {errors.lead && (
                          <p className="mt-1 text-xs text-red-600">
                            {errors.lead}
                          </p>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {mode === "task" && (
                  <>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="flex flex-col">
                        <Label className="text-xs">Assignee</Label>
                        <Input
                          value={assignee}
                          onChange={(ev) => setAssignee(ev.target.value)}
                          placeholder="username or email"
                          className="mt-1"
                        />
                        {errors.assignee && (
                          <p className="mt-1 text-xs text-red-600">
                            {errors.assignee}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col">
                        <Label className="text-xs">Priority</Label>
                        <Select
                          onValueChange={(val) => setPriority(val as any)}
                          defaultValue={priority}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Low">Low</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="High">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <Label className="text-xs">Due Date</Label>
                      <Input
                        type="date"
                        value={dueDate}
                        onChange={(ev) => setDueDate(ev.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </>
                )}

                {errors.mode && (
                  <p className="text-xs text-red-600">{errors.mode}</p>
                )}

                {serverError && (
                  <p className="text-xs text-red-600">Error: {serverError}</p>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 mt-2">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setOpen(false);
                    resetForm();
                  }}
                  type="button"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-[#ed7b16] text-white hover:bg-[#e95e08]"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? "Creating..."
                    : mode === "project"
                    ? "Create Project"
                    : mode === "task"
                    ? "Create Task"
                    : "Continue"}
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      <ThemeToggle />
    </div>
  );
}
