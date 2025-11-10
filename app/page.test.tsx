import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Home from "./page";

const mockUsePDFGenerator = vi.fn();

vi.mock("@/hooks/use-pdf-generator", () => ({
  usePDFGenerator: () => mockUsePDFGenerator(),
}));

describe("Home Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUsePDFGenerator.mockReturnValue({
      url: "",
      setUrl: vi.fn(),
      error: "",
      isPending: false,
      generatePDF: vi.fn(),
    });
  });

  it("should render the main heading", () => {
    render(<Home />);
    
    expect(screen.getByText("Garage Invoice Generator")).toBeInTheDocument();
  });

  it("should render the form with input and button", () => {
    render(<Home />);
    
    expect(screen.getByLabelText("Listing URL")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("https://withgarage.com/listing/...")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Generate PDF Invoice/i })).toBeInTheDocument();
  });

  it("should render description text", () => {
    render(<Home />);
    
    expect(screen.getByText("Generate professional PDF invoices for fire truck listings")).toBeInTheDocument();
  });

  it("should render how it works section", () => {
    render(<Home />);
    
    expect(screen.getByText("How it works:")).toBeInTheDocument();
    // Use getAllByText since the text appears in both placeholder and list
    const elements = screen.getAllByText(/Paste a Garage fire truck listing URL/i);
    expect(elements.length).toBeGreaterThan(0);
  });

  it("should display error message when error exists", () => {
    mockUsePDFGenerator.mockReturnValue({
      url: "",
      setUrl: vi.fn(),
      error: "Invalid URL format",
      isPending: false,
      generatePDF: vi.fn(),
    });

    render(<Home />);
    
    expect(screen.getByText("Invalid URL format")).toBeInTheDocument();
  });

  it("should show loading state when pending", () => {
    mockUsePDFGenerator.mockReturnValue({
      url: "https://withgarage.com/listing/abc-123",
      setUrl: vi.fn(),
      error: "",
      isPending: true,
      generatePDF: vi.fn(),
    });

    render(<Home />);
    
    expect(screen.getByText("Generating Invoice...")).toBeInTheDocument();
  });

  it("should disable button when pending", () => {
    mockUsePDFGenerator.mockReturnValue({
      url: "https://withgarage.com/listing/abc-123",
      setUrl: vi.fn(),
      error: "",
      isPending: true,
      generatePDF: vi.fn(),
    });

    render(<Home />);
    
    const button = screen.getByRole("button", { name: /Generating Invoice/i });
    expect(button).toBeDisabled();
  });

  it("should disable button when URL is empty", () => {
    mockUsePDFGenerator.mockReturnValue({
      url: "",
      setUrl: vi.fn(),
      error: "",
      isPending: false,
      generatePDF: vi.fn(),
    });

    render(<Home />);
    
    const button = screen.getByRole("button", { name: /Generate PDF Invoice/i });
    expect(button).toBeDisabled();
  });
});
