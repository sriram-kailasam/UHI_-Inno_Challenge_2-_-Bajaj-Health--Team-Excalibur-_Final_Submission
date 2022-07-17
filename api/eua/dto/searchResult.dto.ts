export type SearchResult = {
  name: string;
  experience?: number;
  hprId?: string;
  fees?: number | null;
  languages?: string[] | null;
  imageUri?: string | null;
  gender?: string | null;
  speciality?: string | null;
  education?: string | null;
}
