"use client";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import Todos from "../todos/todos";
import { Filter } from "lucide-react";

export default function FiltersLabels() {
  const tasksByDueDate = useQuery(api.todos.getTasksSortedByDueDate) ?? [];

  if (tasksByDueDate === undefined) {
    return <p>Loading...</p>;
  }
  
  return (
    <div className="xl:px-40">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Filters & Labels</h1>
      </div>
      
      <div className="flex flex-col gap-1 py-4">
        <p className="font-bold flex text-sm items-center border-b-2 p-2 border-gray-100">
          <Filter className="h-4 w-4 mr-2" />
          Tasks By Due Date
        </p>
        {tasksByDueDate.length > 0 ? (
          <Todos items={tasksByDueDate} />
        ) : (
          <p className="text-sm text-gray-500 py-2">No upcoming tasks found</p>
        )}
      </div>
    </div>
  );
} 