// export default (myErrorFun) =>(req, res, next)=>{
//     Promise.resolve(myErrorFun(req, res, next)).catch(next)
// }

const handleAsyncError = (theFunc) => (req, res, next) => {
  Promise.resolve(theFunc(req, res, next)).catch(next);
};

export default handleAsyncError;