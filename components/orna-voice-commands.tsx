/**
 * v0 by Vercel.
 * @see https://v0.dev/t/20240727134324
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { CardTitle, CardDescription, CardHeader, CardContent, Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

export function OrnaVoiceCommands() {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Orna Voice Commands</CardTitle>
        <CardDescription>
          Manage and customize voice commands specific to the Orna jewelry and fashion store.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="command-name">Command Name</Label>
          <Input id="command-name" placeholder="e.g., 'Show me rings'" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="trigger-phrases">Trigger Phrases (comma-separated)</Label>
          <Input id="trigger-phrases" placeholder="e.g., 'rings', 'jewelry rings', 'show rings'" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="ai-prompt">AI Prompt for Groq</Label>
          <Textarea
            className="min-h-[100px]"
            id="ai-prompt"
            placeholder="e.g., 'User wants to see rings. Generate actions to navigate to the rings collection or search for rings.'"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="expected-action">Expected JSON Action</Label>
          <Textarea
            className="min-h-[150px] font-mono text-sm"
            id="expected-action"
            placeholder={`{\n  "action": {\n    "type": "navigate",\n    "url": "/collections/rings"\n  }\n}`}
          />
        </div>
        <Button>Save Command</Button>
        <div className="grid gap-2">
          <Label htmlFor="test-command">Test Command</Label>
          <Input id="test-command" placeholder="e.g., 'Show me rings'" />
        </div>
        <Button>Run Test</Button>
        <div className="grid gap-2">
          <Label htmlFor="test-result">Test Result</Label>
          <Textarea className="min-h-[100px] font-mono text-sm" id="test-result" readOnly />
        </div>
      </CardContent>
    </Card>
  )
}
