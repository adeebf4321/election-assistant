/**
 * @jest-environment jsdom
 */
import { render, screen } from "@testing-library/react";
import Footer from "@/components/Footer";

describe("Footer", () => {
  it("renders the footer with contentinfo role", () => {
    render(<Footer />);
    const footer = screen.getByRole("contentinfo");
    expect(footer).toBeInTheDocument();
  });

  it("displays the disclaimer text", () => {
    render(<Footer />);
    expect(
      screen.getByText(/An independent guide to the Indian Electoral Process/i)
    ).toBeInTheDocument();
  });

  it("renders a link to the official ECI website", () => {
    render(<Footer />);
    const link = screen.getByRole("link", {
      name: /Visit the official Election Commission of India website/i,
    });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "https://eci.gov.in");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });
});
