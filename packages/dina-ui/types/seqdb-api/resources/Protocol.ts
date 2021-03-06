import { KitsuResource } from "kitsu";
import { Product } from "./Product";

export interface ProtocolAttributes {
  type: string;
  name: string;
  group?: string;
  version?: string;
  description?: string;
  steps?: string;
  notes?: string;
  reference?: string;
  equipment?: string;
  forwardPrimerConcentration?: string;
  reversePrimerConcentration?: string;
  reactionMixVolume?: string;
  reactionMixVolumePerTube?: string;
  lastModified?: string;
}

export interface ProtocolRelationships {
  kit?: Product;
}

export type Protocol = KitsuResource &
  ProtocolAttributes &
  ProtocolRelationships;

export const protocolTypeLabels = {
  COLLECTION_EVENT: "Collection Event",
  DNA_EXTRACTION: "DNA Extraction",
  PCR_REACTION: "PCR Reaction",
  SEQ_REACTION: "Sequencing Reaction",
  SPECIMEN_PREPARATION: "Specimen Preparation"
};
