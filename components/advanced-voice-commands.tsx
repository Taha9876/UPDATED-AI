"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, ShoppingCart, ArrowUpDown, MousePointer, CreditCard, Edit, Eye, Zap } from "lucide-react"

export default function AdvancedVoiceCommands() {
  const advancedCommands = [
    {
      category: "Smart Navigation",
      icon: MousePointer,
      color: "bg-blue-100 text-blue-800",
      commands: [
        { text: "Go back to the previous page", action: "Navigate back in browser history" },
        { text: "Open catalog in new tab", action: "Open collections page in new tab" },
        { text: "Take me to the homepage", action: "Navigate to store homepage" },
        { text: "Show me the contact page", action: "Navigate to contact information" },
      ],
    },
    {
      category: "Advanced Search & Filtering",
      icon: Search,
      color: "bg-green-100 text-green-800",
      commands: [
        { text: "Search for gold earrings under $50", action: "Search + price filter" },
        { text: "Find red dresses in size medium", action: "Search + color + size filter" },
        { text: "Show me the cheapest necklaces", action: "Search + sort by price ascending" },
        { text: "Filter by customer reviews", action: "Apply rating filter" },
      ],
    },
    {
      category: "Smart Shopping",
      icon: ShoppingCart,
      color: "bg-purple-100 text-purple-800",
      commands: [
        { text: "Add this to cart and go to checkout", action: "Add to cart + navigate to checkout" },
        { text: "Buy 2 of these in size large", action: "Select variant + set quantity + add to cart" },
        { text: "Remove everything from my cart", action: "Clear all cart items" },
        { text: "Apply discount code SAVE20", action: "Enter and apply discount code" },
      ],
    },
    {
      category: "Product Interaction",
      icon: Eye,
      color: "bg-orange-100 text-orange-800",
      commands: [
        { text: "Show me product details", action: "Scroll to description section" },
        { text: "Read customer reviews", action: "Navigate to reviews section" },
        { text: "Compare this with similar items", action: "Open product comparison" },
        { text: "Add to wishlist", action: "Save product to wishlist" },
      ],
    },
    {
      category: "Cart Management",
      icon: Edit,
      color: "bg-red-100 text-red-800",
      commands: [
        { text: "Change quantity to 3", action: "Update cart item quantity" },
        { text: "Remove the first item", action: "Remove specific cart item" },
        { text: "Show me cart total", action: "Display cart summary" },
        { text: "Update shipping address", action: "Modify checkout information" },
      ],
    },
    {
      category: "Sorting & Organization",
      icon: ArrowUpDown,
      color: "bg-indigo-100 text-indigo-800",
      commands: [
        { text: "Sort by newest arrivals", action: "Sort products by date" },
        { text: "Show most popular items", action: "Sort by popularity" },
        { text: "Arrange by price high to low", action: "Sort by price descending" },
        { text: "Filter by 5-star ratings", action: "Show only top-rated products" },
      ],
    },
    {
      category: "Checkout & Payment",
      icon: CreditCard,
      color: "bg-yellow-100 text-yellow-800",
      commands: [
        { text: "Proceed to secure checkout", action: "Navigate to checkout page" },
        { text: "Fill in my shipping details", action: "Auto-fill shipping form" },
        { text: "Skip to payment method", action: "Jump to payment section" },
        { text: "Complete my order", action: "Finalize purchase" },
      ],
    },
    {
      category: "Page Actions",
      icon: Zap,
      color: "bg-pink-100 text-pink-800",
      commands: [
        { text: "Scroll to the bottom", action: "Scroll to page bottom" },
        { text: "Go to the top of the page", action: "Scroll to page top" },
        { text: "Refresh the page", action: "Reload current page" },
        { text: "Hide this element", action: "Remove specific page element" },
      ],
    },
  ]

  const complexExamples = [
    {
      command: "Find cheap pearl necklaces and add the first one to cart",
      steps: ["Search for 'pearl necklaces'", "Filter by low price", "Click first product", "Add to cart"],
    },
    {
      command: "Buy this dress in blue size medium and checkout",
      steps: ["Select blue color", "Choose medium size", "Add to cart", "Go to checkout"],
    },
    {
      command: "Show me all earrings under $30 sorted by popularity",
      steps: ["Search 'earrings'", "Filter price under $30", "Sort by popularity", "Display results"],
    },
    {
      command: "Remove the second item from cart and apply discount SAVE10",
      steps: ["Open cart", "Remove second item", "Enter discount code", "Apply discount"],
    },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Advanced Voice Commands
          </CardTitle>
          <CardDescription>Powerful voice commands that can perform complex actions on your Orna store</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {advancedCommands.map((category, categoryIndex) => (
              <div key={categoryIndex} className="space-y-3">
                <div className="flex items-center gap-2">
                  <category.icon className="h-5 w-5 text-gray-600" />
                  <h3 className="font-semibold text-gray-900">{category.category}</h3>
                  <Badge className={category.color}>{category.commands.length} commands</Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {category.commands.map((command, commandIndex) => (
                    <div key={commandIndex} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                      <p className="font-medium text-sm text-blue-600">"{command.text}"</p>
                      <p className="text-xs text-gray-600 mt-1">{command.action}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>🧠 Complex Command Examples</CardTitle>
          <CardDescription>Multi-step commands that combine multiple actions automatically</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {complexExamples.map((example, index) => (
              <div key={index} className="p-4 border rounded-lg bg-gradient-to-r from-blue-50 to-purple-50">
                <p className="font-medium text-blue-900 mb-2">"{example.command}"</p>
                <div className="flex flex-wrap gap-2">
                  {example.steps.map((step, stepIndex) => (
                    <Badge key={stepIndex} variant="outline" className="text-xs">
                      {stepIndex + 1}. {step}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-green-50 to-blue-50">
        <CardHeader>
          <CardTitle>💡 Pro Tips for Advanced Voice Control</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-green-800 mb-2">🎯 Be Specific</h4>
              <ul className="space-y-1 text-green-700">
                <li>• "Add 2 gold earrings to cart" vs "add to cart"</li>
                <li>• "Filter by price under $25" vs "filter by price"</li>
                <li>• "Sort by newest first" vs "sort products"</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-blue-800 mb-2">🔗 Chain Commands</h4>
              <ul className="space-y-1 text-blue-700">
                <li>• "Search and filter and sort" in one command</li>
                <li>• "Add to cart and checkout immediately"</li>
                <li>• "Remove item and apply discount code"</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-purple-800 mb-2">🎨 Use Natural Language</h4>
              <ul className="space-y-1 text-purple-700">
                <li>• "I want to buy this necklace in silver"</li>
                <li>• "Show me what's on sale today"</li>
                <li>• "Help me find a gift under $40"</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-orange-800 mb-2">⚡ Context Aware</h4>
              <ul className="space-y-1 text-orange-700">
                <li>• Commands adapt to current page</li>
                <li>• "This product" refers to current item</li>
                <li>• "Go back" works from any page</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
