/**
 * @jest-environment jsdom
 */
import { render, screen } from "@testing-library/react";
import PollingMap from "@/components/PollingMap";

describe("PollingMap", () => {
  it("renders the section heading", () => {
    render(<PollingMap />);
    expect(
      screen.getByRole("heading", { name: /Find Election Offices Near You/i })
    ).toBeInTheDocument();
  });

  it("renders the Google Maps iframe with accessible title", () => {
    render(<PollingMap />);
    const iframe = screen.getByTitle(
      /Google Maps showing Election Commission offices across India/i
    );
    expect(iframe).toBeInTheDocument();
    expect(iframe.tagName).toBe("IFRAME");
  });

  it("renders the Electoral Roll search link", () => {
    render(<PollingMap />);
    const link = screen.getByRole("link", {
      name: /Search your name on the official Electoral Roll website/i,
    });
    expect(link).toHaveAttribute(
      "href",
      "https://electoralsearch.eci.gov.in/"
    );
  });

  it("renders the Voter Helpline App link", () => {
    render(<PollingMap />);
    const link = screen.getByRole("link", { name: /Voter Helpline App/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("target", "_blank");
  });
});
