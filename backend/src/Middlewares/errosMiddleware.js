const errosMiddleware = (erro, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  res.status(statusCode);

  res.json({
    mensagem: erro.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : erro.stack,
  });
};

module.exports = errosMiddleware;