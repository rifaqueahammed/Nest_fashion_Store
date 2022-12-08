module.exports = {
    verifyLoginAdmin: (req, res, next) => {
      if (req.session.admin) {
        next();
      } else {
        res.redirect("/admin/login");
      }
    },
    verifyLoginUser: (req, res, next) => {
      if (req.session.user) {
        next();
      } else {
        res.render("user/userhome", {user:true});
      }
    },
  };

 
