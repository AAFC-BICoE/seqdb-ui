import { KitsuResource } from "kitsu";
import { Agent } from "./Agent";
import { ManagedAttributeMap } from "./ManagedAttributeMap";

export interface MetadataAttributes {
  type: "metadata";
  bucket: string;
  fileIdentifier: string;
  fileExtension: string;
  dcType: "Image" | "Moving Image" | "Sound" | "Text";
  xmpRightsWebStatement?: string;

  // optional fields
  acRights?: string;
  acCaption?: string;
  dcFormat?: string;
  createdDate?: string;
  deletedDate?: string;
  acDigitizationDate?: string;
  xmpMetadataDate?: string;
  acTags?: string[];
  originalFilename?: string;
  notPubliclyReleasableReason?: string;
  publiclyReleasable?: boolean;

  acHashFunction?: string;
  acHashValue?: string;
}

export interface MetadataRelationships {
  acMetadataCreator?: Agent | null;
  managedAttributeMap?: ManagedAttributeMap | null;
}

export type Metadata = KitsuResource &
  MetadataAttributes &
  MetadataRelationships;
