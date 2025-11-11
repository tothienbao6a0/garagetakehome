import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Svg,
  Path,
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
    marginBottom: 32,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  logoContainer: {
    width: 80,
    height: 21,
  },
  headerRight: {
    alignItems: "flex-end",
  },
  invoiceTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 8,
  },
  garageTitle: {
    fontSize: 24,
    fontWeight: "bold",
    fontStyle: "italic",
    color: "#FF6B2C",
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  invoiceInfo: {
    fontSize: 11,
    color: "#374151",
    marginBottom: 4,
  },
  fromSection: {
    marginBottom: 24,
  },
  billToSection: {
    marginBottom: 32,
    paddingBottom: 24,
    borderBottom: "1 solid #E5E7EB",
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 600,
    color: "#6B7280",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  companyName: {
    fontSize: 12,
    fontWeight: 600,
    color: "#000000",
    marginBottom: 4,
  },
  address: {
    fontSize: 10,
    color: "#6B7280",
    lineHeight: 1.5,
  },
  lineItemsSection: {
    marginBottom: 32,
  },
  lineItemHeader: {
    flexDirection: "row",
    borderBottom: "2 solid #E5E7EB",
    paddingBottom: 10,
    marginBottom: 16,
  },
  lineItemHeaderText: {
    fontSize: 10,
    fontWeight: 600,
    color: "#6B7280",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  descriptionColumn: {
    width: "70%",
  },
  amountColumn: {
    width: "30%",
    textAlign: "right",
  },
  lineItem: {
    marginBottom: 16,
  },
  itemTitle: {
    fontSize: 12,
    fontWeight: 600,
    color: "#000000",
    marginBottom: 6,
  },
  itemDescription: {
    fontSize: 10,
    color: "#6B7280",
    lineHeight: 1.6,
    marginBottom: 8,
  },
  itemSpecs: {
    fontSize: 9,
    color: "#6B7280",
    lineHeight: 1.5,
  },
  totalSection: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingTop: 16,
    borderTop: "2 solid #E5E7EB",
    marginBottom: 32,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: 600,
    color: "#000000",
    marginRight: 40,
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FF6B2C",
    textAlign: "right",
  },
  termsSection: {
    marginTop: 32,
    padding: 20,
    backgroundColor: "#F9FAFB",
    borderRadius: 4,
  },
  termsTitle: {
    fontSize: 10,
    fontWeight: 600,
    color: "#000000",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  termsText: {
    fontSize: 9,
    color: "#6B7280",
    lineHeight: 1.6,
  },
  footer: {
    position: "absolute",
    bottom: 48,
    left: 48,
    right: 48,
    borderTop: "1 solid #E5E7EB",
    paddingTop: 16,
    fontSize: 8,
    color: "#9CA3AF",
    textAlign: "center",
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

  // Generate invoice number from listing ID
  const invoiceNumber = `INV-${listing.id.substring(0, 8).toUpperCase()}`;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Svg viewBox="0 0 707 187" style={{ width: "100%", height: "100%" }}>
              <Path
                d="M47.1968 187C34.531 187 24.6983 184.5 17.6988 179.5C10.6993 174.5 5.86627 167.583 3.19978 158.75C0.533297 149.75 -0.466635 139.333 0.199987 127.5C1.03326 115.667 2.86647 102.917 5.69962 89.25C11.8659 60.25 20.3653 38.1667 31.1979 23C42.1972 7.66667 57.1961 0 76.1949 0C95.8602 0 109.109 5.75 115.942 17.25C122.942 28.75 124.775 45.9167 121.442 68.75H79.9446C81.4445 58.4167 81.7778 50.9167 80.9445 46.25C80.1113 41.5833 77.5281 39.25 73.1951 39.25C68.1954 39.25 63.9457 43.5833 60.4459 52.25C57.1128 60.75 53.5297 74.1667 49.6967 92.5C47.6968 102.333 46.0302 111.5 44.697 120C43.3637 128.333 43.1138 135.083 43.947 140.25C44.947 145.417 47.7801 148 52.4465 148C55.9462 148 58.946 146.25 61.4459 142.75C64.1124 139.25 66.3622 133.167 68.1954 124.5L69.1953 118.75H57.1962L64.1957 85.25L118.442 85.5L109.443 127.5C106.609 141.667 102.11 153.167 95.9435 162C89.7773 170.667 82.5278 177 74.195 181C65.8622 185 56.8628 187 47.1968 187Z"
                fill="#F97315"
              />
              <Path
                d="M102.554 184.75L168.05 2.5H230.046L220.546 184.75H177.299L180.049 154.75H155.301L145.802 184.75H102.554ZM166.3 119.75H183.049L187.799 79L191.548 44H189.799L179.049 78.5L166.3 119.75Z"
                fill="#F97315"
              />
              <Path
                d="M229.854 184.75L267.852 2.5H317.349C335.014 2.5 347.513 6.5 354.846 14.5C362.179 22.3333 365.679 32.6667 365.345 45.5C364.845 58.1667 361.762 69.4167 356.096 79.25C350.43 89.0833 343.013 95.6667 333.847 99L333.597 100.75C340.43 103.25 344.43 107.5 345.597 113.5C346.763 119.5 346.263 127.417 344.097 137.25L338.097 166.5C337.431 169.833 336.931 173.333 336.597 177C336.264 180.5 336.014 183.083 335.847 184.75H291.1C290.934 182.417 290.934 179.917 291.1 177.25C291.267 174.417 291.684 171.667 292.35 169L298.1 142C299.1 137 299.516 132.583 299.35 128.75C299.183 124.75 297.1 122.75 293.1 122.75H287.101L274.351 184.75H229.854ZM294.6 87.75H299.6C304.933 87.75 309.349 84.75 312.849 78.75C316.515 72.75 318.515 64.8333 318.848 55C319.015 50 318.015 46.5833 315.849 44.75C313.682 42.75 310.682 41.75 306.849 41.75H304.099L294.6 87.75Z"
                fill="#F97315"
              />
              <Path
                d="M343.993 184.75L409.489 2.5H471.485L461.985 184.75H418.738L421.488 154.75H396.74L387.24 184.75H343.993ZM407.739 119.75H424.488L429.237 79L432.987 44H431.237L420.488 78.5L407.739 119.75Z"
                fill="#F97315"
              />
              <Path
                d="M523.483 187C510.817 187 500.985 184.5 493.985 179.5C486.986 174.5 482.153 167.583 479.486 158.75C476.82 149.75 475.82 139.333 476.486 127.5C477.32 115.667 479.153 102.917 481.986 89.25C488.152 60.25 496.652 38.1667 507.484 23C518.483 7.66667 533.482 0 552.481 0C572.146 0 585.396 5.75 592.228 17.25C599.228 28.75 601.061 45.9167 597.728 68.75H556.231C557.731 58.4167 558.064 50.9167 557.231 46.25C556.398 41.5833 553.814 39.25 549.481 39.25C544.482 39.25 540.232 43.5833 536.732 52.25C533.399 60.75 529.816 74.1667 525.983 92.5C523.983 102.333 522.317 111.5 520.983 120C519.65 128.333 519.4 135.083 520.233 140.25C521.233 145.417 524.066 148 528.733 148C532.233 148 535.232 146.25 537.732 142.75C540.399 139.25 542.648 133.167 544.482 124.5L545.482 118.75H533.482L540.482 85.25L594.728 85.5L585.729 127.5C582.896 141.667 578.396 153.167 572.23 162C566.064 170.667 558.814 177 550.481 181C542.148 185 533.149 187 523.483 187Z"
                fill="#F97315"
              />
              <Path
                d="M587.008 184.75L625.006 2.5H707L699.251 41.75H660.253L653.754 73.5H688.751L681.002 110H646.254L638.755 145.5H677.252L669.253 184.75H587.008Z"
                fill="#F97315"
              />
            </Svg>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.invoiceTitle}>INVOICE</Text>
            <Text style={styles.invoiceInfo}>Invoice #: {invoiceNumber}</Text>
            <Text style={styles.invoiceInfo}>Date: {currentDate}</Text>
          </View>
        </View>

        {/* From Section */}
        <View style={styles.fromSection}>
          <Text style={styles.sectionTitle}>From</Text>
          <Text style={styles.companyName}>Garage</Text>
          <Text style={styles.address}>Fire Truck Equipment Marketplace</Text>
          <Text style={styles.address}>alaz@withgarage.com</Text>
        </View>

        {/* Bill To Section */}
        <View style={styles.billToSection}>
          <Text style={styles.sectionTitle}>Bill To</Text>
          <Text style={styles.address}>Fire Department</Text>
          <Text style={styles.address}>(Customer information)</Text>
        </View>

        {/* Line Items */}
        <View style={styles.lineItemsSection}>
          <View style={styles.lineItemHeader}>
            <Text style={[styles.lineItemHeaderText, styles.descriptionColumn]}>
              Description
            </Text>
            <Text style={[styles.lineItemHeaderText, styles.amountColumn]}>
              Amount
            </Text>
          </View>

          <View style={{ flexDirection: "row" }}>
            <View style={styles.descriptionColumn}>
              <View style={styles.lineItem}>
                <Text style={styles.itemTitle}>{listing.title}</Text>
                {listing.description && (
                  <Text style={styles.itemDescription}>
                    {listing.description}
                  </Text>
                )}
                {(listing.year || listing.make || listing.model || listing.mileage) && (
                  <Text style={styles.itemSpecs}>
                    {[
                      listing.year,
                      listing.make,
                      listing.model,
                      listing.mileage && `${listing.mileage.toLocaleString()} miles`,
                    ]
                      .filter(Boolean)
                      .join(" • ")}
                  </Text>
                )}
              </View>
            </View>
            <View style={styles.amountColumn}>
              <Text style={[styles.itemTitle, { textAlign: "right" }]}>
                {formatPrice(listing.price)}
              </Text>
            </View>
          </View>
        </View>

        {/* Total */}
        <View style={styles.totalSection}>
          <Text style={styles.totalLabel}>TOTAL</Text>
          <Text style={styles.totalAmount}>{formatPrice(listing.price)}</Text>
        </View>

        {/* Terms */}
        <View style={styles.termsSection}>
          <Text style={styles.termsTitle}>Payment Terms & Notes</Text>
          <Text style={styles.termsText}>
            This invoice is a quote for fire truck equipment listed on Garage. Please contact 
            alaz@withgarage.com for purchase inquiries, payment terms, and delivery arrangements.
            Price is subject to availability and may be adjusted based on final inspection and negotiation.
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Thank you for your business • Questions? Contact alaz@withgarage.com</Text>
        </View>
      </Page>
    </Document>
  );
};


