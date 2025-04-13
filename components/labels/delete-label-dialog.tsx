import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
  import { api } from "@/convex/_generated/api";
  import { useAction, useMutation } from "convex/react";
  import { EllipsisIcon, Trash2 } from "lucide-react";
  import { useRouter } from "next/navigation";
  import { useForm } from "react-hook-form";
  import { useToast } from "../ui/use-toast";
  import { Id } from "@/convex/_generated/dataModel";
  import { GET_STARTED_PROJECT_ID } from "@/utils";
  
  export default function DeleteLabel({
    labelId,
  }: {
    labelId: Id<"projects">;
  }) {
    const form = useForm({ defaultValues: { name: "" } });
    const { toast } = useToast();
    const router = useRouter();
  
    const deleteLabel = useAction(api.Labels.deleteLabelAndItsTasks);
  
    const onSubmit = async () => {
      if (label === GET_STARTED_LABEL_ID) {
        toast({
          title: "🤗 Just a reminder",
          description: "System projects are protected from deletion.",
          duration: 3000,
        });
      } else {
        const deleteTaskId = await deleteProject({ projectId });
  
        if (deleteTaskId !== undefined) {
          toast({
            title: "🗑️ Successfully deleted a project",
            duration: 3000,
          });
          router.push(`/loggedin/projects`);
        }
      }
    };
  
    return (
      <DropdownMenu>
        <DropdownMenuTrigger>
          <EllipsisIcon className="w-5 h-5 text-foreground hover:cursor-pointer" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel className="w-40 lg:w-56">
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <button type="submit" className="flex gap-2">
                <Trash2 className="w-5 h-5 rotate-45 text-foreground/40" /> Delete
                Project
              </button>
            </form>
          </DropdownMenuLabel>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
  