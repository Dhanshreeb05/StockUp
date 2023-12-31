export interface IMessage {
    type?: string;
    message?: string;
}
export enum EMessageType {
    SUCCESS = 'success',
    Failed = 'fail',
    INFO = 'info',
    WARNING = 'warning',
}