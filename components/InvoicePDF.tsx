import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

// Define styles for the PDF
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
  },
  header: {
    marginBottom: 30,
    borderBottom: "2 solid #2563eb",
    paddingBottom: 15,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: "#64748b",
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 10,
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 5,
  },
  value: {
    fontSize: 14,
    color: "#1e293b",
    marginBottom: 15,
  },
  truckTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 15,
  },
  description: {
    fontSize: 12,
    color: "#475569",
    lineHeight: 1.6,
    marginBottom: 20,
  },
  priceSection: {
    marginTop: 30,
    padding: 20,
    backgroundColor: "#f8fafc",
    borderRadius: 8,
    border: "1 solid #e2e8f0",
  },
  priceLabel: {
    fontSize: 12,
    color: "#64748b",
    marginBottom: 5,
  },
  price: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2563eb",
  },
  footer: {
    position: "absolute",
    bottom: 40,
    left: 40,
    right: 40,
    borderTop: "1 solid #e2e8f0",
    paddingTop: 15,
    fontSize: 10,
    color: "#94a3b8",
    textAlign: "center",
  },
  metadata: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#f8fafc",
    borderRadius: 8,
  },
  metadataRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  metadataLabel: {
    fontSize: 10,
    color: "#64748b",
  },
  metadataValue: {
    fontSize: 10,
    color: "#1e293b",
    fontWeight: "bold",
  },
});

interface ListingData {
  id: string;
  title: string;
  description?: string;
  price: number;
  year?: number;
  make?: string;
  model?: string;
  mileage?: number;
}

interface InvoicePDFProps {
  listing: ListingData;
}

export const InvoicePDF: React.FC<InvoicePDFProps> = ({ listing }) => {
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
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>INVOICE</Text>
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
          <Text>Generated via Garage Invoice Generator</Text>
          <Text>This document is for informational purposes only</Text>
        </View>
      </Page>
    </Document>
  );
};

