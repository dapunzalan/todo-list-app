type ConfirmationType = 'default' | 'delete';

export interface ConfirmationDialog {
  type: ConfirmationType;
  subType: ConfirmationType;
  title?: string;
  message: string;
  subMessage?: string;
  names?: Array<string>;
  withCloseIcon?: boolean;
  positiveTxt?: string;
  negativeTxt?: string;
}