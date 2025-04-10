"use client";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Checkbox } from "../ui/checkbox";
import Task from "./task";
import { CircleCheckBig } from "lucide-react";
import Todos from "./todos";
import CompletedTodos from "./completed-todos";
import { AddTaskWrapper } from "../add-tasks/add-task-button";
import { Id } from "@/convex/_generated/dataModel";
import { GET_STARTED_PROJECT_ID } from "@/utils";

export default function TodoList({ projectId }: { projectId?: Id<"projects"> }) {
  const currentProjectId = projectId || (GET_STARTED_PROJECT_ID as Id<"projects">);
  
  const todos = useQuery(api.todos.getTodosByProjectId, { projectId: currentProjectId }) ?? [];
  const completedTodos = useQuery(api.todos.getCompletedTodosByProjectId, { projectId: currentProjectId }) ?? [];
  const inCompleteTodos = useQuery(api.todos.getInCompleteTodosByProjectId, { projectId: currentProjectId }) ?? [];
  const totalTodos = useQuery(api.todos.getTodosTotalByProjectId, { projectId: currentProjectId }) ?? 0;

  console.log('Current Project ID:', currentProjectId);
  console.log('All Todos:', todos);
  console.log('Completed Todos:', completedTodos);
  console.log('Incomplete Todos:', inCompleteTodos);
  console.log('Total Todos:', totalTodos);

  if (
    todos === undefined ||
    completedTodos === undefined ||
    inCompleteTodos === undefined
  ) {
    return <p>Loading...</p>;
  }
  return (
    <div className="w-full px-2 sm:px-4 md:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Inbox</h1>
      </div>
      <div className="flex flex-col gap-1 py-4">
        <Todos items={inCompleteTodos} />
      </div>
      <AddTaskWrapper projectId={currentProjectId} />
      <div className="flex flex-col gap-1 py-4">
        <Todos items={completedTodos} />
      </div>
      <CompletedTodos totalTodos={totalTodos} />
    </div>
  );
}
