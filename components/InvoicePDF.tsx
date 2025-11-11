import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import type { ListingData } from "@/types/listing";

// Define styles for the PDF - Garage branded
const styles = StyleSheet.create({
  page: {
    padding: 48,
    fontSize: 11,
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
  },
  header: {
    marginBottom: 40,
    paddingBottom: 24,
    borderBottom: "2 solid #E5E7EB",
  },
  garageTitle: {
    fontSize: 32,
    fontWeight: "bold",
    fontStyle: "italic",
    color: "#FF6B2C",
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 20,
    fontWeight: 600,
    color: "#000000",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: "#6B7280",
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 9,
    color: "#6B7280",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 6,
    fontWeight: 600,
  },
  value: {
    fontSize: 13,
    color: "#000000",
    marginBottom: 16,
    lineHeight: 1.4,
  },
  truckTitle: {
    fontSize: 18,
    fontWeight: 600,
    color: "#000000",
    marginBottom: 12,
    lineHeight: 1.3,
  },
  description: {
    fontSize: 11,
    color: "#374151",
    lineHeight: 1.7,
    marginBottom: 20,
  },
  priceSection: {
    marginTop: 32,
    padding: 24,
    backgroundColor: "#FFFBF5",
    borderRadius: 6,
    border: "1 solid #FFD4B8",
  },
  priceLabel: {
    fontSize: 11,
    color: "#6B7280",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 1,
    fontWeight: 600,
  },
  price: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#FF6B2C",
    letterSpacing: -1,
  },
  footer: {
    position: "absolute",
    bottom: 48,
    left: 48,
    right: 48,
    borderTop: "1 solid #E5E7EB",
    paddingTop: 20,
    fontSize: 9,
    color: "#9CA3AF",
    textAlign: "center",
  },
  metadata: {
    marginTop: 24,
    padding: 18,
    backgroundColor: "#F9FAFB",
    borderRadius: 4,
    border: "1 solid #E5E7EB",
  },
  metadataRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  metadataLabel: {
    fontSize: 10,
    color: "#6B7280",
    fontWeight: 500,
  },
  metadataValue: {
    fontSize: 10,
    color: "#000000",
    fontWeight: 600,
  },
  invoiceNumber: {
    fontSize: 11,
    color: "#6B7280",
    marginTop: 4,
  },
});

interface InvoicePDFProps {
  listing: ListingData;
}

export function InvoicePDF({ listing }: InvoicePDFProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header - Garage Branded */}
        <View style={styles.header}>
          <Text style={styles.garageTitle}>GARAGE</Text>
          <Text style={styles.subtitle}>Invoice • {currentDate}</Text>
        </View>

        {/* Invoice Details */}
        <View style={styles.section}>
          <Text style={styles.title}>Invoice Details</Text>
          <Text style={styles.invoiceNumber}>Listing #{listing.id}</Text>
        </View>

        {/* Truck Information */}
        <View style={styles.section}>
          <Text style={styles.label}>Fire Truck Equipment</Text>
          <Text style={styles.truckTitle}>{listing.title}</Text>

          {listing.description && (
            <Text style={styles.description}>{listing.description}</Text>
          )}
        </View>

        {/* Additional Metadata */}
        {(listing.year || listing.make || listing.model || listing.mileage) && (
          <View style={styles.metadata}>
            {listing.year && (
              <View style={styles.metadataRow}>
                <Text style={styles.metadataLabel}>Year:</Text>
                <Text style={styles.metadataValue}>{listing.year}</Text>
              </View>
            )}
            {listing.make && (
              <View style={styles.metadataRow}>
                <Text style={styles.metadataLabel}>Make:</Text>
                <Text style={styles.metadataValue}>{listing.make}</Text>
              </View>
            )}
            {listing.model && (
              <View style={styles.metadataRow}>
                <Text style={styles.metadataLabel}>Model:</Text>
                <Text style={styles.metadataValue}>{listing.model}</Text>
              </View>
            )}
            {listing.mileage && (
              <View style={styles.metadataRow}>
                <Text style={styles.metadataLabel}>Mileage:</Text>
                <Text style={styles.metadataValue}>
                  {listing.mileage.toLocaleString()} miles
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Price */}
        <View style={styles.priceSection}>
          <Text style={styles.priceLabel}>Total Price</Text>
          <Text style={styles.price}>{formatPrice(listing.price)}</Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={{ marginBottom: 4 }}>GARAGE Invoice Generator</Text>
          <Text>Questions? Contact alaz@withgarage.com</Text>
        </View>
      </Page>
    </Document>
  );
};

