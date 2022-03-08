const conf = require('../config/auth.config')
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {getRepository, getConnection} = require('typeorm');
const User = require('../entity/user')


exports.deleteMyProfile = async (req, res, next) => {
    try{
      const token = req.headers["authorization"];
      
      jwt.verify(token, conf.secret, async (err, decoded) => {
        if(err){
            res.status(401).send({message: "Unauthorized"})
        }else{
            try{
                await getConnection()
                .createQueryBuilder()
                .delete()
                .from(User)
                .where("name = :name", { name: decoded.name })
                .execute();
                res.send("successfully deleted")
            }
            catch(error){
                res.status(401).send({error})
            }
        }
      });   
    }
    catch(error){
      res.status(500).send({error})
    }
  }

  exports.updateMyProfile = async (req, res, next) => {
    const token = req.headers["authorization"];
    jwt.verify(token, conf.secret, async (err, decoded) => {
        if(err){
            return res.status(401).send({message: "Unauthorized"})
        }else{
            try{
                await getConnection()
                .createQueryBuilder()
                .update(User)
                .set({ 
                    name: req.body.name, 
                    password: bcrypt.hashSync(req.body.password, 8),
                })
                .where("name = :name", { name: decoded.name })
                .execute();
                res.send("successfully updated")
            }
            catch(error){
                res.status(500).send({error})
            }
        }
    })
  }

  exports.getMyProfile = async (req, res, next) => {
    const token = req.headers["authorization"];
    jwt.verify(token, conf.secret, async (err, decoded) => {
      if(err){
          return res.status(401).send({message: "Unauthorized"})
      }else{
          try{
              const userRepository = getRepository(User);
              const details = await userRepository.findOne({
                      where: {name: decoded.name},
                      select: ['role', 'name']
                  }
              )
              res.send(details)
          }
          catch(error){
              res.status(500).send({error})
          }
      }
  })
  }