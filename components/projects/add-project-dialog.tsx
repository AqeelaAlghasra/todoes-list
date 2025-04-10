"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { api } from "@/convex/_generated/api";
import { useAction } from "convex/react";
import { EllipsisIcon, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "../ui/use-toast";
import { Id } from "@/convex/_generated/dataModel";
import { GET_STARTED_PROJECT_ID } from "@/utils";
import {
  Dialog,
  // DialogAction,
  // DialogCancel,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useState } from "react";
import { Button } from "../ui/button";

export default function DeleteProject({
  projectId,
}: {
  projectId: Id<"projects">;
}) {
  const { toast } = useToast();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const deleteProject = useAction(api.projects.deleteProjectAndItsTasks);

  const handleDelete = async () => {
    if (projectId === GET_STARTED_PROJECT_ID) {
      toast({
        title: "Protected Project",
        description: "System projects cannot be deleted",
        duration: 3000,
      });
      return;
    }

    try {
      setIsDeleting(true);
      await deleteProject({ projectId });
      
      toast({
        title: "Project Deleted",
        description: "Your project and its tasks have been removed",
        duration: 3000,
      });
      router.push("/loggedin/projects");
    } catch (error) {
      toast({
        title: "Deletion Failed",
        description: "Could not delete project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setIsOpen(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <EllipsisIcon className="w-5 h-5" />
            <span className="sr-only">Project options</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            className="text-red-600 focus:text-red-700 cursor-pointer"
            onSelect={() => setIsOpen(true)}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Project
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the
              project and all associated tasks.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            {/* <DialogCancel disabled={isDeleting}>
              Cancel
            </DialogCancel> */}
            {/* <DialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Delete Project"}
            </DialogAction> */}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
