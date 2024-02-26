function handleErrors(error, req, res, next){
    console.log(error);

    if(error.code === 401){
        res.status(401).render('shared/errorMessage', {errorMessage : 'You are not Authenticated.'});
    }
    else if(error.code === 403){
        res.status(403).render('shared/errorMessage', {errorMessage : 'You are not Authorized.'});
    }
    else if(error.code === 404){
        res.status(404).render('shared/errorMessage', {errorMessage : 'Request Resource Not found!'});
    }
    else{
        res.status(500).render('shared/errorMessage', {errorMessage : 'Something went wrong. Try again later.'});
    }

    next();
}

module.exports = handleErrors;