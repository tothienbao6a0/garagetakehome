import { Document, Page, Text, View } from "@react-pdf/renderer";
import type { ListingData } from "@/types/listing";
import { invoiceStyles } from "@/lib/invoice-styles";
import { GarageLogo } from "./GarageLogo";
import {
  formatPrice,
  formatDate,
  generateInvoiceNumber,
  formatItemSpecs,
} from "@/lib/invoice-helpers";

interface InvoicePDFProps {
  listing: ListingData;
}

export function InvoicePDF({ listing }: InvoicePDFProps) {
  const currentDate = formatDate();
  const invoiceNumber = generateInvoiceNumber(listing.id);
  const itemSpecs = formatItemSpecs({
    year: listing.year,
    make: listing.make,
    model: listing.model,
    mileage: listing.mileage,
  });

  return (
    <Document>
      <Page size="A4" style={invoiceStyles.page}>
        {/* Header */}
        <View style={invoiceStyles.header}>
          <View style={invoiceStyles.logoContainer}>
            <GarageLogo />
          </View>
          <View style={invoiceStyles.headerRight}>
            <Text style={invoiceStyles.invoiceTitle}>INVOICE</Text>
            <Text style={invoiceStyles.invoiceInfo}>Invoice #: {invoiceNumber}</Text>
            <Text style={invoiceStyles.invoiceInfo}>Date: {currentDate}</Text>
          </View>
        </View>

        {/* From Section */}
        <View style={invoiceStyles.fromSection}>
          <Text style={invoiceStyles.sectionTitle}>From (Seller)</Text>
          <Text style={invoiceStyles.companyName}>Equipment Seller</Text>
          <Text style={invoiceStyles.address}>Listed on Garage Marketplace</Text>
          <Text style={invoiceStyles.address}>For seller contact: alaz@withgarage.com</Text>
        </View>

        {/* Bill To Section */}
        <View style={invoiceStyles.billToSection}>
          <Text style={invoiceStyles.sectionTitle}>Bill To (Buyer)</Text>
          <Text style={invoiceStyles.address}>____________________________________</Text>
          <Text style={invoiceStyles.address}>____________________________________</Text>
          <Text style={invoiceStyles.address}>____________________________________</Text>
        </View>

        {/* Line Items */}
        <View style={invoiceStyles.lineItemsSection}>
          <View style={invoiceStyles.lineItemHeader}>
            <Text
              style={[
                invoiceStyles.lineItemHeaderText,
                invoiceStyles.descriptionColumn,
              ]}
            >
              Description
            </Text>
            <Text
              style={[
                invoiceStyles.lineItemHeaderText,
                invoiceStyles.amountColumn,
              ]}
            >
              Amount
            </Text>
          </View>

          <View style={{ flexDirection: "row" }}>
            <View style={invoiceStyles.descriptionColumn}>
              <View style={invoiceStyles.lineItem}>
                <Text style={invoiceStyles.itemTitle}>{listing.title}</Text>
                {listing.description && (
                  <Text style={invoiceStyles.itemDescription}>
                    {listing.description}
                  </Text>
                )}
                {itemSpecs && (
                  <Text style={invoiceStyles.itemSpecs}>{itemSpecs}</Text>
                )}
              </View>
            </View>
            <View style={invoiceStyles.amountColumn}>
              <Text style={[invoiceStyles.itemTitle, { textAlign: "right" }]}>
                {formatPrice(listing.price)}
              </Text>
            </View>
          </View>
        </View>

        {/* Total */}
        <View style={invoiceStyles.totalSection}>
          <Text style={invoiceStyles.totalLabel}>TOTAL</Text>
          <Text style={invoiceStyles.totalAmount}>
            {formatPrice(listing.price)}
          </Text>
        </View>

        {/* Terms */}
        <View style={invoiceStyles.termsSection}>
          <Text style={invoiceStyles.termsTitle}>Payment Terms & Notes</Text>
          <Text style={invoiceStyles.termsText}>
            This is a quote for fire truck equipment listed on Garage
            Marketplace. Garage connects buyers and sellers but is not a party
            to the transaction. Please contact alaz@withgarage.com to connect
            with the seller for purchase inquiries, payment terms, and delivery
            arrangements. Price is subject to availability and final negotiation
            between buyer and seller.
          </Text>
        </View>

        {/* Footer */}
        <View style={invoiceStyles.footer}>
          <Text>
            Generated via Garage Marketplace • To connect with seller:
            alaz@withgarage.com
          </Text>
        </View>
      </Page>
    </Document>
  );
};


