function useMiddleware(middlewares) {
    const results = middlewares.map((middleware) => middleware());

    return results.every((result) => result === true);
}

export default useMiddleware;
