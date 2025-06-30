"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import TextAlign from "@tiptap/extension-text-align"
import Underline from "@tiptap/extension-underline"
import Strike from "@tiptap/extension-strike"
import Subscript from "@tiptap/extension-subscript"
import Superscript from "@tiptap/extension-superscript"
import TextStyle from "@tiptap/extension-text-style"
import Color from "@tiptap/extension-color"
import Highlight from "@tiptap/extension-highlight"
import FontFamily from "@tiptap/extension-font-family"
import Table from "@tiptap/extension-table"
import TableRow from "@tiptap/extension-table-row"
import TableHeader from "@tiptap/extension-table-header"
import TableCell from "@tiptap/extension-table-cell"
import Image from "@tiptap/extension-image"
import Link from "@tiptap/extension-link"
import Youtube from "@tiptap/extension-youtube"
import { useState, useCallback, useRef } from "react"
import {
  Bold,
  Italic,
  UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  ImageIcon,
  Video,
  TableIcon,
  LinkIcon,
  Palette,
  Highlighter,
  Type,
  SubscriptIcon as SubIcon,
  SuperscriptIcon as SupIcon,
  Undo,
  Redo,
  Eye,
  Printer,
  Maximize,
  MoreHorizontal,
  Mic,
  ChevronDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export function ComprehensiveEditor({ content = "", onChange, placeholder = "Start typing..." }) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [linkUrl, setLinkUrl] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [videoUrl, setVideoUrl] = useState("")
  const [isListening, setIsListening] = useState(false)
  const fileInputRef = useRef(null)

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Underline,
      Strike,
      Subscript,
      Superscript,
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      FontFamily,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Link.configure({
        openOnClick: false,
      }),
      Youtube.configure({
        width: 640,
        height: 480,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[400px] p-4 max-w-none",
      },
    },
  })

  const addImage = useCallback(() => {
    if (imageUrl && editor) {
      editor.chain().focus().setImage({ src: imageUrl }).run()
      setImageUrl("")
    }
  }, [editor, imageUrl])

  const addLink = useCallback(() => {
    if (linkUrl && editor) {
      editor.chain().focus().setLink({ href: linkUrl }).run()
      setLinkUrl("")
    }
  }, [editor, linkUrl])

  const addYouTube = useCallback(() => {
    if (videoUrl && editor) {
      editor.chain().focus().setYoutubeVideo({ src: videoUrl }).run()
      setVideoUrl("")
    }
  }, [editor, videoUrl])

  const insertTable = useCallback(() => {
    editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
  }, [editor])

  const handleFileUpload = useCallback(
    (event) => {
      const file = event.target.files?.[0]
      if (file && editor) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const src = e.target?.result
          editor.chain().focus().setImage({ src }).run()
        }
        reader.readAsDataURL(file)
      }
    },
    [editor],
  )

  const startVoiceInput = useCallback(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition
      const recognition = new SpeechRecognition()

      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = "en-US"

      recognition.onstart = () => setIsListening(true)
      recognition.onend = () => setIsListening(false)

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0])
          .map((result) => result.transcript)
          .join("")

        if (editor) {
          editor.chain().focus().insertContent(transcript).run()
        }
      }

      recognition.start()
    }
  }, [editor])

  const printContent = useCallback(() => {
    const printWindow = window.open("", "_blank")
    if (printWindow && editor) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Print</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .prose { max-width: none; }
            </style>
          </head>
          <body>
            <div className="prose">${editor.getHTML()}</div>
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }, [editor])

  const getWordCount = () => {
    if (!editor) return { words: 0, characters: 0 }
    const text = editor.getText()
    return {
      words: text.split(/\s+/).filter((word) => word.length > 0).length,
      characters: text.length,
    }
  }

  if (!editor) {
    return null
  }

  const { words, characters } = getWordCount()

  return (
    <div className={`border rounded-lg ${isFullscreen ? "fixed inset-0 z-50 bg-white" : ""}`}>
      {/* Main Toolbar */}
      <div className="border-b p-2 flex items-center gap-1 flex-wrap bg-gray-50">
        {/* Basic Formatting */}
        <Button
          variant={editor.isActive("bold") ? "default" : "ghost"}
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="h-4 w-4" />
        </Button>

        <Button
          variant={editor.isActive("italic") ? "default" : "ghost"}
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="h-4 w-4" />
        </Button>

        <Button
          variant={editor.isActive("underline") ? "default" : "ghost"}
          size="sm"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <UnderlineIcon className="h-4 w-4" />
        </Button>

        <Button
          variant={editor.isActive("strike") ? "default" : "ghost"}
          size="sm"
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <Strikethrough className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-6" />

        {/* Font Style */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <Type className="h-4 w-4" />
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => editor.chain().focus().setFontFamily("Arial").run()}>
              Arial
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => editor.chain().focus().setFontFamily("Georgia").run()}>
              Georgia
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => editor.chain().focus().setFontFamily("Times New Roman").run()}>
              Times New Roman
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => editor.chain().focus().setFontFamily("Courier New").run()}>
              Courier New
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Text Color */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <Palette className="h-4 w-4" />
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <div className="grid grid-cols-6 gap-1 p-2">
              {[
                "#000000",
                "#FF0000",
                "#00FF00",
                "#0000FF",
                "#FFFF00",
                "#FF00FF",
                "#00FFFF",
                "#FFA500",
                "#800080",
                "#008000",
                "#FFC0CB",
                "#A52A2A",
              ].map((color) => (
                <button
                  key={color}
                  className="w-6 h-6 rounded border"
                  style={{ backgroundColor: color }}
                  onClick={() => editor.chain().focus().setColor(color).run()}
                />
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Highlight */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <Highlighter className="h-4 w-4" />
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <div className="grid grid-cols-6 gap-1 p-2">
              {["#FFFF00", "#00FF00", "#00FFFF", "#FF00FF", "#FFA500", "#FFC0CB"].map((color) => (
                <button
                  key={color}
                  className="w-6 h-6 rounded border"
                  style={{ backgroundColor: color }}
                  onClick={() => editor.chain().focus().setHighlight({ color }).run()}
                />
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <Separator orientation="vertical" className="h-6" />

        {/* Lists */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={editor.isActive("bulletList") ? "default" : "ghost"} size="sm">
              <List className="h-4 w-4" />
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-white">
            <DropdownMenuItem onClick={() => editor.chain().focus().toggleBulletList().run()}>
              Bullet List
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => editor.chain().focus().toggleOrderedList().run()}>
              Numbered List
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={editor.isActive("orderedList") ? "default" : "ghost"} size="sm">
              <ListOrdered className="h-4 w-4" />
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-white">
            <DropdownMenuItem onClick={() => editor.chain().focus().toggleOrderedList().run()}>
              1. 2. 3.
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => editor.chain().focus().toggleOrderedList().run()}>
              a. b. c.
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => editor.chain().focus().toggleOrderedList().run()}>
              i. ii. iii.
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Alignment */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <AlignLeft className="h-4 w-4" />
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-white">
            <DropdownMenuItem onClick={() => editor.chain().focus().setTextAlign("left").run()}>
              <AlignLeft className="h-4 w-4 mr-2" /> Left
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => editor.chain().focus().setTextAlign("center").run()}>
              <AlignCenter className="h-4 w-4 mr-2" /> Center
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => editor.chain().focus().setTextAlign("right").run()}>
              <AlignRight className="h-4 w-4 mr-2" /> Right
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => editor.chain().focus().setTextAlign("justify").run()}>
              <AlignJustify className="h-4 w-4 mr-2" /> Justify
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Separator orientation="vertical" className="h-6" />

        {/* Subscript/Superscript */}
        <Button
          variant={editor.isActive("subscript") ? "default" : "ghost"}
          size="sm"
          onClick={() => editor.chain().focus().toggleSubscript().run()}
        >
          <SubIcon className="h-4 w-4" />
        </Button>

        <Button
          variant={editor.isActive("superscript") ? "default" : "ghost"}
          size="sm"
          onClick={() => editor.chain().focus().toggleSuperscript().run()}
        >
          <SupIcon className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-6" />

        {/* Media */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm">
              <ImageIcon className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle>Insert Image</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="image-url">Image URL</Label>
                <Input
                  id="image-url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div>
                <Label htmlFor="image-file">Or upload file</Label>
                <Input id="image-file" type="file" accept="image/*" ref={fileInputRef} onChange={handleFileUpload} />
              </div>
              <Button onClick={addImage}>Insert Image</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm">
              <Video className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Insert Video</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="video-url">YouTube URL</Label>
                <Input
                  id="video-url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>
              <Button onClick={addYouTube}>Insert Video</Button>
            </div>
          </DialogContent>
        </Dialog> */}

        <Button variant="ghost" size="sm" onClick={insertTable}>
          <TableIcon className="h-4 w-4" />
        </Button>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm">
              <LinkIcon className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle>Insert Link</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="link-url">URL</Label>
                <Input
                  id="link-url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com"
                />
              </div>
              <Button onClick={addLink}>Insert Link</Button>
            </div>
          </DialogContent>
        </Dialog>

        <Separator orientation="vertical" className="h-6" />

        {/* Voice Input */}
        <Button variant={isListening ? "default" : "ghost"} size="sm" onClick={startVoiceInput}>
          <Mic className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-6" />

        {/* History */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        >
          <Undo className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        >
          <Redo className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-6" />

        {/* View Options */}
        <Button variant={showPreview ? "default" : "ghost"} size="sm" onClick={() => setShowPreview(!showPreview)}>
          <Eye className="h-4 w-4" />
        </Button>

        <Button variant="ghost" size="sm" onClick={printContent}>
          <Printer className="h-4 w-4" />
        </Button>

        <Button variant={isFullscreen ? "default" : "ghost"} size="sm" onClick={() => setIsFullscreen(!isFullscreen)}>
          <Maximize className="h-4 w-4" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-white">
            <DropdownMenuItem onClick={() => editor.chain().focus().clearContent().run()}>Clear All</DropdownMenuItem>
            <DropdownMenuItem onClick={() => editor.chain().focus().selectAll().run()}>Select All</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(editor.getHTML())}>
              Copy HTML
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(editor.getText())}>
              Copy Text
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Editor Content */}
      <div className="flex">
        <div className={showPreview ? "w-1/2" : "w-full"}>
          <EditorContent editor={editor} className="min-h-[400px]" />
        </div>

        {showPreview && (
          <div className="w-1/2 border-l">
            <div className="p-4 bg-gray-50 border-b">
              <h3 className="font-semibold">Preview</h3>
            </div>
            <div className="prose prose-sm p-4 max-w-none" dangerouslySetInnerHTML={{ __html: editor.getHTML() }} />
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="border-t p-2 flex justify-between items-center text-sm text-gray-600 bg-gray-50">
        <div className="flex items-center gap-4">
          <span>CHARS: {characters}</span>
          <span>WORDS: {words}</span>
        </div>
        <div className="text-xs">POWERED BY TIPTAP</div>
      </div>
    </div>
  )
}
