"use client";
import { AddTaskWrapper } from "@/components/add-tasks/add-task-button";
import SuggestMissingTasks from "@/components/add-tasks/suggest-tasks";
import MobileNav from "@/components/nav/mobile-nav";
import SideBar from "@/components/nav/side-bar";
import DeleteProject from "@/components/projects/delete-project";
import CompletedTodos from "@/components/todos/completed-todos";
import Todos from "@/components/todos/todos";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { useParams } from "next/navigation";

export default function Page() {
  const { labelId } = useParams<{ labelId: Id<"labels"> }>();

  
  const label = useQuery(api.labels.getLabelByLabelId, {
    labelId,
  });
  const inCompletedTodosByLabel =
    useQuery(api.todos.getInCompletedTodosByLabelId, {
      labelId,
    }) || 0;
  const CompletedTodosByLabel =
    useQuery(api.todos.getCompletedTodosByLabelId, {
      labelId,
    }) || 0;
  const labelTodosTotal =
    useQuery(api.todos.getTodosTotalByLabelId, {
      labelId,
    }) || 0;

  const labelName = label?.name || "";

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <SideBar />
      <div className="flex flex-col">
        <MobileNav navTitle={"My Projects"} navLink="/loggedin/projects" />

        <main className="flex flex-1 flex-col gap-4 p-4 lg:px-8">
          <div className="xl:px-40">
            <div className="flex items-center justify-between flex-wrap gap-2 lg:gap-0">
              <h1 className="text-lg font-semibold md:text-2xl">
                {labelId || "Label"}
              </h1>
              
            </div>
            {/* <div className="flex flex-col gap-1 mt-4">
              <Todos items={inCompletedTodosByLabel} />


              <Todos items={CompletedTodosByLabel} />
              <div className="flex items-center space-x-4 gap-2 border-b-2 p-2 border-gray-100 text-sm text-foreground/80">
                <CompletedTodos totalTodos={labelTodosTotal} />
              </div>
            </div> */}
          </div>
        </main>
      </div>
    </div>
  );
}
