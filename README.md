# products-cart
A simple script that allows adding products into a shopping cart directly from online stores.  
It works by extracting product information from **JSON-LD** embedded on the page. <br/>
The `tests` branch contains tests for some functions of this script.

The script has been tested and works on the following websites:
- [x-kom](https://www.x-kom.pl)  
- [zalando](https://www.zalando.pl)  
- [H&M](https://www2.hm.com)  
- [Swarovski](https://www.swarovski.com)  
- [eobuwie](https://www.eobuwie.com.pl)  
- [JD Sports](https://www.jdsports.pl)  
- [Rossmann](https://www.rossmann.pl)

Usage: 
Enter one of the above links into your browser, navigate to a product page, open the console (F12), paste the code and run. 

The script uses structured data in **JSON-LD**, which is usually embedded in:
```html 
<script type="application/ld+json"> ... </script>
```

JSON-LD follows a standardized format defined by [Schema.org](https://schema.org/Product).
Many online stores use different JSON-LD structures that may not be recognized by this script.
Some stores do not implement JSON-LD at all.
The script works only with JSON-LD objects of type `Product`.  
It does not currently support other schema types like `ProductGroup`.

Example:
```json
{
  "@context": "https://schema.org/",
  "@type": "Product",
  "name": "Nike Air Max 270",
  "image": [
    "https://example.com/photo.jpg"
  ],
  "offers": {
    "@type": "Offer",
    "priceCurrency": "PLN",
    "price": "599.99",
  }
}
```

ToDo:
- Handle other schema JSON LD types
- Improve cart appearance
- Tests for other functions
- Microdata? RDFa?
