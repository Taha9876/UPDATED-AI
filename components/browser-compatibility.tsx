/**
 * v0 by Vercel.
 * @see https://v0.dev/t/20240727134324
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { CardTitle, CardDescription, CardHeader, CardContent, Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"

export function BrowserCompatibility() {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Browser Compatibility</CardTitle>
        <CardDescription>Check and configure browser compatibility for the voice automation extension.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid gap-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="chrome-support">Chrome Support</Label>
            <Switch defaultChecked id="chrome-support" />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="firefox-support">Firefox Support</Label>
            <Switch id="firefox-support" />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="edge-support">Edge Support</Label>
            <Switch id="edge-support" />
          </div>
        </div>
        <div className="grid gap-2">
          <Label>Overall Compatibility Score</Label>
          <Progress value={75} />
          <p className="text-sm text-muted-foreground">
            75% of major browsers are supported. Consider adding support for more browsers to reach a wider audience.
          </p>
        </div>
        <div className="grid gap-2">
          <Label>Troubleshooting Tips</Label>
          <ul className="list-disc pl-5 text-sm text-muted-foreground">
            <li>Ensure your browser is up to date.</li>
            <li>Check browser extension permissions.</li>
            <li>Disable conflicting extensions.</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
