'use client';

import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '../ui/form';
import { z } from 'zod';
import { AnswerSchma } from '@/lib/validations';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRef, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { useTheme } from '@/context/ThemeProvider';
import { Button } from '../ui/button';
import Image from 'next/image';
import { createAnswer } from '@/lib/actions/answer.action';
import { usePathname } from 'next/navigation';
import { toast } from '../ui/use-toast';

interface Props {
  question: string;
  questionId: string;
  authorId: string;
}

const Answer = ({ question, questionId, authorId }: Props) => {
  const { mode } = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittingAI, setIsSubmittingAI] = useState(false);
  const pathname = usePathname();
  const editorRef = useRef(null);
  const form = useForm<z.infer<typeof AnswerSchma>>({
    resolver: zodResolver(AnswerSchma),
    defaultValues: {
      answer: ''
    }
  });

  const handleCreatAnswer = async (values: z.infer<typeof AnswerSchma>) => {
    setIsSubmitting(true);
    try {
      await createAnswer({
        content: values.answer,
        author: JSON.parse(authorId),
        question: JSON.parse(questionId),
        path: pathname
      });

      toast({
        title: `${values.answer && 'Answer posted'}`,
        description: 'Your answer has been posted successfully'
      });

      form.reset();

      if (editorRef.current) {
        const editor = editorRef.current as any;
        editor.setContent('');
      }
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateAiAnswer = async () => {
    if (!authorId) return;
    setIsSubmittingAI(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/chatgpt`,
        {
          method: 'POST',
          body: JSON.stringify({ question })
        }
      );

      const aiAnswer = await response.json();

      // convert plaintext to html
      const formatedAnswer = aiAnswer.reply.replace(/\n/g, '<br />');
      if (editorRef.current) {
        const editor = editorRef.current as any;
        editor.setContent(formatedAnswer);
      }

      //  toast notification
      return toast({
        title: `${aiAnswer.reply && 'Ai answer generated'}`,
        description: 'Ai answer generated successfully'
      });
    } catch (error: any) {
      return toast({
        title: `${error?.message}`,
        variant: 'destructive',
        description: `${error?.code}`
      });
    } finally {
      setIsSubmittingAI(false);
    }
  };
  return (
    <div className="mt-8">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
        <h4 className="paragraph-semibold text-dark400_light800">
          Write your answer here
        </h4>
        <Button
          className="btn light-border-2 gap-1.5 rounded-md px-4 py-2.5 text-primary-500 shadow-none dark:text-primary-500 "
          onClick={generateAiAnswer}
        >
          {isSubmittingAI ? (
            <>Generating...</>
          ) : (
            <>
              <Image
                src="/assets/icons/stars.svg"
                alt="star"
                width={12}
                height={12}
                className="object-contain"
              />
              Generate AI answer
            </>
          )}
        </Button>
      </div>
      <Form {...form}>
        <form
          className="mt-6 flex w-full flex-col gap-10"
          onSubmit={form.handleSubmit(handleCreatAnswer)}
        >
          <FormField
            control={form.control}
            name="answer"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col">
                <FormControl className="mt-3.5 ">
                  <Editor
                    apiKey={process.env.NEXT_PUBLIC_TINY_EDITOR_API_KEY}
                    onBlur={field.onBlur}
                    onEditorChange={(content) => field.onChange(content)}
                    onInit={(evt, editor) => {
                      // @ts-ignore
                      editorRef.current = editor;
                    }}
                    init={{
                      height: 350,
                      menubar: false,
                      plugins: [
                        'advlist',
                        'autolink',
                        'lists',
                        'link',
                        'image',
                        'charmap',
                        'preview',
                        'anchor',
                        'searchreplace',
                        'visualblocks',
                        'codesample',
                        'fullscreen',
                        'insertdatetime',
                        'media',
                        'table'
                      ],
                      toolbar:
                        'undo redo |  ' +
                        'codesample | bold italic forecolor | alignleft aligncenter ' +
                        'alignright alignjustify | bullist numlist ',
                      content_style:
                        'body { font-family:Inter; font-size:16px }',
                      skin: mode === 'dark' ? 'oxide-dark' : 'oxide',
                      content_css: mode === 'dark' ? 'dark' : 'light'
                    }}
                  />
                </FormControl>

                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Button
              type="submit"
              className="primary-gradient w-fit text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
export default Answer;
