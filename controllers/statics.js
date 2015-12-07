// GET /
function home(req, res) {
  res.render('home');
}
//dashboard page
// function dashboard (req, res) {
//   res.render('dashboard')
// }

module.exports = {
  home: home
}
