function flashDataOnSession(req, data, action) {
  req.session.flashData = data;
  req.session.save(action);
}

function getFlashData(req) {
  let sessionData;
  if(!req.session){
    return sessionData;
  }
  sessionData = req.session.flashData;
  req.session.flashData = null;
  return sessionData;
}

module.exports = {
  flashDataOnSession: flashDataOnSession,
  getFlashData: getFlashData,
};
