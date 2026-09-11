// The talk as data. Sections are the blocks of the talk; each
// slide is one beat on one surface. Notes carry the script.

export type Glance = { glance?: string[] };
export type Slide = Glance & (
  | { kind: "text"; text: string; sub?: string; notes?: string; dark?: boolean; image?: string; box?: boolean }
  | { kind: "photo"; image: string; fit?: "cover" | "contain"; caption?: string; notes?: string }
  | { kind: "quote"; text: string; who: string; when: string; logos?: string[]; image?: string; notes?: string }
  | { kind: "lines"; lines: string[]; aside?: string[]; notes?: string }
  | { kind: "receipt"; id: string; title?: string; image?: string; notes?: string }
  | { kind: "title"; notes?: string }
  | {
      kind: "demo";
      demo: "spec-diff" | "app" | "terminal" | "critic" | "seed";
      from?: 1 | 2 | 3 | 4;
      to?: 1 | 2 | 3 | 4;
      stage?: 1 | 2 | 3 | 4;
      tab?: "product" | "process";
      title?: string;
      notes?: string;
    });

export type Section = {
  id: string;
  title: string;
  minutes: number;
  at?: string;
  slides: Slide[];
};

import { generatedSections } from "./slides.generated";

export const sections: Section[] = generatedSections;

export const totalMinutes = sections.reduce((a, s) => a + s.minutes, 0);
