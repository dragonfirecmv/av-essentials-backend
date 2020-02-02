import { Catch, ExceptionFilter, HttpException, ArgumentsHost, Logger, HttpStatus } from "@nestjs/common";


@Catch()
export class HttpErrorFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const context = host.switchToHttp()
    const request = context.getRequest()
    const response = context.getResponse()
    const status = exception.getStatus ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR

    const errorResponse = {
      code: status,
      timestamp: `${new Date().toLocaleDateString()}||${new Date().toLocaleTimeString()}`,
      path: request.url,
      method: request.method,
      message: exception.message.error || exception.message || null
    }

    Logger.error(
      `${request.method} ${request.url}`, 
      JSON.stringify(errorResponse), 
      'ExceptionFilter'
    )

    response.status(404).json(errorResponse)

  }
}