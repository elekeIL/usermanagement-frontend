import {ServiceRequestCreationDto} from "eshdc-sdk";
import {CtcRequestDocumentType} from "../../services/ctc-request.service";

export class ServiceRequestCreationDtoImpl implements ServiceRequestCreationDto {
  serviceRequestId: number;
  additionalInformation: string;
  applicationName: string;
  documentTypes: CtcRequestDocumentType.DocumentTypeEnum;
  draft: boolean;
  estateCode: string;
  file: Blob;
  plotCode: string;
  plotCodes: Array<string>;
  reason: string;
  type: ServiceRequestCreationDto.TypeEnum;

}
