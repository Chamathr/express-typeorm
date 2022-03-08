const conf = require('../config/auth.config')
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require('../entity/user')
const {getRepository, getConnection} = require('typeorm');

exports.allUsers = async (req, res, next) => {
  try{
    const userRepository = getRepository(User);
    const users = await userRepository.find()
    res.send(users)
  }
  catch(error){
    console.log(error);
    res.status(500).send({error})
  }
}

exports.signinUsers = async (req, res, next) => {
  try{
    const userRepository = getRepository(User);
    const user = await userRepository.findOne({
      where: {name: req.body.name}
    })
    if(!user){
      res.send("Invalid user")
    }else{
      const passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );
      if(!passwordIsValid){
        res.send("Invalid password")
      }else{
        const role = await userRepository.findOne({
          where: {name: req.body.name},
          select: ['role']
        })
        const token = jwt.sign({ name: user.name, userRole: role.role }, conf.secret, {
          expiresIn: conf.time 
        });
        res.send(`succesfully logged in... ${token}`)
      }
    }

  }
  catch(error){
    res.status(500).send({error})
  }
}

exports.addUsers = async (req, res, next) => {
    try{
      const userRepository = getRepository(User);
      const userExists = await userRepository.findOne({
        where: {name: req.body.name}
      })
      if(userExists){
        return res.send({message: "user already exits"})
      }else{
        try{
          await getConnection()
          .createQueryBuilder()
          .insert()
          .into(User)
          .values([
              { 
                name: req.body.name, 
                password: bcrypt.hashSync(req.body.password, 8),
                role: req.body.role
              }
          ])
          .execute();
          res.send('successfully created')
        }
        catch(error){
          res.status(500).send({ error });
        }
      }
    }
    catch(error){
      res.status(401).send({error})
    }
}

exports.updateUsers = async (req, res, next) => {
  try{
    await getConnection()
    .createQueryBuilder()
    .update(User)
    .set({ 
        name: req.body.name, 
        password: bcrypt.hashSync(req.body.password, 8),
    })
    .where("name = :name", { name: req.params.name })
    .execute();
    res.send("successfully updated")
  }
  catch(error){
    res.status(500).send({error})
  }
}

exports.deleteUsers = async (req, res, next) => {
  try{
    await getConnection()
    .createQueryBuilder()
    .delete()
    .from(User)
    .where("name = :name", { name: req.params.name })
    .execute();
    res.send("successfully deleted")
  }
  catch(error){
    res.status(500).send({error})
  }

}
