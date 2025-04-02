import { Editor } from "@tiptap/react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { AlignCenter, AlignLeft, AlignRight, Bold, Italic, ListIcon, ListOrdered, Redo, Strikethrough, Undo } from "lucide-react";
import { Toggle } from "../ui/toggle";
import { cn } from "@/lib/utils";
import TextAlign from "@tiptap/extension-text-align";
import { Button } from "../ui/button";


interface iAppProps{
    editor: Editor | null;
}

export function MenuBar({editor}: iAppProps) {
     if(!editor) {
        return null;
     }
     return(
        <div className="border rounded-t-lg p-2 bg-card flex flex-wrap gap-1 items-center">
                <TooltipProvider>
                    <div className="flex flex-wrap gap-1">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Toggle size="sm" pressed={editor.isActive("bold")} onPressedChange={()=> editor.chain().focus().toggleBold().run()}
                                    className={cn( editor.isActive("bold") && 'bg-muted text-muted-foreground')}>
                                <Bold/>
                                </Toggle>
                            </TooltipTrigger>
                            <TooltipContent>Bold</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Toggle size="sm" pressed={editor.isActive("Italic")} onPressedChange={()=> editor.chain().focus().toggleItalic().run()}
                                    className={cn( editor.isActive("Italic") && 'bg-muted text-muted-foreground')}>
                                <Italic/>
                                </Toggle>
                            </TooltipTrigger>
                            <TooltipContent>Italic</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Toggle size="sm" pressed={editor.isActive("strike")} onPressedChange={()=> editor.chain().focus().toggleStrike().run()}
                                    className={cn( editor.isActive("strike") && 'bg-muted text-muted-foreground')}>
                                <Strikethrough/>
                                </Toggle>
                            </TooltipTrigger>
                            <TooltipContent>Strike</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Toggle size="sm" pressed={editor.isActive("bulletList")} onPressedChange={()=> editor.chain().focus().toggleBulletList().run()}
                                    className={cn( editor.isActive("bulletList") && 'bg-muted text-muted-foreground')}>
                                <ListIcon/>
                                </Toggle>
                            </TooltipTrigger>
                            <TooltipContent>Bullet List</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Toggle size="sm" pressed={editor.isActive("orderedList")} onPressedChange={()=> editor.chain().focus().toggleOrderedList().run()}
                                    className={cn( editor.isActive("orderedList") && 'bg-muted text-muted-foreground')}>
                                <ListOrdered/>
                                </Toggle>
                            </TooltipTrigger>
                            <TooltipContent>Ordered  List</TooltipContent>
                        </Tooltip>
                    </div>
                    <div className="w-px h-6 bg-border mx-2"></div>
                        <div className="flex flex-wrap gap-1">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Toggle size="sm" pressed={editor.isActive({TextAlign:"left"})} onPressedChange={()=> editor.chain().focus().setTextAlign("left").run()}
                                    className={cn( editor.isActive({textAlign:"left"}) && 'bg-muted text-muted-foreground')}>
                                <AlignLeft/>
                                </Toggle>
                            </TooltipTrigger>
                            <TooltipContent>Align Left</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Toggle size="sm" pressed={editor.isActive({TextAlign:"Center"})} onPressedChange={()=> editor.chain().focus().setTextAlign("Center").run()}
                                    className={cn( editor.isActive({textAlign:"Center"}) && 'bg-muted text-muted-foreground')}>
                                <AlignCenter/>
                                </Toggle>
                            </TooltipTrigger>
                            <TooltipContent>Align  Center</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Toggle size="sm" pressed={editor.isActive({TextAlign:"right"})} onPressedChange={()=> editor.chain().focus().setTextAlign("right").run()}
                                    className={cn( editor.isActive({textAlign:"right"}) && 'bg-muted text-muted-foreground')}>
                                <AlignRight/>
                                </Toggle>
                            </TooltipTrigger>
                            <TooltipContent>Align Right</TooltipContent>
                        </Tooltip>
                         </div>
                         <div className="w-px h-6 bg-border mx-2"></div>
                         <div className="flex flex-wrap gap-1">
                         <Tooltip>
                            <TooltipTrigger asChild>
                                <Button  size="sm" variant="ghost" type="button" onClick={() =>editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
                                <Undo/>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Undo</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button  size="sm" variant="ghost" type="button" onClick={() =>editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
                                <Redo/>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Redo</TooltipContent>
                        </Tooltip>
                         </div>
                </TooltipProvider>
        </div>
     )
}