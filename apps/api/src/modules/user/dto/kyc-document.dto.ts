import { IsEnum, IsString, IsUrl, IsNotEmpty } from "class-validator";
import { KycDocumentType } from "@repo/db";

export class SubmitKycDocumentDto {
  @IsEnum(KycDocumentType)
  documentType!: KycDocumentType;

  @IsString()
  @IsNotEmpty()
  @IsUrl()
  fileUrl!: string;
}
