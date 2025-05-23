import { uploadCsv } from "@/api/csv";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "@/components/ui/dropzone";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { Loader, Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function UploadButton() {
  const queryClient = useQueryClient();

  const [files, setFiles] = useState<File[] | undefined>();

  const handleDrop = (files: File[]) => {
    setFiles(files);
  };

  const mutation = useMutation({
    mutationFn: uploadCsv,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["csv"] });
    },
  });

  const handleUpload = () => {
    mutation.mutate(files![0], {
      onSuccess: () => {
        toast.success("CSV file uploaded.");
      },
      onError: (err) => {
        toast.error("Error while uploading CSV file: ", {
            description: <p className="text-red-600">{JSON.stringify(((err as AxiosError).response as any).data.message)}</p>
        })
      }
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="cursor-pointer">
          <Upload />
          Upload File
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] p-2 sm:p-6">
        <DialogHeader>
          <DialogTitle>Upload</DialogTitle>
        </DialogHeader>
        <div className="flex items-center justify-center p-0">
          <Dropzone
            accept={{ "text/csv": [] }}
            onDrop={handleDrop}
            src={files}
            onError={console.error}
            className="cursor-pointer"
          >
            <DropzoneEmptyState />
            <DropzoneContent />
          </Dropzone>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            className="cursor-pointer"
            disabled={!files || mutation.isPending}
            onClick={() => handleUpload()}
          >
            {mutation.isPending ? <Loader/> : undefined}
            Upload
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
