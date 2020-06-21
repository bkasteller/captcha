module.exports = function (request, response, next)
{
    if (request.session.userId)
    {
        response.redirect('/')
    }
    else
    {
        next()
    }
}
