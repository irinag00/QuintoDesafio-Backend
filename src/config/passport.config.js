import passport from "passport";
import local from "passport-local";
import { userModel } from "../dao/models/users.model.js";
import { createHash, isValidPassword } from "../utils.js";

const localStrategy = local.Strategy;
const initializePassport = () => {
  passport.use(
    "register",
    new localStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, username, password, done) => {
        try {
          const { first_name, last_name, email, age } = req.body;
          if (!first_name || !last_name || !email || !age || !password) {
            return done(null, false, { message: "Faltan campos obligatorios" });
          }
          const user = await userModel.findOne({ email: username });
          if (user) {
            return done(null, false, {
              message: "El usuario ya está registrado",
            });
          }
          const newUser = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
          };
          const result = await userModel.create(newUser);
          return done(null, result);
        } catch (error) {
          return done(null, false, { message: "Error al registrarse" });
        }
      }
    )
  );

  passport.use(
    "login",
    new localStrategy(
      { usernameField: "email", passReqToCallback: true },
      async (req, username, password, done) => {
        try {
          const user = await userModel.findOne({ email: username });
          if (!user) {
            return done(null, false, { message: "El usuario no existe" });
          }
          if (!isValidPassword(password, user)) {
            return done(null, false, {
              message: "La contraseña es incorrecta",
            });
          }
          return done(null, user);
        } catch (error) {
          return done(null, false, { message: "Error al iniciar sesión" });
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await userModel.findOne({ _id: id });
      done(null, user);
    } catch (error) {
      done(`Error al deserializar el usuario: ${error}`);
    }
  });
};

export default initializePassport;
