import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function AdvancedVoiceCommands() {
  const commands = [
    { command: "Add [product name] to cart", description: "Adds a specific product to the shopping cart." },
    { command: "Search for [keyword]", description: "Performs a search on the store for the given keyword." },
    {
      command: "Go to [page name]",
      description: 'Navigates to a specific page like "checkout", "cart", or "account".',
    },
    {
      command: "Increase quantity to [number]",
      description: "Sets the quantity of the current product to the specified number.",
    },
    { command: "Apply discount code [code]", description: "Applies a given discount code during checkout." },
    { command: "Show me products by [brand]", description: "Filters products by a specific brand." },
    { command: "Sort by [option]", description: 'Sorts product listings by "price low to high", "newest", etc.' },
    { command: "Proceed to checkout", description: "Initiates the checkout process." },
    { command: "View my orders", description: "Navigates to the user's order history page." },
    { command: "Contact support", description: "Opens the customer support contact form or page." },
  ]

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Advanced Voice Commands</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          Here are some advanced voice commands you can use to interact with a Shopify store. These commands are
          processed by the AI model to generate actionable instructions.
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
