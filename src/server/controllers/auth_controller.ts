import User from "../models/user";
import {
  createError,
  BAD_REQUEST,
  UNAUTHORIZED,
  CONFLICT
} from "../helpers/error_helper";
import BaseController from "./base_controller";

class AuthController extends BaseController {
  
    async postLogin(){
      const username = String(this.req.body.username);
      const password = String(this.req.body.password);

      if (!username || !password) this.next(createError({
        status: BAD_REQUEST,
        message: "`username` + `password` are required fields"
      }));

      try{
        const user = await new User().verify(username, password);
        if(user){
          this.res.json({
            ok: true,
            message: "Login successful",
            user
          });
        }
      }catch(err){
        this.next(createError({
              status: UNAUTHORIZED,
              message: err
            }));
      }
    }

    async postRegister() {
      const props = this.req.body;

      if (!props.username || !props.password){
        return this.next(createError({
          status: BAD_REQUEST,
          message: "`username` + `password` are required fields"
        }));
      }

      const user = await new User().findOne({ username: props.username });
      if(user) return this.next(createError({
        status: CONFLICT,
        message: "Username already exists"
      }));

      const newUser = await new User().create(props);

      this.res.json({
        ok: true,
        message: "Registration successful",
        newUser
      });
    }
  }
  
  export default AuthController;
  