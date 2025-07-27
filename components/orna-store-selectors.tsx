import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function OrnaStoreSelectors() {
  const selectors = [
    { element: "Add to Cart Button", selector: ".product-form__submit" },
    { element: "Search Input", selector: "#Search-In-Modal" },
    { element: "Cart Icon", selector: ".header__icon--cart" },
    { element: "Product Title", selector: ".product__title" },
    { element: "Product Price", selector: ".price-item--regular" },
    { element: "Quantity Input", selector: 'input[name="quantity"]' },
    { element: "Checkout Button", selector: ".cart__checkout-button" },
    { element: "Collection Filter", selector: ".facets__disclosure-btn" },
    { element: "Sort By Dropdown", selector: "#SortBy" },
    { element: "Customer Account Link", selector: 'a[href="/account"]' },
  ]

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Orna Store Selectors (Example)</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          These are example CSS selectors for common elements on a Shopify store. In a real automation scenario, these
          would be used by a browser extension or automation script to interact with the page.
        </p>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Element</TableHead>
              <TableHead>CSS Selector</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {selectors.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{item.element}</TableCell>
                <TableCell className="font-mono text-sm">{item.selector}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          Note: Actual selectors may vary based on your Shopify theme.
        </p>
      </CardContent>
    </Card>
  )
}
