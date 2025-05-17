/*
  Authentication source file for c3
*/

// Libraries
import { db } from "@/db/db";
import { session, user } from "@/db/schema";
import { redirect } from "next/navigation";
import * as crypto from "crypto";
import { eq } from "drizzle-orm";
import * as jwt from "jose";
import { cookies } from "next/headers";

export class Authentication {
  // Function to register
  public static async register(formData: FormData) {
    "use server";
    const data = formData;
    const name = String(data.get("name"));
    const email = String(data.get("email"));
    const rawPassword = String(data.get("password"));

    // Create the salting variables
    const salt1 = crypto.randomBytes(256).toString("hex");
    const salt2 = crypto.randomBytes(256).toString("hex");

    // First hash (sha3-256), then salted double-hash (sha3-512)
    let password = crypto
      .createHash("sha3-256")
      .update(rawPassword)
      .digest("hex");
    password = crypto
      .createHash("sha3-512")
      .update(salt1 + password + salt2)
      .digest("hex");

    const connection = await db();

    // Fetch all existing users and check if this email is already in use
    const allUsers = await connection.select().from(user);
    const emailExists = (
      await connection
        .select()
        .from(user)
        .where(eq(user.email, email))
    ).length > 0;

    if (allUsers.length === 0) {
      // First-ever signup → owner
      await connection.insert(user).values({
        name,
        password,
        salt1,
        salt2,
        email,
        role: "owner",
      });
    } else if (!emailExists) {
      // Subsequent signup with a new email → normal user
      await connection.insert(user).values({
        name,
        password,
        salt1,
        salt2,
        email,
        role: "user",
      });
    } else {
      // Email already in use
      return redirect("/account?action=register&message=Email is already used.");
    }

    return redirect("/account");
  }

  /*
    Beautiful login function for beautiful people
  */
  public static async login(formData: FormData) {
    "use server";
    const data = formData;
    const email = String(data.get("email"));
    const rawPassword = String(data.get("password"));
    const connection = await db();

    // Look up user by email
    const creds = await connection
      .select()
      .from(user)
      .where(eq(user.email, email));

    if (creds.length === 0) {
      return redirect("/account?message=Incorrect email or password.");
    }

    // Recompute password hash with stored salts
    let password = crypto
      .createHash("sha3-256")
      .update(rawPassword)
      .digest("hex");
    password = crypto
      .createHash("sha3-512")
      .update(creds[0].salt1 + password + creds[0].salt2)
      .digest("hex");

    if (password !== creds[0].password) {
      return redirect("/account?message=Incorrect email or password.");
    }

    // Password OK → bump login count
    await connection
      .update(user)
      .set({ loginCount: creds[0].loginCount + 1 })
      .where(eq(user.id, creds[0].id));

    // Create a random session identity, store in DB
    const identity = crypto
      .createHash("sha3-512")
      .update(crypto.randomBytes(200).toString("hex"))
      .digest("hex");

    const tokenHash = crypto
      .createHash("sha3-512")
      .update(identity)
      .digest("hex");

    await connection.insert(session).values({
      userID: creds[0].id,
      token: tokenHash,
      expirationTime: Date.now() + 24 * 60 * 60 * 1000, // 24h from now
      expired: false,
    });

    // Issue a signed JWT carrying the raw identity
    const token = await new jwt.SignJWT({ info: identity })
      .setAudience("hyperion-c3")
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("1d")
      .sign(
        crypto.createSecretKey(
          Buffer.from(process.env.JWT_SECRET!, "utf-8")
        )
      );

    // Set cookie
    (await cookies()).set("header", token, { sameSite: "strict" });

    return redirect("/dashboard");
  }

  /*
    Stateless session verification
  */
  public static async verifySession() {
    const connection = await db();
    const ck = await cookies();
    const cookie = ck.get("header");
    if (!cookie) {
      return { action: "logout" as const };
    }

    try {
      // Verify JWT signature & expiration
      const { payload } = await jwt.jwtVerify(
        cookie.value,
        crypto.createSecretKey(Buffer.from(process.env.JWT_SECRET!, "utf-8"))
      );

      // Re-hash the identity to match session.token
      const tokenHash = crypto
        .createHash("sha3-512")
        .update(String(payload.info))
        .digest("hex");

      // Look up session
      const [sess] = await connection
        .select()
        .from(session)
        .where(eq(session.token, tokenHash));

      // Must exist, not marked expired, and not past expirationTime
      if (!sess || sess.expired || sess.expirationTime < Date.now()) {
        return { action: "logout" as const };
      }

      // Fetch user record
      const [acct] = await connection
        .select({
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          active: user.active,
          dateCreated: user.dateCreated,
          loginCount: user.loginCount,
        })
        .from(user)
        .where(eq(user.id, sess.userID));

      if (!acct) {
        return { action: "logout" as const };
      }

      const ok =
        acct.active === "active" ||
        acct.active === null ||
        acct.active === undefined;

      return ok
        ? { action: "continue" as const, credentials: acct }
        : { action: "halt" as const, credentials: acct };
    } catch {
      return { action: "logout" as const };
    }
  }
}