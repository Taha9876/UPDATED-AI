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

export function AdvancedVoiceCommands() {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Advanced Voice Commands</CardTitle>
        <CardDescription>Configure and test advanced voice commands for your Shopify store.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="command-name">Command Name</Label>
          <Input id="command-name" placeholder="e.g., 'Quick Checkout'" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="trigger-phrases">Trigger Phrases (comma-separated)</Label>
          <Input id="trigger-phrases" placeholder="e.g., 'checkout now', 'buy everything'" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="ai-prompt">AI Prompt for Groq</Label>
          <Textarea
            className="min-h-[100px]"
            id="ai-prompt"
            placeholder="e.g., 'User wants to complete checkout. Generate actions to navigate to checkout and fill shipping info.'"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="expected-action">Expected JSON Action</Label>
          <Textarea
            className="min-h-[150px] font-mono text-sm"
            id="expected-action"
            placeholder={`{\n  "action": {\n    "type": "checkout",\n    "skipToPayment": false,\n    "fillShipping": {\n      "name": "John Doe",\n      "address": "123 Main St"\n    }\n  }\n}`}
          />
        </div>
        <Button>Save Command</Button>
        <div className="grid gap-2">
          <Label htmlFor="test-command">Test Command</Label>
          <Input id="test-command" placeholder="e.g., 'Quick Checkout'" />
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
