const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

async function request(method: "GET" | "POST", url: string, data?: any) {
  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  const res = await fetch(`${BASE_URL}${url}`, options);

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.error || "Request failed");
  }

  return await res.json();
}

export const api = {
  // Base Resume
  getBaseResume: () => request("GET", "/resume/base"),
  saveBaseResume: (json: any) => request("POST", "/resume/base", json),

  // Generate Resume
  generateResume: (data: {
    jd: string;
    jobRole: string;
    company: string;
  }) => request("POST", "/generate", data),

  // Quick Copy Fields
  getQuickFields: () => request("GET", "/resume/quick"),

  // Upload Parse
  async parseUploadedFile(file: File) {
    const form = new FormData();
    form.append("file", file);

    const res = await fetch(`${BASE_URL}/upload/parse`, {
      method: "POST",
      body: form,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => null);
      throw new Error(err?.error || "Upload failed");
    }

    return await res.json();
  },

  // Generated history
  getGeneratedList: () => request("GET", "/generated/list"),
  getGeneratedResume: (filename: string) =>
    request("GET", `/generated/${filename}`),

  // PDF direct access
  pdfUrl: (filename: string) => `${BASE_URL.replace("/api", "")}/pdfs/${filename}`,
};

