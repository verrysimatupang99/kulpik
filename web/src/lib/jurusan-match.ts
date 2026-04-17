export interface JurusanSpec {
  name: string;
  slug: string;
  minRam: number;
  needGpu: boolean;
}

export const JURUSAN_SPECS: JurusanSpec[] = [
  { name: "Teknik Informatika", slug: "teknik-informatika", minRam: 16, needGpu: false },
  { name: "DKV", slug: "desain-komunikasi-visual", minRam: 16, needGpu: true },
  { name: "Arsitektur", slug: "arsitektur", minRam: 16, needGpu: true },
  { name: "Manajemen", slug: "manajemen", minRam: 8, needGpu: false },
  { name: "Kedokteran", slug: "kedokteran", minRam: 8, needGpu: false },
  { name: "Hukum", slug: "hukum", minRam: 8, needGpu: false },
];

export interface JurusanMatchResult extends JurusanSpec {
  fit: boolean;
}

export function getJurusanMatch(ramGb: number, gpuType: string | null): JurusanMatchResult[] {
  return JURUSAN_SPECS.map((j) => ({
    ...j,
    fit: ramGb >= j.minRam && (!j.needGpu || gpuType === "dedicated"),
  }));
}