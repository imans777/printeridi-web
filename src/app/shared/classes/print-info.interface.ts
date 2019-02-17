import {PrinterTemperatures} from "./temperatures.interface";

export interface PrintInfo {
  time: string | number;
  temperature: string | PrinterTemperatures;
  file_name: string;
  filament_type?: string;
  is_finished: string | boolean;
}
