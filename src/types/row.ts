export type RowStatus = "completed" | "active" | "inactive";
export type Row = {
  letter: string;
  index: number;
  status: RowStatus;
};
