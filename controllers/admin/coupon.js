/* eslint-disable no-underscore-dangle */
const Coupon = require("../../model/coupon");
const Banner = require("../../model/banner");

module.exports = {
    coupon:async (req,res) => {
        try{
            const coupons = await Coupon.find().lean();
            res.render('admin/coupon',{admin:true,coupons});
        }catch{
            res.render('admin/error500')
        }
    },

    addCoupon: (req, res) => {
        try {
          const data = req.body;
          const discount = parseInt(data.discount, 10);
          const max = parseInt(data.max, 10);
        //   const discount = dis / 100;
          Coupon.create({
              couponName: data.coupon,
              discount,
              maxLimit: max,
              expirationTime: data.exdate,
            })
            .then(() => {
              res.redirect("/admin/coupon");
            });
        } catch {
          res.render("admin/error500");
        }
      },

      editCoupon: (req, res) => {
        try{
            const {id} = req.params;
            const data = req.body;
            Coupon.updateOne(
                { _id: id },
                {
                  couponName: data.coupon,
                  discount: data.discount,
                  maxLimit: data.max,
                  expirationTime: data.exdate,
                }
              )
              .then(() => {
                res.redirect("/admin/coupon");
              });
            }catch{
              res.render('admin/error500');
            }
      },

      deleteCoupon:(req,res)=>{
        try{
          const {id} = req.params;
          Coupon.deleteOne({_id:id}).then(()=>{
            res.redirect('/admin/coupon');
          })
        }catch{
          res.render('admin/erro500');
        }
        
      },

      banner:async(req,res) => {
        try{
          const banners = await Banner.find().lean();
          res.render('admin/banner',{admin:true,banners})
        }catch{
          res.render('admin/erro500');
        }
      },

      addBanner:async(req,res) => {
        try{
          const coupons = await Coupon.find().lean();
          res.render('admin/addbanner',{admin:true,coupons})
        }catch{
          res.render('admin/erro500');
        }
      },

      addBannerpost: async (req, res) => {
        try {
          const { image } = req.files;
          const data = req.body;
          const newBanner = new Banner({
            banner: data.banner,
            bannerText: data.bannertext,
            couponName: data.couponName,
          });
          const banner = await newBanner.save();
          if (banner) {
            const imageId = banner._id;
            image.mv(`./public/images/banner/${imageId}.jpg`, (err) => {
              if (!err) {
                res.redirect("/admin/banner");
              } else {
                res.render("admin/error500");
              }
            });
          }
        } catch {
          res.render("admin/error500");
        }
      },

      deleteBanner:(req,res)=>{
        try{
          const {id} = req.params;
          Banner.updateOne(
            {_id:id},
            {
              $set: {
                isDeleted: true,
              },
            }
            ).then(()=>{
            res.redirect('/admin/banner');
          })
        }catch{
          res.render('admin/erro500');
        }
        
      },


      
}