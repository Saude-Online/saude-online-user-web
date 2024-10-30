import { isAxiosError } from 'axios'

export type AxiosErrorHandlerProps = (error: unknown) => string

export const axiosErrorHandler: AxiosErrorHandlerProps = (error) => {
  let errorMessage =
    'Erro ao processar a solicitação. Por favor, tente novamente mais tarde.'

  if (
    isAxiosError(error) &&
    error.response &&
    error.response.data &&
    error.response.data.message
  ) {
    errorMessage = error.response.data.message
  }

  return errorMessage
}
