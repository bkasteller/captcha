module.exports = function (request, response)
{
    request.session.destroy()
    response.clearCookie(require('config').get('App.session.name'))
    response.redirect('/login')
}
