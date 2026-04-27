/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent } from "@testing-library/react";
import VoterGuide from "@/components/VoterGuide";

// Mock framer-motion
jest.mock("framer-motion", () => ({
  motion: {
    div: ({
      children,
      ...props
    }: {
      children: React.ReactNode;
      [key: string]: unknown;
    }) => <div {...props}>{children}</div>,
  },
}));

describe("VoterGuide", () => {
  it("renders the heading", () => {
    render(<VoterGuide />);
    expect(
      screen.getByRole("heading", { name: /Step-by-Step Voter Guide/i })
    ).toBeInTheDocument();
  });

  it("renders all four steps as tabs", () => {
    render(<VoterGuide />);
    const tabs = screen.getAllByRole("tab");
    expect(tabs).toHaveLength(4);
  });

  it("shows the first step as selected by default", () => {
    render(<VoterGuide />);
    const firstTab = screen.getByRole("tab", { name: /Check Eligibility/i });
    expect(firstTab).toHaveAttribute("aria-selected", "true");
  });

  it("switches active tab when a different step is clicked", () => {
    render(<VoterGuide />);
    const secondTab = screen.getByRole("tab", {
      name: /Register to Vote/i,
    });
    fireEvent.click(secondTab);

    expect(secondTab).toHaveAttribute("aria-selected", "true");

    // First tab should no longer be selected
    const firstTab = screen.getByRole("tab", { name: /Check Eligibility/i });
    expect(firstTab).toHaveAttribute("aria-selected", "false");
  });

  it("renders action links that open in new tabs", () => {
    render(<VoterGuide />);
    const link = screen.getByRole("link", {
      name: /Verify Age Requirements/i,
    });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("each tab controls a corresponding panel", () => {
    render(<VoterGuide />);
    const tabs = screen.getAllByRole("tab");
    tabs.forEach((tab) => {
      const controlsId = tab.getAttribute("aria-controls");
      expect(controlsId).toBeTruthy();
      expect(document.getElementById(controlsId!)).toBeInTheDocument();
    });
  });
});
