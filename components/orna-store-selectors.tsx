"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Code, Search, ShoppingCart, Home, ArrowLeft } from "lucide-react"

export default function OrnaStoreSelectors() {
  const selectors = [
    {
      name: "Search Box",
      selector: 'input[type="search"], .search-input, [data-testid="search"]',
      icon: Search,
      description: "Main search functionality",
    },
    {
      name: "Cart Icon",
      selector: '.cart-icon, [data-testid="cart"], .header__icon--cart',
      icon: ShoppingCart,
      description: "Shopping cart access",
    },
    {
      name: "Home Link",
      selector: 'a[href="/"], .header__heading-link, .logo',
      icon: Home,
      description: "Homepage navigation",
    },
    {
      name: "Product Links",
      selector: ".product-item a, .card__heading a, .product-card-wrapper a",
      icon: ArrowLeft,
      description: "Individual product pages",
    },
    {
      name: "Add to Cart",
      selector: '.btn--add-to-cart, [name="add"], .product-form__cart-submit',
      icon: ShoppingCart,
      description: "Add product to cart button",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Code className="h-5 w-5" />
          Orna Store DOM Selectors
        </CardTitle>
        <CardDescription>Customized selectors for your cfcu5s-iu.myshopify.com store</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {selectors.map((selector, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <selector.icon className="h-5 w-5 text-blue-500 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">{selector.name}</span>
                  <Badge variant="outline" className="text-xs">
                    CSS
                  </Badge>
                </div>
                <code className="text-xs bg-gray-200 px-2 py-1 rounded text-gray-700 block mb-1">
                  {selector.selector}
                </code>
                <p className="text-xs text-gray-600">{selector.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
