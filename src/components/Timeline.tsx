/**
 * Timeline component.
 *
 * Renders an interactive, scroll-animated vertical timeline
 * depicting the five major phases of an Indian General or
 * State Assembly Election. Uses Framer Motion for reveal
 * animations triggered by viewport intersection.
 */
"use client";

import { motion } from "framer-motion";

/** Represents a single phase on the election timeline */
interface TimelineEvent {
  /** Short phase label (e.g., "Phase 1") */
  phase: string;
  /** Descriptive title of the phase */
  title: string;
  /** Detailed explanation of what happens in this phase */
  description: string;
  /** Approximate date or trigger for this phase */
  date: string;
  /** Tailwind border-color class for the timeline dot */
  color: string;
}

/** Static data for the five election phases */
const timelineEvents: TimelineEvent[] = [
  {
    phase: "Phase 1",
    title: "Model Code of Conduct Enforced",
    description:
      "Begins immediately after the Election Commission announces election dates. Governs the conduct of political parties and candidates.",
    date: "Announcement Day",
    color: "border-[#FF9933]",
  },
  {
    phase: "Phase 2",
    title: "Filing of Nominations",
    description:
      "Candidates submit their nomination papers to the Returning Officer along with affidavits detailing assets and criminal records.",
    date: "Approx. 3 weeks before poll",
    color: "border-blue-500",
  },
  {
    phase: "Phase 3",
    title: "Scrutiny & Withdrawal",
    description:
      "Nomination papers are scrutinized. Candidates are given a window to withdraw their nominations if they choose.",
    date: "Approx. 2 weeks before poll",
    color: "border-purple-500",
  },
  {
    phase: "Phase 4",
    title: "Polling Day",
    description:
      "Voters cast their votes using Electronic Voting Machines (EVMs) equipped with VVPATs across designated polling booths.",
    date: "Election Day",
    color: "border-[#138808]",
  },
  {
    phase: "Phase 5",
    title: "Counting & Results",
    description:
      "EVMs are opened under heavy security. Votes are counted and results are officially declared by the ECI.",
    date: "Result Day",
    color: "border-white",
  },
];

export default function Timeline() {
  return (
    <section
      id="timeline"
      className="py-20 bg-[#0A192F]"
      aria-labelledby="timeline-heading"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2
            id="timeline-heading"
            className="text-3xl md:text-4xl font-bold mb-4 heading-gradient"
          >
            Election Timeline
          </h2>
          <p className="text-gray-400 text-lg">
            Understanding the typical phases of an Indian General or State
            Assembly Election.
          </p>
        </div>

        <ol
          className="relative border-l border-white/20 ml-3 md:ml-0 md:pl-0"
          aria-label="Election timeline phases"
        >
          {timelineEvents.map((event, index) => (
            <motion.li
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              key={index}
              className="mb-10 ml-6 md:ml-0 md:flex md:items-center relative"
            >
              {/* Timeline dot */}
              <div
                className={`absolute w-4 h-4 bg-[#0A192F] rounded-full border-2 ${event.color} -left-[1.95rem] md:left-1/2 md:-ml-2 top-1.5 md:top-auto`}
                aria-hidden="true"
              />

              <div className="md:w-1/2 md:pr-12 md:text-right">
                <span className="text-[#FF9933] font-bold text-sm uppercase tracking-wider block mb-1">
                  {event.phase}
                </span>
                <h3 className="text-xl font-bold text-white mb-2">
                  {event.title}
                </h3>
                <span className="inline-block bg-white/10 text-gray-300 text-xs px-2 py-1 rounded mb-2 md:hidden">
                  {event.date}
                </span>
              </div>

              <div
                className="hidden md:block absolute left-1/2 -ml-0.5 w-[1px] h-full bg-white/20 -z-10"
                aria-hidden="true"
              />

              <div className="md:w-1/2 md:pl-12 pt-2 md:pt-0">
                <span className="hidden md:inline-block bg-white/10 text-gray-300 text-xs px-2 py-1 rounded mb-3">
                  {event.date}
                </span>
                <p className="text-gray-400 leading-relaxed">
                  {event.description}
                </p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
