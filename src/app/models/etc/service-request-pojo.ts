import {CustomerPojo, ServiceRequestPojo, Workflow} from "eshdc-sdk";
import * as moment from 'moment';

export class ServiceRequestPojoImpl implements ServiceRequestPojo{
  additionalInformation: string;
  applicationDate: string;
  applicationName: string;
  customer: CustomerPojo;
  createdBefore: string;
  createdAfter: string;
  id: number;
  isDraft: boolean;
  reasonForRequest: string;
  serviceRequestWorkflow: Workflow;
  status: ServiceRequestPojo.StatusEnum;
  taxpayerReference: string;
  trackingId: string;
  dateCreatedBefore: Date;
  dateCreatedAfter: Date;
  type: ServiceRequestPojo.TypeEnum;

  public set createdBeforeDate(date: Date) {
    this.createdBefore = '';
    if (date) {
      this.createdBefore = moment(date).format('YYYY-MM-DD');
    }
    this.dateCreatedBefore = date;
  }

  public set createdAfterDate(date: Date) {
    this.createdAfter = '';
    if (date) {
      this.createdAfter = moment(date).format('YYYY-MM-DD');
    }
    this.dateCreatedAfter = date;
  }
}
