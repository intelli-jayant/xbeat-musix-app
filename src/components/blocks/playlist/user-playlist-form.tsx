import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { newPlaylistSchema } from "@/lib/validations";
import { toast } from "sonner";
import { createNewPlaylist } from "@/actions/playlist";
import type { User } from "next-auth";

type FormData = z.infer<typeof newPlaylistSchema>;
const defaultValues: FormData = {
  name: "",
  description: "",
};

type UserPlaylistFormProps = {
  user: User | undefined;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const UserPlaylistForm = ({ user, setOpen }: UserPlaylistFormProps) => {
  const form = useForm<FormData>({
    resolver: zodResolver(newPlaylistSchema),
    defaultValues,
  });

  function onSubmit({ name, description }: FormData) {
    try {
      if (!!user && !!user?.id) {
        toast.promise(
          createNewPlaylist({ name, description, userId: user.id }),
          {
            loading: "Creating playlist...",
            success: (d) => `Playlist "${d.name}" created successfully`,
            error: (e) => e.message,
            finally: () => setOpen(false),
          }
        );
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 px-4 md:px-0"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Playlist name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full md:w-fit">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default UserPlaylistForm;
