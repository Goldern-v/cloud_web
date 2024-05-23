import service from '@/utils/request'
import { iams } from '../java/prefix'

export const useAttachmentSubmitApi = (dataForm: any) => {
  return service.post(iams + `/sys/attachment`, dataForm)
}
