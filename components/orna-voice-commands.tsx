"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mic, Search, ShoppingCart, Home, Sparkles } from "lucide-react"

export default function OrnaVoiceCommands() {
  const ornaCommands = [
    {
      category: "Navigation",
      icon: Home,
      commands: [
        { text: "Go to homepage", description: "Navigate to Orna store homepage" },
        { text: "Show me the catalog", description: "Browse all products" },
        { text: "Go to contact page", description: "Find contact information" },
        { text: "Take me back", description: "Go to previous page" },
      ],
    },
    {
      category: "Product Search",
      icon: Search,
      commands: [
        { text: "Search for earrings", description: "Find earring collections" },
        { text: "Show me necklaces", description: "Browse necklace options" },
        { text: "Find pearl jewelry", description: "Search for pearl accessories" },
        { text: "Look for dresses", description: "Browse dress collection" },
      ],
    },
    {
      category: "Shopping",
      icon: ShoppingCart,
      commands: [
        { text: "Add this to cart", description: "Add current product to cart" },
        { text: "Show my cart", description: "View shopping cart" },
        { text: "Go to checkout", description: "Proceed to payment" },
        { text: "Remove from cart", description: "Remove selected item" },
      ],
    },
    {
      category: "Special Features",
      icon: Sparkles,
      commands: [
        { text: "Show special offers", description: "View current promotions" },
        { text: "Find similar items", description: "Discover related products" },
        { text: "Read product details", description: "Get product information" },
        { text: "Compare prices", description: "Check price options" },
      ],
    },
  ]

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Navigation":
        return "bg-blue-100 text-blue-800"
      case "Product Search":
        return "bg-green-100 text-green-800"
      case "Shopping":
        return "bg-purple-100 text-purple-800"
      case "Special Features":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mic className="h-5 w-5" />
          Orna Store Voice Commands
        </CardTitle>
        <CardDescription>Specialized voice commands for your jewelry and fashion store</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {ornaCommands.map((category, categoryIndex) => (
            <div key={categoryIndex} className="space-y-3">
              <div className="flex items-center gap-2">
                <category.icon className="h-5 w-5 text-gray-600" />
                <h3 className="font-semibold text-gray-900">{category.category}</h3>
                <Badge className={getCategoryColor(category.category)}>{category.commands.length} commands</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {category.commands.map((command, commandIndex) => (
                  <div key={commandIndex} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <p className="font-medium text-sm">"{command.text}"</p>
                    <p className="text-xs text-gray-600 mt-1">{command.description}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">💡 Pro Tips for Orna Store</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Be specific: "Show me gold earrings" works better than "show jewelry"</li>
            <li>• Use natural language: "I want to buy this necklace" or "Add to my cart"</li>
            <li>• Try combinations: "Search for pearl necklaces under $50"</li>
            <li>• Ask for help: "What's on sale?" or "Show me new arrivals"</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
