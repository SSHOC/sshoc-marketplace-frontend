const errorMiddleware = () => next => action => {
  next(action)

  if (action.error) {
    // TODO: proper error handler
    console.error(action.error)
  }
}

export default errorMiddleware
