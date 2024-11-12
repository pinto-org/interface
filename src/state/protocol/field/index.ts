import { TV } from "@/classes/TokenValue";
import { QueryKey } from "@tanstack/react-query";

export interface FieldTemperature {
  max: TV;
  scaled: TV;
}

export interface FieldQueryKeys {
  temperature: QueryKey;
  soil: QueryKey;
}
