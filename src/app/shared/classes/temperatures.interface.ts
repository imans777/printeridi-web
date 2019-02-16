export interface Temperature {
  cur: number;
  goal: number;
}

export interface PrinterTemperatures {
  bed: Temperature | number;
  ext: Temperature | number;
  ext2?: Temperature | number;
}
