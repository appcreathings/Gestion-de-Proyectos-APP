import { z } from "zod";
import { DayDate, Id, IsoDate, QuarterStatus, SCHEMA_VERSION } from "./common";

/**
 * A real grouping level above projects (e.g. "Q3 2026"), used to roll up
 * progress across the projects assigned to it via `Project.quarterId`.
 */
export const QuarterSchema = z.object({
  id: Id,
  schemaVersion: z.number().default(SCHEMA_VERSION),
  name: z.string().min(1),
  goal: z.string().default(""),
  startDate: DayDate.default(null),
  endDate: DayDate.default(null),
  status: QuarterStatus.default("planned"),
  tags: z.array(z.string()).default([]),
  createdAt: IsoDate,
  updatedAt: IsoDate,
});
export type Quarter = z.infer<typeof QuarterSchema>;
