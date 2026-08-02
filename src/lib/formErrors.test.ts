import { describe, it, expect } from "vitest";
import { requiredFields } from "@/lib/formErrors";

interface FormValues {
  title: string;
  name: string;
  url: string;
}

describe("requiredFields", () => {
  const rules = [
    {
      field: "title" as const,
      message: "El título no puede estar vacío",
      test: (v: FormValues) => v.title.trim().length > 0,
    },
    {
      field: "url" as const,
      message: "La URL es obligatoria",
      test: (v: FormValues) => v.url.trim().length > 0,
    },
  ];

  it("returns no errors when all required fields are filled", () => {
    const errors = requiredFields({ title: "Tarea", name: "x", url: "https://a.com" }, rules);
    expect(errors).toEqual([]);
  });

  it("returns the failing field with its message when empty", () => {
    const errors = requiredFields({ title: "   ", name: "x", url: "https://a.com" }, rules);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toEqual({ field: "title", message: "El título no puede estar vacío" });
  });

  it("keeps the order of errors as declared in the rules", () => {
    const errors = requiredFields({ title: "", name: "x", url: "" }, rules);
    expect(errors).toHaveLength(2);
    expect(errors[0].field).toBe("title");
    expect(errors[1].field).toBe("url");
  });

  it("treats whitespace-only strings as empty", () => {
    const errors = requiredFields({ title: "\t \n", name: "x", url: "  " }, rules);
    expect(errors.map((e) => e.field)).toEqual(["title", "url"]);
  });

  it("returns [] when rules is empty", () => {
    const errors = requiredFields({ title: "", name: "", url: "" }, []);
    expect(errors).toEqual([]);
  });

  it("handles a single rule", () => {
    const single = [
      {
        field: "name" as const,
        message: "Falta el nombre",
        test: (v: FormValues) => v.name.trim().length > 0,
      },
    ];
    expect(requiredFields({ title: "t", name: "ok", url: "u" }, single)).toEqual([]);
    expect(requiredFields({ title: "t", name: "", url: "u" }, single)).toEqual([
      { field: "name", message: "Falta el nombre" },
    ]);
  });
});
