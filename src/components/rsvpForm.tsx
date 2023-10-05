"use client";
import z from "zod";
import { useForm } from "react-hook-form";
import { RsvpAcceptSchema } from "@/lib/schema";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from "./ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useMutation } from "@tanstack/react-query";
import ConfettiExplosion from "react-confetti-explosion";
import axios from "axios";
import { useState } from "react";
/*Types */
type Props = {
  slug: string;
  title: string | undefined;
  description: string | undefined;
  your_name_label: string | undefined;
  buttonLabel: string | undefined;
  email_address_label: string | undefined;
  primaryColor: string | undefined;
  your_name_display: boolean | undefined;
  your_name_placeholder: string | undefined;
  email_address_placeholder: string | undefined;
  email_address_display: boolean | undefined;
};

type Input = z.infer<typeof RsvpAcceptSchema>;

function RsvpForm({
  slug,
  title,
  description,
  your_name_label,
  buttonLabel,
  email_address_label,
  primaryColor,
  your_name_display,
  your_name_placeholder,
  email_address_placeholder,
  email_address_display,

}: Props) {
  const [success, setSucess] = useState(false);
  const form = useForm<Input>({
    resolver: zodResolver(RsvpAcceptSchema),
    defaultValues: {
      name: "",
      email: "",
      attending: undefined,
      event_id: slug,
    },
  });

  const { mutate: createEvent, isLoading } = useMutation({
    mutationFn: async ({ name, email, event_id, attending }: Input) => {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}api/rsvp`,
        {
          name,
          email,
          event_id,
          attending,
        }
      );
      return res.data;
    },
  });

  /*Submit Functionality */
  function onSubmit(input: Input) {
    createEvent(
      {
        name: input.name,
        email: input.email,
        attending: input.attending,
        event_id: slug,
      },
      {
        onSuccess: () => {
          setSucess(true);
        },
        onError: () => {
          alert("Something went wrong");
        },
      }
    );
  }

  return (
    <div className="min-h-full">
      <div className="flex flex-1">
        {success && (
          <ConfettiExplosion
            duration={3000}
            particleCount={400}
            width={2000}
            force={0.9}
          />
        )}
        <main className="flex flex-col items-center justify-center flex-1 flex-shrink-0 px-5 pt-16 pb-8 border-r shadow-lg h-screen bg-slate-100">
          <Card className="w-[425px] relative">
            <CardHeader>
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  {your_name_display && (
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{your_name_label}</FormLabel>
                          <FormControl>
                            <Input
                              placeholder={your_name_placeholder}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  {email_address_display && (
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{email_address_label}</FormLabel>
                          <FormControl>
                            <Input
                              placeholder={email_address_placeholder}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  <FormField
                    control={form.control}
                    name="attending"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Attending Status</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your rsvp status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="going">Attending</SelectItem>
                            <SelectItem value="not_sure">Probably</SelectItem>
                            <SelectItem value="not_going">
                              Not Attending
                            </SelectItem>
                          </SelectContent>
                        </Select>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="w-full mt-4 tracking-tight leading-none text-lg"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {isLoading ? (
                      <div className="flex space-x-2 animate-pulse">
                        <div className="h-2 w-2 rounded-full bg-white animate-[bounce_3s_infinite]" />
                        <div className="h-2 w-2 rounded-full bg-white animate-[bounce_1.5s_infinite]" />
                        <div className="h-2 w-2 rounded-full bg-white animate-bounce" />
                      </div>
                    ) : (
                      <p>{buttonLabel}</p>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
            <a
              href="https://eventory.vercel.app"
              target="blank"
              className="absolute -bottom-3 right-4 bg-white ring-1 ring-purple-500 shadow-lg shadow-fuchsia-500 px-2 rounded-2xl h-5 text-primary font-semibold text-sm hover:shadow-xl hover:shadow-fuchsia-600"
            >
              Eventory
            </a>
          </Card>
        </main>
        <div
          style={{ backgroundColor: primaryColor }}
          className="basis-[40%]"
        />
      </div>
    </div>
  );
}

export default RsvpForm;
