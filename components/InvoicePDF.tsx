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
    padding: 40,
    fontSize: 12,
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
  },
  header: {
    marginBottom: 30,
    borderBottom: "3 solid #FF6B2C",
    paddingBottom: 15,
  },
  garageTitle: {
    fontSize: 28,
    fontWeight: "bold",
    fontStyle: "italic",
    color: "#FF6B2C",
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 10,
    color: "#6B7280",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 5,
  },
  value: {
    fontSize: 14,
    color: "#000000",
    marginBottom: 15,
  },
  truckTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 15,
  },
  description: {
    fontSize: 12,
    color: "#374151",
    lineHeight: 1.6,
    marginBottom: 20,
  },
  priceSection: {
    marginTop: 30,
    padding: 20,
    backgroundColor: "#FFF5F0",
    borderRadius: 8,
    border: "2 solid #FF6B2C",
  },
  priceLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 5,
  },
  price: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FF6B2C",
  },
  footer: {
    position: "absolute",
    bottom: 40,
    left: 40,
    right: 40,
    borderTop: "1 solid #E5E7EB",
    paddingTop: 15,
    fontSize: 10,
    color: "#9CA3AF",
    textAlign: "center",
  },
  metadata: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
  },
  metadataRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  metadataLabel: {
    fontSize: 10,
    color: "#6B7280",
  },
  metadataValue: {
    fontSize: 10,
    color: "#000000",
    fontWeight: "bold",
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
          <Text style={styles.title}>Invoice</Text>
          <Text style={styles.subtitle}>Fire Truck Equipment Quote</Text>
        </View>

        {/* Invoice Details */}
        <View style={styles.section}>
          <Text style={styles.label}>Invoice Date</Text>
          <Text style={styles.value}>{currentDate}</Text>

          <Text style={styles.label}>Listing ID</Text>
          <Text style={styles.value}>{listing.id}</Text>
        </View>

        {/* Truck Information */}
        <View style={styles.section}>
          <Text style={styles.label}>Equipment Description</Text>
          <Text style={styles.truckTitle}>{listing.title}</Text>

          {listing.description && (
            <>
              <Text style={styles.label}>Details</Text>
              <Text style={styles.description}>{listing.description}</Text>
            </>
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
          <Text>Generated by Garage Invoice Generator • {currentDate}</Text>
          <Text>For inquiries, contact alaz@withgarage.com</Text>
        </View>
      </Page>
    </Document>
  );
};

