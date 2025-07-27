import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function OrnaVoiceCommands() {
  const commands = [
    { command: "Go to cart", description: "Navigates to the shopping cart page." },
    { command: "Search for necklaces", description: 'Performs a search for "necklaces".' },
    { command: "Add to cart", description: 'Clicks the "Add to Cart" button on the current product page.' },
    { command: "Proceed to checkout", description: "Initiates the checkout process." },
    { command: "Show me rings", description: 'Navigates to the "Rings" collection page.' },
    { command: "View product details", description: "Clicks on the first product link to view its details." },
    { command: "Go back", description: "Navigates back to the previous page." },
    { command: "Refresh page", description: "Reloads the current page." },
    { command: "Scroll down", description: "Scrolls the page down." },
    { command: "Scroll up", description: "Scrolls the page up." },
  ]

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Orna Store Specific Voice Commands (Example)</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          These are example voice commands tailored for the "Orna" Shopify store. The AI model can be trained to
          understand these and translate them into actions relevant to the store's layout and functionality.
        </p>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Command</TableHead>
              <TableHead>Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {commands.map((cmd, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{cmd.command}</TableCell>
                <TableCell>{cmd.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
