import session from "express-session";

const TWO_HOURS = 60 * 60 * 2;

const SESS_NAME = "hung";
const SESS_SECRET = "nguyenhuuhung";
const SESS_LIFETIME = TWO_HOURS;

export function Session() {
  return session({
    name: SESS_NAME,
    resave: false,
    saveUninitialized: false,
    secret: SESS_SECRET,
    cookie: {
      maxAge: SESS_LIFETIME,
      sameSite: true,
      secure: true,
    },
  });
}
