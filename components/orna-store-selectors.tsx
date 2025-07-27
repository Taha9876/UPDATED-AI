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

export function OrnaStoreSelectors() {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Orna Store Selectors</CardTitle>
        <CardDescription>Define and manage CSS selectors for key elements on your Orna Shopify store.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="search-input">Search Input Selector</Label>
          <Input id="search-input" placeholder="#SearchInput" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="add-to-cart-button">Add to Cart Button Selector</Label>
          <Input id="add-to-cart-button" placeholder=".product-form__submit" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="cart-icon">Cart Icon Selector</Label>
          <Input id="cart-icon" placeholder=".site-header__cart" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="product-title">Product Title Selector</Label>
          <Input id="product-title" placeholder=".product-single__title" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="product-price">Product Price Selector</Label>
          <Input id="product-price" placeholder=".product-single__price" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="checkout-button">Checkout Button Selector</Label>
          <Input id="checkout-button" placeholder="#CartDrawer-CheckoutButton" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="custom-selector-name">Custom Selector Name</Label>
          <Input id="custom-selector-name" placeholder="e.g., 'Newsletter Signup Button'" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="custom-selector-value">Custom Selector Value</Label>
          <Input id="custom-selector-value" placeholder="#NewsletterForm button[type='submit']" />
        </div>
        <Button>Save Selectors</Button>
        <div className="grid gap-2">
          <Label htmlFor="test-selector">Test Selector</Label>
          <Input id="test-selector" placeholder=".site-header__logo" />
        </div>
        <Button>Find Element</Button>
        <div className="grid gap-2">
          <Label htmlFor="test-result">Test Result</Label>
          <Textarea className="min-h-[100px] font-mono text-sm" id="test-result" readOnly />
        </div>
      </CardContent>
    </Card>
  )
}
