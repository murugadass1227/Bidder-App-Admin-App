import { IsString, IsUrl, IsNotEmpty } from "class-validator";

export class UploadReservationProofDto {
  /** URL of uploaded reservation amount proof document (upload handled by storage service) */
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  fileUrl!: string;
}
