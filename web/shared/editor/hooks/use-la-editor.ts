import * as React from "react"
import type { Editor } from "@tiptap/core"
import type { Content, EditorOptions, UseEditorOptions } from "@tiptap/react"
import { useEditor } from "@tiptap/react"
import { cn } from "@/lib/utils"
import { useThrottleCallback } from "@shared/hooks/use-throttle-callback"
import { blobUrlToBase64, getOutput } from "@shared/editor/lib/utils"

import { StarterKit } from "@shared/editor/extensions/starter-kit"
import { TaskList } from "@shared/editor/extensions/task-list"
import { TaskItem } from "@shared/editor/extensions/task-item"
import { HorizontalRule } from "@shared/editor/extensions/horizontal-rule"
import { Blockquote } from "@shared/editor/extensions/blockquote/blockquote"
import { SlashCommand } from "@shared/editor/extensions/slash-command"
import { Heading } from "@shared/editor/extensions/heading"
import { Link } from "@shared/editor/extensions/link"
import { CodeBlockLowlight } from "@shared/editor/extensions/code-block-lowlight"
import { Selection } from "@shared/editor/extensions/selection"
import { Code } from "@shared/editor/extensions/code"
import { Paragraph } from "@shared/editor/extensions/paragraph"
import { BulletList } from "@shared/editor/extensions/bullet-list"
import { OrderedList } from "@shared/editor/extensions/ordered-list"
import { Dropcursor } from "@shared/editor/extensions/dropcursor"
import { Image } from "../extensions/image"
import { FileHandler } from "../extensions/file-handler"

export interface UseLaEditorProps
  extends Omit<UseEditorOptions, "editorProps"> {
  value?: Content
  output?: "html" | "json" | "text"
  placeholder?: string
  editorClassName?: string
  throttleDelay?: number
  onUpdate?: (content: Content) => void
  onBlur?: (content: Content) => void
  editorProps?: EditorOptions["editorProps"]
}

const createExtensions = (placeholder: string) => [
  Heading,
  Code,
  Link,
  TaskList,
  TaskItem,
  Selection,
  Paragraph,
  Image.configure({
    allowedMimeTypes: ["image/*"],
    maxFileSize: 5 * 1024 * 1024,
    allowBase64: true,
    uploadFn: async (file) => {
      // wait 5s to simulate a slow upload
      await new Promise((resolve) => setTimeout(resolve, 5000))

      const url = await blobUrlToBase64(file)
      return url
    },
    onToggle(editor, files, pos) {
      files.forEach((file) =>
        editor.commands.insertContentAt(pos, {
          type: "image",
          attrs: { src: URL.createObjectURL(file) },
        }),
      )
    },
    onValidationError(errors) {
      errors.forEach((error) => {
        console.log("Image validation error", error)
      })
    },
    onActionSuccess(props) {
      console.log("Image action success", props)
    },
    onActionError(error, props) {
      console.error("Image action error", error, props)
    },
  }),
  FileHandler.configure({
    allowBase64: true,
    allowedMimeTypes: ["image/*"],
    maxFileSize: 5 * 1024 * 1024,
    onDrop: (editor, files, pos) => {
      files.forEach((file) =>
        editor.commands.insertContentAt(pos, {
          type: "image",
          attrs: { src: URL.createObjectURL(file) },
        }),
      )
    },
    onPaste: (editor, files) => {
      files.forEach((file) =>
        editor.commands.insertContent({
          type: "image",
          attrs: { src: URL.createObjectURL(file) },
        }),
      )
    },
    onValidationError: (errors) => {
      errors.forEach((error) => {
        console.log("File validation error", error)
      })
    },
  }),
  Dropcursor,
  Blockquote,
  BulletList,
  OrderedList,
  SlashCommand,
  HorizontalRule,
  CodeBlockLowlight,
  StarterKit.configure({
    placeholder: {
      placeholder: () => placeholder,
    },
  }),
]

export const useLaEditor = ({
  value,
  output = "html",
  placeholder = "",
  editorClassName,
  throttleDelay = 0,
  onUpdate,
  onBlur,
  editorProps,
  ...props
}: UseLaEditorProps) => {
  const throttledSetValue = useThrottleCallback(
    (editor: Editor) => {
      const content = getOutput(editor, output)
      onUpdate?.(content)
    },
    [output, onUpdate],
    throttleDelay,
  )

  const handleCreate = React.useCallback(
    (editor: Editor) => {
      if (value) {
        editor.commands.setContent(value)
      }
    },
    [value],
  )

  const handleBlur = React.useCallback(
    (editor: Editor) => {
      const content = getOutput(editor, output)
      onBlur?.(content)
    },
    [output, onBlur],
  )

  const mergedEditorProps = React.useMemo(() => {
    const defaultEditorProps: EditorOptions["editorProps"] = {
      attributes: {
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        class: cn("focus:outline-none", editorClassName),
      },
    }

    if (!editorProps) return defaultEditorProps

    return {
      ...defaultEditorProps,
      ...editorProps,
      attributes: {
        ...defaultEditorProps.attributes,
        ...editorProps.attributes,
      },
    }
  }, [editorProps, editorClassName])

  const editorOptions: UseEditorOptions = React.useMemo(
    () => ({
      extensions: createExtensions(placeholder),
      editorProps: mergedEditorProps,
      onUpdate: ({ editor }) => throttledSetValue(editor),
      onCreate: ({ editor }) => handleCreate(editor),
      onBlur: ({ editor }) => handleBlur(editor),
      ...props,
    }),
    [
      placeholder,
      mergedEditorProps,
      throttledSetValue,
      handleCreate,
      handleBlur,
      props,
    ],
  )

  return useEditor(editorOptions)
}

export default useLaEditor
