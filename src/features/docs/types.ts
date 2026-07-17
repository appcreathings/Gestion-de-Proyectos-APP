import type { ReactNode } from "react";

export type DocGroup = "empezar" | "organizar" | "plantillas-ia" | "seguimiento";

export type DocModule = {
  slug: string;
  title: string;
  excerpt: string;
  group: DocGroup;
  seo: {
    title: string;
    description: string;
    ogImageAlt?: string;
  };
  content: {
    eyebrow: string;
    intro: ReactNode;
    sections: { heading: string; body: ReactNode }[];
  };
};
