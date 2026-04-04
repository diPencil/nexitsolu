import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const email = "admin@nexitsolu.com";
    const username = "admin";
    const hashedPassword = await bcrypt.hash("Admin@123", 10);
    
    const admin = await prisma.user.upsert({
      where: { email },
      update: {
        username,
        password: hashedPassword,
        role: "ADMIN",
        name: "Main Admin",
        status: "ACTIVE",
      },
      create: {
        email,
        username,
        password: hashedPassword,
        role: "ADMIN",
        name: "Main Admin",
        status: "ACTIVE",
      },
    });

    return NextResponse.json({
      message: "Admin created successfully!",
      credentials: {
        email,
        password: "Admin@123"
      },
      user: admin.email,
      note: "Run this once after deploy, then remove or lock down this endpoint."
    });
  } catch (error: any) {
    console.error("Setup Error:", error);
    return NextResponse.json({ 
      error: "Something went wrong", 
      details: error.message 
    }, { status: 500 });
  }
}
