import { StyleSheet } from "@react-pdf/renderer";

// PDF invoice styles - Garage branded professional invoice
export const invoiceStyles = StyleSheet.create({
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

