/**
 * @jest-environment jsdom
 */
import { render, screen } from "@testing-library/react";
import Timeline from "@/components/Timeline";

// Mock framer-motion to avoid animation issues in tests
jest.mock("framer-motion", () => ({
  motion: {
    li: ({
      children,
      ...props
    }: {
      children: React.ReactNode;
      [key: string]: unknown;
    }) => <li {...props}>{children}</li>,
  },
}));

describe("Timeline", () => {
  it("renders the section with aria-labelledby", () => {
    render(<Timeline />);
    const section = document.getElementById("timeline");
    expect(section).toBeInTheDocument();
    expect(section).toHaveAttribute("aria-labelledby", "timeline-heading");
  });

  it("renders the heading", () => {
    render(<Timeline />);
    expect(
      screen.getByRole("heading", { name: /Election Timeline/i })
    ).toBeInTheDocument();
  });

  it("renders all five election phases", () => {
    render(<Timeline />);
    expect(
      screen.getByText("Model Code of Conduct Enforced")
    ).toBeInTheDocument();
    expect(screen.getByText("Filing of Nominations")).toBeInTheDocument();
    expect(screen.getByText("Scrutiny & Withdrawal")).toBeInTheDocument();
    expect(screen.getByText("Polling Day")).toBeInTheDocument();
    expect(screen.getByText("Counting & Results")).toBeInTheDocument();
  });

  it("uses an ordered list for the timeline", () => {
    render(<Timeline />);
    const list = screen.getByRole("list", {
      name: /Election timeline phases/i,
    });
    expect(list).toBeInTheDocument();
    expect(list.tagName).toBe("OL");
  });
});
